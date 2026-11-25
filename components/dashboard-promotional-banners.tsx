"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"

const banners = [
  {
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%20%289%29-Tmk8kXTeFzugZGTph5w6e18NBmVXfH.jpeg",
    alt: "Community leader smiling at a public event",
    eyebrow: "BLUEPAY FOR EVERYDAY LIFE",
    title: "Banking that moves with your community.",
    description: "A simpler way to keep up with the money moments that matter.",
    style: "hero",
    animation: "fade",
  },
  {
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%20%2821%29-IzTJ31PZkl7Rx8fAhjm1nNWHA2T9ou.jpeg",
    alt: "Ballot box set against the Nigerian flag",
    eyebrow: "YOUR MONEY, YOUR WAY",
    title: "Everyday payments, made easier.",
    description: "Send money, pay bills and stay in control from one app.",
    style: "split",
    animation: "slide",
  },
  {
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%20%2822%29-3qhEICNeIgpc4vyLw0E1wDePl1fKam.jpeg",
    alt: "People gathered at a community registration center",
    eyebrow: "MADE FOR REAL LIFE",
    title: "Simple money tools for everyone.",
    description: "Get the essentials for managing your money, all in BLUEPAY.",
    style: "photo",
    animation: "rotate",
  },
  {
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%20%2823%29-9UazJ1v74o4sVUsPdj2Dj55hpgJ3Oq.jpeg",
    alt: "Community members gathered under a canopy",
    eyebrow: "STAY IN THE FLOW",
    title: "A little more ease in every day.",
    description: "Handle your everyday banking with a few quick taps.",
    style: "editorial",
    animation: "fade",
  },
  {
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%20%2817%29-e4fW0BuIPAObcmC1CMIf97IWmBYCMC.jpeg",
    alt: "A group of public figures at a formal event",
    eyebrow: "ONE APP. MANY POSSIBILITIES.",
    title: "Make room for what comes next.",
    description: "Explore simple ways to pay, transfer and manage your money.",
    style: "portrait",
    animation: "zoom",
  },
  {
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%20%2812%29-6VSxWuosiRfA9YrS8eHTW8pKWuPxjC.jpeg",
    alt: "Political campaign poster featuring two Nigerian candidates",
    eyebrow: "YOUR NEXT MOVE STARTS HERE",
    title: "Make every money move count.",
    description: "Everyday banking tools, right where you need them.",
    style: "poster",
    animation: "rotate",
  },
  {
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%20%2824%29-hs2Vw4x7czDWnJVcQeeGah6ukowftE.jpeg",
    alt: "Illustration of a robotic hand casting a ballot in Nigeria",
    eyebrow: "A MORE CONNECTED FUTURE",
    title: "Your everyday banking, reimagined.",
    description: "Discover a simpler way to manage the way money moves.",
    style: "future",
    animation: "slide",
  },
  {
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%20%2820%29-TPRvxU61DQkBOLkMLwYgMak5ZI288Z.jpeg",
    alt: "Illustration of Nigeria’s future with communities and economic growth",
    eyebrow: "BUILT FOR WHAT’S AHEAD",
    title: "Take your next step with BLUEPAY.",
    description: "Explore money tools designed for everyday progress.",
    style: "illustration",
    animation: "zoom",
  },
] as const

type PromoBanner = (typeof banners)[number]
type BannerAnimation = PromoBanner["animation"]

