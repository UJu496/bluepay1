"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { AudioLines, Pause, Play, RotateCcw, Volume2, VolumeX, X } from "lucide-react"
import {
  buildWelcomeScript,
  DEFAULT_VOICE_PREFERENCES,
  getInteractionVoiceAudioPath,
  getInteractionVoiceScript,
  getPageVoiceScript,
  getVoiceGuideAudioPath,
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
type ActiveEngine = "browser" | "audio" | null

const VOICE_EXIT_SUPPRESSION_KEY = "bluepayVoiceExitSuppressedUntil"

export function BluepayVoiceGuide() {
  const pathname = usePathname()
  const [preferences, setPreferences] = useState<VoicePreferences>(DEFAULT_VOICE_PREFERENCES)
  const [isOpen, setIsOpen] = useState(false)
  const [sessionActivated, setSessionActivated] = useState(false)
  const [speechStatus, setSpeechStatus] = useState<SpeechStatus>("idle")
  const [controlPosition, setControlPosition] = useState({ left: 16, top: 16 })
  const [panelPlacement, setPanelPlacement] = useState<"above" | "below">("below")
  const [panelAlignment, setPanelAlignment] = useState<"left-0" | "right-0">("left-0")
  const [panelMaxHeight, setPanelMaxHeight] = useState(320)
  const preferencesRef = useRef(preferences)
  const sessionActivatedRef = useRef(false)
  const lastPathRef = useRef<string | null>(null)
  const initialGuidancePendingRef = useRef(true)
  const welcomedProfileRef = useRef("")
  const farewellRef = useRef(false)
  const utteranceIdRef = useRef(0)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const activeEngineRef = useRef<ActiveEngine>(null)
  const pendingScriptRef = useRef("")
  const pendingAudioSourcesRef = useRef<string[]>([])
  const pendingWelcomeProfileRef = useRef("")
  const pendingWelcomeRef = useRef(false)

  preferencesRef.current = preferences

  const stopSpeech = useCallback(() => {
    farewellRef.current = false
    utteranceIdRef.current += 1
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel()
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    utteranceRef.current = null
    audioRef.current = null
    activeEngineRef.current = null
    pendingScriptRef.current = ""
    pendingAudioSourcesRef.current = []
    pendingWelcomeProfileRef.current = ""
    pendingWelcomeRef.current = false
    setSpeechStatus("idle")
  }, [])

  const playAudioSources = useCallback((sources: string[], requestId: number) => {
    pendingAudioSourcesRef.current = sources
    const playNext = (index: number, sourceFailed = false) => {
      if (utteranceIdRef.current !== requestId) return
      if (index >= sources.length) {
        audioRef.current = null
        activeEngineRef.current = null
        setSpeechStatus(sourceFailed ? "unavailable" : "idle")
        farewellRef.current = false
        return
      }

      const audio = new Audio(sources[index])
      audio.preload = "auto"
      audioRef.current = audio
      activeEngineRef.current = "audio"
      audio.onplay = () => {
        if (utteranceIdRef.current !== requestId) return
        pendingScriptRef.current = ""
        pendingAudioSourcesRef.current = []
        if (pendingWelcomeRef.current) {
          if (pendingWelcomeProfileRef.current) {
            welcomedProfileRef.current = pendingWelcomeProfileRef.current
          }
          pendingWelcomeProfileRef.current = ""
          pendingWelcomeRef.current = false
          initialGuidancePendingRef.current = false
        }
        setSpeechStatus("playing")
      }
      audio.onended = () => {
        if (utteranceIdRef.current !== requestId) return
        audioRef.current = null
        playNext(index + 1)
      }
      audio.onerror = () => {
        if (utteranceIdRef.current !== requestId) return
        audioRef.current = null
        playNext(index + 1, true)
      }
      void audio.play().then(() => {
        if (utteranceIdRef.current === requestId) setSpeechStatus("playing")
      }).catch(() => {
        if (utteranceIdRef.current !== requestId) return
        audioRef.current = null
        activeEngineRef.current = null
        setSpeechStatus("idle")
        pendingAudioSourcesRef.current = sources
      })
    }
    playNext(0)
  }, [])

  const speak = useCallback((text: string, fallbackSources: string[], includesWelcome = false) => {
    const currentPreferences = preferencesRef.current
    if (!text.trim() || currentPreferences.muted) return

    const requestId = utteranceIdRef.current + 1
    utteranceIdRef.current = requestId
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel()
    utteranceRef.current = null
    activeEngineRef.current = null
    pendingScriptRef.current = text
    pendingAudioSourcesRef.current = fallbackSources
    pendingWelcomeRef.current = includesWelcome
    pendingWelcomeProfileRef.current = includesWelcome ? getVoiceProfile().profileKey : ""

    const canUseBrowserSpeech = typeof window !== "undefined"
      && typeof window.speechSynthesis?.speak === "function"
      && typeof window.SpeechSynthesisUtterance === "function"

    if (!canUseBrowserSpeech) {
      playAudioSources(fallbackSources, requestId)
      return
    }

    try {
      const speech = window.speechSynthesis
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
        if (utteranceIdRef.current !== requestId) return
        activeEngineRef.current = "browser"
        pendingScriptRef.current = ""
        pendingAudioSourcesRef.current = []
        if (pendingWelcomeRef.current) {
          if (pendingWelcomeProfileRef.current) {
            welcomedProfileRef.current = pendingWelcomeProfileRef.current
          }
          pendingWelcomeProfileRef.current = ""
          pendingWelcomeRef.current = false
          initialGuidancePendingRef.current = false
        }
        setSpeechStatus("playing")
      }
      utterance.onend = () => {
        if (utteranceIdRef.current !== requestId) return
        activeEngineRef.current = null
        utteranceRef.current = null
        setSpeechStatus("idle")
        farewellRef.current = false
      }
      utterance.onerror = (event) => {
        if (utteranceIdRef.current !== requestId || event.error === "canceled" || event.error === "interrupted") return
        utteranceRef.current = null
        activeEngineRef.current = null
        playAudioSources(fallbackSources, requestId)
      }
      utteranceRef.current = utterance
      activeEngineRef.current = "browser"
      speech.speak(utterance)
    } catch {
      playAudioSources(fallbackSources, requestId)
    }
  }, [playAudioSources])

  const pauseSpeech = useCallback(() => {
    if (activeEngineRef.current === "audio") audioRef.current?.pause()
    else if (activeEngineRef.current === "browser") window.speechSynthesis.pause()
    setSpeechStatus("paused")
  }, [])

  const resumeSpeech = useCallback(() => {
    if (activeEngineRef.current === "audio" && audioRef.current) {
      void audioRef.current.play().then(() => setSpeechStatus("playing")).catch(() => setSpeechStatus("idle"))
    } else if (activeEngineRef.current === "browser") {
      window.speechSynthesis.resume()
      setSpeechStatus("playing")
    }
  }, [])

  const buildCurrentIntroduction = useCallback((includeWelcome: boolean) => {
    const currentPreferences = preferencesRef.current
    const { firstName } = getVoiceProfile()
    const parts: string[] = []
    if (includeWelcome) parts.push(buildWelcomeScript(firstName))
    parts.push(getPageVoiceScript(pathname, firstName, currentPreferences))
    return parts.filter(Boolean).join(" ")
  }, [pathname])

  const activateAndPlay = useCallback((includeInitialWelcome = true) => {
    const currentPreferences = preferencesRef.current
    if (currentPreferences.muted) return
    if (typeof window !== "undefined") window.sessionStorage.setItem("bluepayVoiceActivated", "1")
    sessionActivatedRef.current = true
    setSessionActivated(true)

    const { profileKey } = getVoiceProfile()
    const includeWelcome = includeInitialWelcome && (initialGuidancePendingRef.current || (profileKey && profileKey !== welcomedProfileRef.current))
    const script = buildCurrentIntroduction(Boolean(includeWelcome))
    pendingWelcomeProfileRef.current = includeWelcome ? profileKey : ""
    const audioSources = [
      ...(includeWelcome ? [getVoiceGuideAudioPath("/welcome")] : []),
      getVoiceGuideAudioPath(pathname),
    ]
    speak(script, audioSources, Boolean(includeWelcome))
  }, [buildCurrentIntroduction, pathname, speak])

  const updatePreferences = useCallback((next: VoicePreferences) => {
    preferencesRef.current = next
    setPreferences(next)
    saveVoicePreferences(next)
    notifyVoicePreferencesChanged(next)
    if (next.muted) {
      pendingScriptRef.current = ""
      stopSpeech()
    }
  }, [stopSpeech])

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      void navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => undefined)
    }
    const loadedPreferences = readVoicePreferences()
    preferencesRef.current = loadedPreferences
    setPreferences(loadedPreferences)
    const activated = window.sessionStorage.getItem("bluepayVoiceActivated") === "1"
    sessionActivatedRef.current = activated
    setSessionActivated(activated)
  }, [])

  useEffect(() => {
    const unlockSpeech = () => {
      if (sessionActivatedRef.current) return
      sessionActivatedRef.current = true
      setSessionActivated(true)
      window.sessionStorage.setItem("bluepayVoiceActivated", "1")
      if (window.speechSynthesis) window.speechSynthesis.resume()
      if (!preferencesRef.current.muted && pendingScriptRef.current) {
        speak(
          pendingScriptRef.current,
          pendingAudioSourcesRef.current,
          pendingAudioSourcesRef.current[0] === getVoiceGuideAudioPath("/welcome"),
        )
      } else if (!preferencesRef.current.muted && pendingAudioSourcesRef.current.length) {
        const requestId = utteranceIdRef.current + 1
        utteranceIdRef.current = requestId
        playAudioSources(pendingAudioSourcesRef.current, requestId)
      }
      window.removeEventListener("pointerdown", unlockSpeech, true)
      window.removeEventListener("keydown", unlockSpeech, true)
      window.removeEventListener("touchstart", unlockSpeech, true)
    }

    window.addEventListener("pointerdown", unlockSpeech, true)
    window.addEventListener("keydown", unlockSpeech, true)
    window.addEventListener("touchstart", unlockSpeech, true)
    return () => {
      window.removeEventListener("pointerdown", unlockSpeech, true)
      window.removeEventListener("keydown", unlockSpeech, true)
      window.removeEventListener("touchstart", unlockSpeech, true)
    }
  }, [speak])

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
    stopSpeech()
    const parts: string[] = []
    if (includeWelcome) parts.push(buildWelcomeScript(firstName))
    parts.push(getPageVoiceScript(pathname, firstName, nextPreferences))
    const script = parts.filter(Boolean).join(" ")
    pendingWelcomeProfileRef.current = includeWelcome ? profileKey : ""
    if (!nextPreferences.muted) {
      const audioSources = [
        ...(includeWelcome ? [getVoiceGuideAudioPath("/welcome")] : []),
        getVoiceGuideAudioPath(pathname),
      ]
      speak(script, audioSources, includeWelcome)
    }
  }, [pathname, speak, stopSpeech])

  useEffect(() => {
    const handlePreferences = (event: Event) => {
      const detail = (event as CustomEvent<{ preferences?: VoicePreferences }>).detail
      const previous = preferencesRef.current
      const next = detail?.preferences || readVoicePreferences()
      preferencesRef.current = next
      setPreferences(next)
      if (next.muted || (previous.financialDetailsVoice && !next.financialDetailsVoice)) {
        stopSpeech()
        if (next.muted) return
      }
    }
    const handleReplay = () => activateAndPlay(true)
    const handleExit = (event: Event) => {
      const detail = (event as CustomEvent<{ firstName?: string }>).detail
      const firstName = detail?.firstName || getVoiceProfile().firstName
      const currentPreferences = preferencesRef.current
      if (currentPreferences.muted) return
      const now = Date.now()
      const suppressedUntil = Number(window.sessionStorage.getItem(VOICE_EXIT_SUPPRESSION_KEY) || 0)
      if (suppressedUntil > now) return
      const farewell = `Thanks for banking with us${firstName ? `, ${firstName}` : ""}. We hope to welcome you back to BLUEPAY MOBILE soon.`
      farewellRef.current = true
      window.sessionStorage.setItem(VOICE_EXIT_SUPPRESSION_KEY, String(now + 5000))
      if (typeof window !== "undefined") window.sessionStorage.setItem("bluepayVoiceActivated", "1")
      sessionActivatedRef.current = true
      setSessionActivated(true)
      speak(farewell, [getVoiceGuideAudioPath("/farewell")])
    }
    const onStorage = (event: StorageEvent) => {
      if (event.key?.startsWith("bluepayVoicePreferences:")) {
        const previous = preferencesRef.current
        const next = readVoicePreferences()
        preferencesRef.current = next
        setPreferences(next)
        if (next.muted || (previous.financialDetailsVoice && !next.financialDetailsVoice)) stopSpeech()
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
  }, [activateAndPlay, speak, stopSpeech])

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
      if (script) speak(script, [getInteractionVoiceAudioPath(kind)])
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
      if (target?.id === "account-name" && target.value.trim()) {
        announceInteraction("recipient-name-entered")
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
      const availableAbove = Math.max(180, bestPosition.top - 24)
      const availableBelow = Math.max(180, window.innerHeight - bestPosition.top - size - 24)
      const placeAbove = availableBelow < 300 && availableAbove > availableBelow
      setPanelPlacement(placeAbove ? "above" : "below")
      setPanelMaxHeight(Math.min(300, placeAbove ? availableAbove : availableBelow))
      setPanelAlignment(bestPosition.left > window.innerWidth / 2 ? "right-0" : "left-0")
    }

    repositionControl()
    window.addEventListener("resize", repositionControl)
    window.addEventListener("scroll", repositionControl, { passive: true })
    return () => {
      window.removeEventListener("resize", repositionControl)
      window.removeEventListener("scroll", repositionControl)
    }
  }, [isOpen, pathname])

  const handleMute = () => {
    const next = { ...preferences, muted: !preferences.muted }
    updatePreferences(next)
  }

  const handleStop = () => {
    farewellRef.current = false
    stopSpeech()
  }

  const statusText = speechStatus === "playing"
    ? "Speaking"
    : speechStatus === "paused"
      ? "Paused"
      : speechStatus === "unavailable"
        ? "Voice could not play. Please follow the on-screen instructions."
        : "Ready"

  return (
    <div id="bluepay-voice-guide" className="fixed z-40" style={{ left: controlPosition.left, top: controlPosition.top }}>
      {isOpen && (
        <section aria-label="BLUEPAY Voice Guide controls" style={{ maxHeight: panelMaxHeight }} className={`absolute ${panelPlacement === "above" ? "bottom-full mb-3" : "top-full mt-3"} ${panelAlignment} w-[min(18rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-blue-100 bg-white p-3.5 text-slate-900 shadow-2xl shadow-blue-950/20`}>
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#0000ff]">BLUEPAY VOICE GUIDE</p>
              <p className="mt-1 text-xs text-slate-500" role="status" aria-live="polite">{statusText}</p>
            </div>
            <button type="button" onClick={() => setIsOpen(false)} aria-label="Close voice guide controls" className="grid size-8 place-items-center rounded-full text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0000ff]"><X size={16} /></button>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button type="button" onClick={() => activateAndPlay(true)} disabled={preferences.muted} className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-blue-50 px-2 py-2 text-xs font-semibold text-[#0000ff] disabled:cursor-not-allowed disabled:opacity-40" aria-label="Play current page guidance">
              <Play size={14} aria-hidden="true" /> Play
            </button>
            <button type="button" onClick={speechStatus === "paused" ? resumeSpeech : pauseSpeech} disabled={speechStatus !== "playing" && speechStatus !== "paused"} className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-slate-100 px-2 py-2 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40">
              {speechStatus === "paused" ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
              {speechStatus === "paused" ? "Resume" : "Pause"}
            </button>
            <button type="button" onClick={handleStop} disabled={speechStatus !== "playing" && speechStatus !== "paused"} className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-slate-100 px-2 py-2 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40">
              <span className="size-2.5 rounded-sm bg-slate-600" aria-hidden="true" /> Stop
            </button>
            <button type="button" onClick={() => activateAndPlay(false)} disabled={preferences.muted} className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-slate-100 px-2 py-2 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40">
              <RotateCcw size={14} aria-hidden="true" /> Replay page
            </button>
          </div>
          <button type="button" onClick={handleMute} aria-pressed={preferences.muted} className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
            {preferences.muted ? <VolumeX size={15} aria-hidden="true" /> : <Volume2 size={15} aria-hidden="true" />}
            {preferences.muted ? "Unmute voice" : "Mute voice"}
          </button>
          <p className="mt-2 text-[10px] leading-4 text-slate-500">Page and transaction guidance starts automatically. Financial details stay silent unless narration is enabled in Settings. Passwords, PINs, full account numbers, and BPC codes are never spoken.</p>
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
