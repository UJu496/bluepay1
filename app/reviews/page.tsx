"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Star, Send, MessageSquare } from "lucide-react"

export default function ReviewsPage() {
  const router = useRouter()
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitReview = () => {
    if (rating === 0 || review.trim() === "") {
      alert("Please provide both rating and review")
      return
    }

    setIsSubmitting(true)

    // Save review to localStorage
    const reviews = JSON.parse(localStorage.getItem("bluepayReviews") || "[]")
    const userData = JSON.parse(localStorage.getItem("userData") || "{}")

    const newReview = {
      id: Date.now(),
      name: userData.fullName || "Anonymous User",
      rating,
      review,
      date: new Date().toLocaleDateString(),
    }

    reviews.push(newReview)
    localStorage.setItem("bluepayReviews", JSON.stringify(reviews))

    setTimeout(() => {
      setIsSubmitting(false)
      alert("Thank you for your review!")
      router.back()
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12" style={{ backgroundColor: "#4169E1" }}>
        <button onClick={() => router.back()}>
          <ArrowLeft className="text-white" size={24} />
        </button>
        <h1 className="text-white text-xl font-bold">Write Review</h1>
        <div className="w-6"></div>
      </div>

      <div className="p-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="text-center mb-6">
            <MessageSquare className="mx-auto mb-4 text-blue-500" size={48} />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Share Your Experience</h2>
            <p className="text-gray-600">Help others by sharing your BLUEPAY experience</p>
          </div>

          {/* Rating */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Rate BLUEPAY</label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setRating(star)} className="transition-colors">
                  <Star size={32} className={star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"} />
                </button>
              ))}
            </div>
          </div>

          {/* Review Text */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Your Review</label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Tell us about your experience with BLUEPAY..."
              className="w-full p-4 border border-gray-300 rounded-xl resize-none h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmitReview}
            disabled={isSubmitting}
            className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isSubmitting ? (
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <Send size={20} />
                Submit Review
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