function PromoBannerLayer({
  banner,
  animationClass,
  onExplore,
  outgoing = false,
}: {
  banner: PromoBanner
  animationClass: string
  onExplore?: () => void
  outgoing?: boolean
}) {
  const isSplit = banner.style === "split"
  const overlayClass = isSplit
    ? "bg-gradient-to-r from-white via-white/95 to-white/20"
    : banner.style === "future"
      ? "bg-gradient-to-r from-[#062718]/95 via-[#062718]/70 to-transparent"
      : banner.style === "illustration"
        ? "bg-gradient-to-r from-[#061334]/95 via-[#061334]/70 to-transparent"
        : banner.style === "poster"
          ? "bg-gradient-to-r from-[#061334]/90 via-[#061334]/65 to-transparent"
          : "bg-gradient-to-r from-[#07143b]/95 via-[#07143b]/70 to-[#07143b]/10"
  const contentPosition = banner.style === "editorial"
    ? "justify-end pb-14"
    : banner.style === "portrait"
      ? "justify-center pb-10 pt-6"
      : "justify-center pb-10"

  return (
    <div className={`absolute inset-0 ${animationClass} ${outgoing ? "pointer-events-none" : ""}`} aria-hidden={outgoing || undefined}>
      <img
        src={banner.image}
        alt={outgoing ? "" : banner.alt}
        className={`absolute inset-0 size-full object-cover ${banner.style === "split" ? "object-center sm:object-right" : "object-center"}`}
      />
      <div className={`absolute inset-0 ${overlayClass}`} />
      <div className={`relative flex h-full max-w-[78%] flex-col px-5 sm:max-w-[64%] sm:px-7 ${contentPosition} ${isSplit ? "text-slate-900" : "text-white"}`}>
        <span className={`mb-2 w-fit rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.15em] ${isSplit ? "bg-blue-100 text-blue-800" : "bg-white/15 text-white backdrop-blur-sm"}`}>
          {banner.eyebrow}
        </span>
        <h2 className="max-w-sm text-[1.55rem] font-bold leading-[1.08] tracking-tight sm:text-3xl">{banner.title}</h2>
        <p className={`mt-2 max-w-xs text-xs leading-5 sm:text-sm ${isSplit ? "text-slate-600" : "text-white/85"}`}>
          {banner.description}
        </p>
        {!outgoing && (
          <button
            type="button"
            onClick={onExplore}
            className={`mt-4 inline-flex w-fit items-center gap-2 rounded-full px-3.5 py-2 text-[11px] font-bold transition hover:gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${isSplit ? "bg-[#0000ff] text-white focus-visible:ring-blue-500" : "bg-white text-[#101a3b] focus-visible:ring-white"}`}
          >
            Explore BLUEPAY <ArrowRight size={14} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  )
}

export function DashboardPromotionalBanners() {
  const router = useRouter()
  const [activeIndex, setActiveIndex] = useState(0)
  const [outgoingBanner, setOutgoingBanner] = useState<{ index: number; animation: BannerAnimation } | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const activeBanner = banners[activeIndex]

  const goToBanner = useCallback((nextIndex: number) => {
    if (nextIndex === activeIndex) return

    setOutgoingBanner({ index: activeIndex, animation: banners[nextIndex].animation })
    setActiveIndex(nextIndex)
  }, [activeIndex])

  useEffect(() => {
    if (isPaused) return

    const timer = window.setInterval(() => {
      goToBanner((activeIndex + 1) % banners.length)
    }, 6000)

    return () => window.clearInterval(timer)
  }, [activeIndex, goToBanner, isPaused])

  useEffect(() => {
    if (!outgoingBanner) return

    const timer = window.setTimeout(() => setOutgoingBanner(null), 850)
    return () => window.clearTimeout(timer)
  }, [outgoingBanner])

  const changeBanner = (offset: number) => {
    goToBanner((activeIndex + offset + banners.length) % banners.length)
  }

  return (
    <section className="mx-3 mb-5" aria-label="BLUEPAY promotional banners">
      <div className="relative isolate h-[17.5rem] overflow-hidden rounded-[1.4rem] bg-[#101a3b] shadow-lg shadow-blue-950/10 sm:h-56" aria-roledescription="carousel" aria-label="BLUEPAY promotions" onFocusCapture={() => setIsPaused(true)}>
        <PromoBannerLayer
          key={`active-${activeIndex}`}
          banner={activeBanner}
          animationClass={`promo-banner-in-${activeBanner.animation}`}
          onExplore={() => router.push("/features")}
        />
        {outgoingBanner && (
          <PromoBannerLayer
            key={`outgoing-${outgoingBanner.index}-${activeIndex}`}
            banner={banners[outgoingBanner.index]}
            animationClass={`promo-banner-out-${outgoingBanner.animation}`}
            outgoing
          />
        )}

        <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-black/30 p-1 backdrop-blur-sm">
          <button type="button" onClick={() => setIsPaused((paused) => !paused)} aria-label={isPaused ? "Resume promotions" : "Pause promotions"} aria-pressed={isPaused} className="grid size-7 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
            {isPaused ? <Play size={13} aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />}
          </button>
          <button type="button" onClick={() => changeBanner(-1)} aria-label="Previous promotion" className="grid size-7 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
            <ChevronLeft size={16} aria-hidden="true" />
          </button>
          <span className="min-w-8 text-center text-[10px] font-semibold tabular-nums text-white">{activeIndex + 1} / {banners.length}</span>
          <button type="button" onClick={() => changeBanner(1)} aria-label="Next promotion" className="grid size-7 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
            <ChevronRight size={16} aria-hidden="true" />
          </button>
        </div>

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 to-transparent px-4 pb-3 pt-7">
          <p className="min-w-0 truncate text-[8px] font-medium text-white/80">Campaign imagery shown for illustration only · No endorsement implied</p>
        </div>
      </div>
      <div className="sr-only" aria-live="polite">Promotion {activeIndex + 1} of {banners.length}: {activeBanner.title}</div>
    </section>
  )
}
