"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Play, Pause, Volume2, Maximize, Clock, Eye } from "lucide-react"

export default function WatchPage() {
  const router = useRouter()
  const [isPlaying, setIsPlaying] = useState(false)

  const videos = [
    {
      id: 1,
      title: "How to Use BLUEPAY - Complete Guide",
      duration: "5:30",
      views: "1.2K",
      thumbnail: "/bluepay-tutorial-video.png",
    },
    {
      id: 2,
      title: "BPC Code Benefits & Features",
      duration: "3:45",
      views: "890",
      thumbnail: "/bpc-code-features-video.png",
    },
    {
      id: 3,
      title: "Airtime & Data Purchase Tutorial",
      duration: "4:20",
      views: "2.1K",
      thumbnail: "/airtime-data-tutorial.png",
    },
    {
      id: 4,
      title: "Withdrawal Process Explained",
      duration: "6:15",
      views: "1.5K",
      thumbnail: "/withdrawal-tutorial-video.png",
    },
  ]

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12" style={{ backgroundColor: "#4169E1" }}>
        <button onClick={() => router.back()}>
          <ArrowLeft className="text-white" size={24} />
        </button>
        <h1 className="text-white text-xl font-bold">Watch</h1>
        <div className="w-6"></div>
      </div>

      {/* Featured Video Player */}
      <div className="p-4">
        <div className="relative bg-black rounded-2xl overflow-hidden mb-4">
          <img src="/bluepay-tutorial-video.png" alt="Featured Video" className="w-full h-64 object-cover" />
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={handlePlayPause}
              className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              {isPlaying ? <Pause className="text-white" size={24} /> : <Play className="text-white ml-1" size={24} />}
            </button>
          </div>

          {/* Video Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <button onClick={handlePlayPause}>
                  {isPlaying ? <Pause className="text-white" size={20} /> : <Play className="text-white" size={20} />}
                </button>
                <Volume2 size={20} />
                <span className="text-sm">2:30 / 8:45</span>
              </div>
              <Maximize size={20} />
            </div>
            <div className="w-full bg-white/20 rounded-full h-1 mt-2">
              <div className="bg-white h-1 rounded-full" style={{ width: "30%" }}></div>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Getting Started with BLUEPAY</h2>
          <div className="flex items-center gap-4 text-gray-600 text-sm">
            <div className="flex items-center gap-1">
              <Eye size={16} />
              <span>3.2K views</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>8:45</span>
            </div>
          </div>
        </div>
      </div>

      {/* Video Categories */}
      <div className="px-4 mb-6">
        <div className="flex gap-3 overflow-x-auto pb-2">
          <button
            className="px-4 py-2 rounded-full text-white text-sm font-medium whitespace-nowrap"
            style={{ backgroundColor: "#4169E1" }}
          >
            All Videos
          </button>
          <button className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 text-sm font-medium whitespace-nowrap">
            Tutorials
          </button>
          <button className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 text-sm font-medium whitespace-nowrap">
            Features
          </button>
          <button className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 text-sm font-medium whitespace-nowrap">
            Tips
          </button>
        </div>
      </div>

      {/* Video List */}
      <div className="px-4 pb-20">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recommended Videos</h3>
        <div className="space-y-4">
          {videos.map((video) => (
            <div key={video.id} className="flex gap-3 bg-white rounded-xl p-3 shadow-sm">
              <div className="relative">
                <img
                  src={video.thumbnail || "/placeholder.svg"}
                  alt={video.title}
                  className="w-24 h-16 rounded-lg object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center">
                    <Play className="text-white" size={12} />
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800 text-sm mb-1 line-clamp-2">{video.title}</h4>
                <div className="flex items-center gap-3 text-gray-500 text-xs">
                  <div className="flex items-center gap-1">
                    <Eye size={12} />
                    <span>{video.views}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{video.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
