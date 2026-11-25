"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { AudioLines, Pause, Play, RotateCcw, Volume2, VolumeX, X } from "lucide-react"
import {
  buildWelcomeScript,
  DEFAULT_VOICE_PREFERENCES,
  getInteractionVoiceScript,
  getPageVoiceScript,
  getVoiceProfile,
  notifyVoicePreferencesChanged,
  readVoicePreferences,
  saveVoicePreferences,
  VOICE_EXIT_EVENT,
  VOICE_PREFERENCES_EVENT,
  VOICE_REPLAY_EVENT,
  type VoicePreferences,
} from "@/lib/voice-guide"

type SpeechStatus = "idle" | "playing" | "paused" | "unavailable"

const VOICE_EXIT_SUPPRESSION_KEY = "bluepayVoiceExitSuppressedUntil"

export function BluepayVoiceGuide() {
  const pathname = usePathname()
  const [preferences, setPreferences] = useState<VoicePreferences>(DEFAULT_VOICE_PREFERENCES)
  const [isOpen, setIsOpen] = useState(false)
  const [isSupported, setIsSupported] = useState<boolean | null>(null)
  const [sessionActivated, setSessionActivated] = useState(false)
  const [speechStatus, setSpeechStatus] = useState<SpeechStatus>("idle")
  const [controlPosition, setControlPosition] = useState({ left: 16, top: 16 })
  const [panelPlacement, setPanelPlacement] = useState<"above" | "below">("below")
  const [panelAlignment, setPanelAlignment] = useState<"left-0" | "right-0">("left-0")
  const preferencesRef = useRef(preferences)
  const sessionActivatedRef = useRef(false)
  const lastPathRef = useRef<string | null>(null)
  const initialGuidancePendingRef = useRef(true)
  const welcomedProfileRef = useRef("")
  const farewellRef = useRef(false)
  const utteranceIdRef = useRef(0)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  preferencesRef.current = preferences

  const stopSpeech = useCallback(() => {
    farewellRef.current = false
    utteranceIdRef.current += 1
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel()
    utteranceRef.current = null
    setSpeechStatus("idle")
  }, [])

  const speak = useCallback((text: string) => {
    const currentPreferences = preferencesRef.current
    if (!text.trim() || !currentPreferences.voiceGuideEnabled || currentPreferences.muted) return
    if (typeof window === "undefined" || !("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
      setIsSupported(false)
      setSpeechStatus("unavailable")
      return
    }

    const speech = window.speechSynthesis
    speech.cancel()
    const requestId = utteranceIdRef.current + 1
    utteranceIdRef.current = requestId

    const utterance = new SpeechSynthesisUtterance(text)
    const voices = speech.getVoices()
    const voice = voices.find((candidate) => candidate.lang.toLowerCase() === "en-ng")
      || voices.find((candidate) => candidate.lang.toLowerCase() === "en-gb")
      || voices.find((candidate) => candidate.lang.toLowerCase().startsWith("en-"))
      || voices.find((candidate) => candidate.lang.toLowerCase().startsWith("en"))
    if (voice) utterance.voice = voice
    utterance.lang = voice?.lang || "en-NG"
    utterance.rate = currentPreferences.speed === "slow" ? 0.86 : currentPreferences.speed === "fast" ? 1.14 : 1
    utterance.pitch = 1.02
    utterance.onstart = () => {
      if (utteranceIdRef.current === requestId) setSpeechStatus("playing")
    }
    utterance.onend = () => {
      if (utteranceIdRef.current === requestId) {
        setSpeechStatus("idle")
        utteranceRef.current = null
        farewellRef.current = false
      }
    }
    utterance.onerror = (event) => {
      if (utteranceIdRef.current !== requestId || event.error === "canceled" || event.error === "interrupted") return
      if (event.error === "not-allowed") {
        sessionActivatedRef.current = false
        setSessionActivated(false)
        window.sessionStorage.removeItem("bluepayVoiceActivated")
      }
      setSpeechStatus("idle")
      utteranceRef.current = null
      farewellRef.current = false
    }
    utteranceRef.current = utterance
    setSpeechStatus("playing")
    speech.speak(utterance)
  }, [])

  const buildCurrentIntroduction = useCallback((includeWelcome: boolean) => {
    const currentPreferences = preferencesRef.current
    const { firstName } = getVoiceProfile()
    const parts: string[] = []
    if (includeWelcome && currentPreferences.welcomeVoice) parts.push(buildWelcomeScript(firstName))
    if (currentPreferences.automaticPageGuidance) {
      parts.push(getPageVoiceScript(pathname, firstName, currentPreferences))
    }
    return parts.filter(Boolean).join(" ")
  }, [pathname])

  const activateAndPlay = useCallback((includeInitialWelcome = true) => {
    const currentPreferences = preferencesRef.current
    if (!currentPreferences.voiceGuideEnabled) {
      const next = { ...currentPreferences, voiceGuideEnabled: true, muted: false }
      preferencesRef.current = next
      setPreferences(next)
      saveVoicePreferences(next)
    }
    if (typeof window !== "undefined") window.sessionStorage.setItem("bluepayVoiceActivated", "1")
    sessionActivatedRef.current = true
    setSessionActivated(true)

    const { profileKey } = getVoiceProfile()
    const includeWelcome = includeInitialWelcome && (initialGuidancePendingRef.current || (profileKey && profileKey !== welcomedProfileRef.current))
    const willSpeakWelcome = Boolean(includeWelcome && currentPreferences.welcomeVoice)
    const script = buildCurrentIntroduction(Boolean(includeWelcome))
    if (profileKey && willSpeakWelcome) welcomedProfileRef.current = profileKey
    if (willSpeakWelcome) initialGuidancePendingRef.current = false
    speak(script)
  }, [buildCurrentIntroduction, speak])

  const updatePreferences = useCallback((next: VoicePreferences, activationRequested = false) => {
    preferencesRef.current = next
    setPreferences(next)
    saveVoicePreferences(next)
    notifyVoicePreferencesChanged(next, activationRequested)
    if (!next.voiceGuideEnabled || next.muted) stopSpeech()
  }, [stopSpeech])

  useEffect(() => {
    const loadedPreferences = readVoicePreferences()
    preferencesRef.current = loadedPreferences
    setPreferences(loadedPreferences)
    const supported = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window
    setIsSupported(supported)
    const activated = window.sessionStorage.getItem("bluepayVoiceActivated") === "1"
    sessionActivatedRef.current = activated
    setSessionActivated(activated)
  }, [])

  useEffect(() => {
    const firstVisitToPath = lastPathRef.current !== pathname
    if (!firstVisitToPath) return
    const isFirstPath = lastPathRef.current === null
    lastPathRef.current = pathname
    const suppressedUntil = Number(window.sessionStorage.getItem(VOICE_EXIT_SUPPRESSION_KEY) || 0)
    if (farewellRef.current || suppressedUntil > Date.now()) {
      farewellRef.current = false
      return
    }

    const nextPreferences = readVoicePreferences()
    preferencesRef.current = nextPreferences
    setPreferences(nextPreferences)
    const { firstName, profileKey } = getVoiceProfile()
    const newSignedInProfile = Boolean(profileKey && profileKey !== welcomedProfileRef.current)
    const includeWelcome = (isFirstPath && initialGuidancePendingRef.current) || newSignedInProfile
    if (!profileKey) welcomedProfileRef.current = ""

    if (isFirstPath) initialGuidancePendingRef.current = true
    if (!sessionActivatedRef.current || !nextPreferences.voiceGuideEnabled || nextPreferences.muted) return

    stopSpeech()
    const parts: string[] = []
    if (includeWelcome && nextPreferences.welcomeVoice) parts.push(buildWelcomeScript(firstName))
    if (nextPreferences.automaticPageGuidance) parts.push(getPageVoiceScript(pathname, firstName, nextPreferences))
    if (parts.length) {
      const willSpeakWelcome = includeWelcome && nextPreferences.welcomeVoice
      if (willSpeakWelcome && profileKey) welcomedProfileRef.current = profileKey
      if (willSpeakWelcome || !isFirstPath) initialGuidancePendingRef.current = false
      speak(parts.join(" "))
    }
  }, [pathname, speak, stopSpeech])

  useEffect(() => {
    const handlePreferences = (event: Event) => {
      const detail = (event as CustomEvent<{ preferences?: VoicePreferences; activationRequested?: boolean }>).detail
      const previous = preferencesRef.current
      const next = detail?.preferences || readVoicePreferences()
      preferencesRef.current = next
      setPreferences(next)
      if (!next.voiceGuideEnabled || next.muted || (previous.financialDetailsVoice && !next.financialDetailsVoice) || (previous.automaticPageGuidance && !next.automaticPageGuidance) || (previous.welcomeVoice && !next.welcomeVoice)) {
        stopSpeech()
        if (!next.voiceGuideEnabled || next.muted) return
      }
      if (detail?.activationRequested) activateAndPlay(true)
    }
    const handleReplay = () => activateAndPlay(true)
    const handleExit = (event: Event) => {
      const detail = (event as CustomEvent<{ firstName?: string }>).detail
      const firstName = detail?.firstName || getVoiceProfile().firstName
      const currentPreferences = preferencesRef.current
      if (!currentPreferences.voiceGuideEnabled || currentPreferences.muted || isSupported === false) return
      const now = Date.now()
      const suppressedUntil = Number(window.sessionStorage.getItem(VOICE_EXIT_SUPPRESSION_KEY) || 0)
      if (suppressedUntil > now) return
      const farewell = `Thanks for banking with us${firstName ? `, ${firstName}` : ""}. We hope to welcome you back to BLUEPAY MOBILE soon.`
      farewellRef.current = true
      window.sessionStorage.setItem(VOICE_EXIT_SUPPRESSION_KEY, String(now + 5000))
      if (typeof window !== "undefined") window.sessionStorage.setItem("bluepayVoiceActivated", "1")
      sessionActivatedRef.current = true
      setSessionActivated(true)
      speak(farewell)
    }
    const onStorage = (event: StorageEvent) => {
      if (event.key?.startsWith("bluepayVoicePreferences:")) {
        const previous = preferencesRef.current
        const next = readVoicePreferences()
        preferencesRef.current = next
        setPreferences(next)
        if (!next.voiceGuideEnabled || next.muted || (previous.financialDetailsVoice && !next.financialDetailsVoice) || (previous.automaticPageGuidance && !next.automaticPageGuidance) || (previous.welcomeVoice && !next.welcomeVoice)) stopSpeech()
      }
    }

    window.addEventListener(VOICE_PREFERENCES_EVENT, handlePreferences)
    window.addEventListener(VOICE_REPLAY_EVENT, handleReplay)
    window.addEventListener(VOICE_EXIT_EVENT, handleExit)
    window.addEventListener("storage", onStorage)
    return () => {
      window.removeEventListener(VOICE_PREFERENCES_EVENT, handlePreferences)
      window.removeEventListener(VOICE_REPLAY_EVENT, handleReplay)
      window.removeEventListener(VOICE_EXIT_EVENT, handleExit)
      window.removeEventListener("storage", onStorage)
    }
  }, [activateAndPlay, isSupported, speak, stopSpeech])

  useEffect(() => {
    const spokenInteractions = new Set<string>()
    const announceInteraction = (kind: string, value?: string, allowRepeat = false) => {
      if (!sessionActivatedRef.current) return
      const currentPreferences = preferencesRef.current
      const key = kind === "bank-selected" ? `${kind}:${value}` : kind
      if (!allowRepeat && spokenInteractions.has(key)) return
      if (!allowRepeat) spokenInteractions.add(key)
      const { firstName } = getVoiceProfile()
      const script = getInteractionVoiceScript(kind, firstName, currentPreferences, value)
      if (script) speak(script)
    }
    const onFocusIn = (event: FocusEvent) => {
      const target = event.target instanceof HTMLElement ? event.target : null
      const kind = target?.closest<HTMLElement>("[data-voice-focus]")?.dataset.voiceFocus
      if (kind === "bpc-code") announceInteraction("bpc-code-focus")
      if (kind === "transfer-amount") announceInteraction("transfer-amount-focus")
    }
    const onInput = (event: Event) => {
      const target = event.target instanceof HTMLInputElement ? event.target : null
      if (target?.dataset.voiceComplete === "account-number" && target.value.replace(/\D/g, "").length === 10) {
        announceInteraction("account-number-entered")
      }
    }
    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null
      const action = target?.closest<HTMLElement>("[data-voice-action]")?.dataset.voiceAction
      if (action === "bank-select") {
        const bankButton = target?.closest<HTMLElement>("[data-voice-action='bank-select']")
        const bankName = bankButton?.dataset.voiceBankName || bankButton?.textContent?.trim().replace(/\s+/g, " ")
        announceInteraction("bank-selected", bankName)
      }
      if (action === "transfer-summary") announceInteraction("transfer-summary", undefined, true)
      if (action === "bpc-details") announceInteraction("bpc-details")
    }
    const amountSection = pathname === "/withdraw" ? document.querySelector("[data-voice-section='transfer-amount']") : null
    const amountObserver = amountSection && "IntersectionObserver" in window
      ? new IntersectionObserver((entries) => {
          if (entries.some((entry) => entry.isIntersecting)) announceInteraction("transfer-amount-focus")
        }, { threshold: 0.35 })
      : null
    if (amountSection && amountObserver) amountObserver.observe(amountSection)

    document.addEventListener("focusin", onFocusIn)
    document.addEventListener("input", onInput)
    document.addEventListener("click", onClick)
    return () => {
      amountObserver?.disconnect()
      document.removeEventListener("focusin", onFocusIn)
      document.removeEventListener("input", onInput)
      document.removeEventListener("click", onClick)
    }
  }, [pathname, sessionActivated, speak])

  useEffect(() => {
    const repositionControl = () => {
      const size = 40
      const padding = 12
      const maxLeft = Math.max(padding, window.innerWidth - size - padding)
      const maxTop = Math.max(padding, window.innerHeight - size - padding)
      const candidates = [
        { left: maxLeft, top: padding },
        { left: padding, top: padding },
        { left: padding, top: Math.max(padding, (window.innerHeight - size) / 2) },
        { left: maxLeft, top: Math.max(padding, (window.innerHeight - size) / 2) },
        { left: padding, top: maxTop },
        { left: maxLeft, top: maxTop },
      ]
      const interactiveElements = Array.from(document.querySelectorAll<HTMLElement>("button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [role='button']"))
        .filter((element) => !element.closest("#bluepay-voice-guide") && element.getClientRects().length > 0)
        .map((element) => element.getBoundingClientRect())
      const bestPosition = candidates
        .map((candidate) => ({
          ...candidate,
          collisions: interactiveElements.filter((rect) => candidate.left < rect.right + 8 && candidate.left + size > rect.left - 8 && candidate.top < rect.bottom + 8 && candidate.top + size > rect.top - 8).length,
        }))
        .sort((first, second) => first.collisions - second.collisions)[0]

      setControlPosition((current) => current.left === bestPosition.left && current.top === bestPosition.top ? current : { left: bestPosition.left, top: bestPosition.top })
      setPanelPlacement(bestPosition.top > window.innerHeight / 2 ? "above" : "below")
      setPanelAlignment(bestPosition.left > window.innerWidth / 2 ? "right-0" : "left-0")
    }

    repositionControl()
    window.addEventListener("resize", repositionControl)
    window.addEventListener("scroll", repositionControl, { passive: true })
    return () => {
      window.removeEventListener("resize", repositionControl)
      window.removeEventListener("scroll", repositionControl)
    }
  }, [pathname])

  const toggleEnabled = () => {
    if (preferences.voiceGuideEnabled) {
      updatePreferences({ ...preferences, voiceGuideEnabled: false })
      return
    }
    updatePreferences({ ...preferences, voiceGuideEnabled: true, muted: false })
    activateAndPlay(true)
    setIsOpen(false)
  }

  const handleMute = () => {
    const next = { ...preferences, muted: !preferences.muted }
    updatePreferences(next)
  }

  const handleStop = () => {
    farewellRef.current = false
    stopSpeech()
  }

  const statusText = speechStatus === "playing" ? "Speaking" : speechStatus === "paused" ? "Paused" : speechStatus === "unavailable" || isSupported === false ? "Voice unavailable" : sessionActivated ? "Ready" : "Not enabled yet"

  return (
    <div id="bluepay-voice-guide" className="fixed z-40" style={{ left: controlPosition.left, top: controlPosition.top }}>
      {isOpen && (
        <section aria-label="BLUEPAY Voice Guide controls" className={`absolute ${panelPlacement === "above" ? "bottom-full mb-3" : "top-full mt-3"} ${panelAlignment} w-[min(18rem,calc(100vw-2rem))] rounded-2xl border border-blue-100 bg-white p-3.5 text-slate-900 shadow-2xl shadow-blue-950/20`}>
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#0000ff]">BLUEPAY VOICE GUIDE</p>
              <p className="mt-1 text-xs text-slate-500" role="status" aria-live="polite">{statusText}</p>
            </div>
            <button type="button" onClick={() => setIsOpen(false)} aria-label="Close voice guide controls" className="grid size-8 place-items-center rounded-full text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0000ff]"><X size={16} /></button>
          </div>

          {isSupported === false ? (
            <p className="mt-3 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-900">Speech is not available in this browser. You can still follow all on-screen instructions.</p>
          ) : (
            <>
              {!sessionActivated && preferences.voiceGuideEnabled && (
                <button type="button" onClick={() => { activateAndPlay(true); setIsOpen(false) }} className="mt-3 w-full rounded-xl bg-[#0000ff] px-3 py-2.5 text-xs font-bold text-white shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2">
                  Enable Voice Guide
                </button>
              )}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button type="button" onClick={() => activateAndPlay(true)} disabled={!preferences.voiceGuideEnabled || !isSupported} className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-blue-50 px-2 py-2 text-xs font-semibold text-[#0000ff] disabled:cursor-not-allowed disabled:opacity-40" aria-label="Play current page guidance">
                  <Play size={14} aria-hidden="true" /> Play
                </button>
                <button type="button" onClick={() => {
                  if (speechStatus === "paused") {
                    window.speechSynthesis.resume()
                    setSpeechStatus("playing")
                  } else if (speechStatus === "playing") {
                    window.speechSynthesis.pause()
                    setSpeechStatus("paused")
                  }
                }} disabled={!preferences.voiceGuideEnabled || !sessionActivated || (speechStatus !== "playing" && speechStatus !== "paused")} className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-slate-100 px-2 py-2 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40">
                  {speechStatus === "paused" ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
                  {speechStatus === "paused" ? "Resume" : "Pause"}
                </button>
                <button type="button" onClick={handleStop} disabled={speechStatus !== "playing" && speechStatus !== "paused"} className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-slate-100 px-2 py-2 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40">
                  <span className="size-2.5 rounded-sm bg-slate-600" aria-hidden="true" /> Stop
                </button>
                <button type="button" onClick={() => activateAndPlay(false)} disabled={!preferences.voiceGuideEnabled || !sessionActivated} className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-slate-100 px-2 py-2 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40">
                  <RotateCcw size={14} aria-hidden="true" /> Replay page
                </button>
              </div>
              <div className="mt-2 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                <span className="text-xs font-medium text-slate-600">Voice Guide</span>
                <button type="button" onClick={toggleEnabled} aria-pressed={preferences.voiceGuideEnabled} className={`rounded-full px-3 py-1 text-[11px] font-bold ${preferences.voiceGuideEnabled ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"}`}>
                  {preferences.voiceGuideEnabled ? "On" : "Off"}
                </button>
              </div>
              <button type="button" onClick={handleMute} aria-pressed={preferences.muted} className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                {preferences.muted ? <VolumeX size={15} aria-hidden="true" /> : <Volume2 size={15} aria-hidden="true" />}
                {preferences.muted ? "Unmute voice" : "Mute voice"}
              </button>
              <p className="mt-2 text-[10px] leading-4 text-slate-500">Financial details stay silent unless narration is enabled in Settings. Passwords, PINs, full account numbers, and BPC codes are never spoken.</p>
            </>
          )}
        </section>
      )}
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "Close BLUEPAY Voice Guide" : "Open BLUEPAY Voice Guide"}
        aria-expanded={isOpen}
        className="grid size-10 place-items-center rounded-full border-2 border-white bg-[#0000ff] text-white shadow-lg shadow-blue-950/25 transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      >
        <AudioLines size={20} aria-hidden="true" />
        <span className="sr-only">BLUEPAY VOICE GUIDE</span>
      </button>
    </div>
  )
}
