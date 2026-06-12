"use client"

import { useEffect, useState } from "react"

interface RollingAnimationProps {
  onComplete: () => void
  duration?: number
}

export default function RollingAnimation({ onComplete, duration = 3000 }: RollingAnimationProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(onComplete, 500)
          return 100
        }
        return prev + 2
      })
    }, duration / 50)

    return () => clearInterval(interval)
  }, [onComplete, duration])

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 text-center max-w-sm w-full mx-4">
        {/* Rolling Circle Animation */}
        <div className="mb-6">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
            <div
              className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"
              style={{ animationDuration: "1s" }}
            ></div>
            <div className="absolute inset-2 bg-blue-600 rounded-full flex items-center justify-center">
              <div className="text-white text-xl font-bold">💳</div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-4">Processing Your Order</h3>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <p className="text-gray-600 text-sm">
          {progress < 30 && "Validating your details..."}
          {progress >= 30 && progress < 60 && "Processing BPC CODE..."}
          {progress >= 60 && progress < 90 && "Confirming order..."}
          {progress >= 90 && "Almost done!"}
        </p>

        <div className="text-2xl font-bold text-blue-600 mt-2">{Math.round(progress)}%</div>
      </div>
    </div>
  )
}
