"use client"

import Link from "next/link"
import { ArrowRight, Zap, Shield, DollarSign, Smartphone, Airplay, FileText, Wallet } from "lucide-react"
import { useEffect, useState } from "react"

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navigation Bar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img 
              src="/bluepay-mobile-logo.png" 
              alt="BLUEPAY MOBILE" 
              className="h-8 sm:h-10 object-contain"
            />
          </div>

          {/* Nav Links - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium">
              Features
            </a>
            <a href="#why-choose" className="text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium">
              Why BluePay
            </a>
            <a href="#trust" className="text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium">
              Trust
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/login" className="text-gray-700 hover:text-blue-600 transition-colors text-sm font-medium hidden sm:block">
              Sign In
            </Link>
            <Link href="/onboarding" className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 transition-all duration-300 hover:shadow-lg">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 sm:pt-24 pb-8 sm:pb-12">
        {/* Hero Image */}
        <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden">
          <img
            src="/onboarding-hero-updated.png"
            alt="BLUEPAY MOBILE 2026"
            className="w-full h-full object-cover"
            style={{ filter: "contrast(1.2) saturate(1.15)" }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-white"></div>
        </div>

        {/* Hero Content - Reduced white space */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-16 relative z-10">
          <div className="text-center mb-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 px-4 py-2 rounded-full mb-4 sm:mb-6 text-xs sm:text-sm font-semibold">
              <span>🚀</span>
              <span>Fast • Secure • Affordable</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4 sm:mb-5 leading-tight text-balance">
              Pay Bills, Buy Airtime & Data in Seconds
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto text-balance">
              Everything you need to manage your digital payments in one place.
            </p>

            {/* Description */}
            <p className="text-sm sm:text-base text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              BluePay Mobile lets you buy airtime, data bundles, pay electricity bills, TV subscriptions, and other essential services quickly and securely. Enjoy instant transactions, affordable prices, and reliable service anytime, anywhere.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link href="/onboarding" className="bg-blue-600 text-white px-8 py-3 sm:py-3.5 rounded-full font-bold text-base hover:bg-blue-700 transition-all duration-300 hover:shadow-lg hover:scale-105 inline-flex items-center justify-center gap-2">
                Get Started
                <ArrowRight size={20} />
              </Link>
              <button className="border-2 border-blue-600 text-blue-600 px-8 py-3 sm:py-3.5 rounded-full font-bold text-base hover:bg-blue-50 transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Highlights Section */}
      <section id="trust" className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {/* Instant Transactions */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-full mb-3 sm:mb-4">
                <Zap className="text-blue-600" size={24} />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2">Instant Transactions</h3>
              <p className="text-xs sm:text-sm text-gray-600">Real-time processing</p>
            </div>

            {/* Bank-Level Security */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-green-100 rounded-full mb-3 sm:mb-4">
                <Shield className="text-green-600" size={24} />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2">Bank-Level Security</h3>
              <p className="text-xs sm:text-sm text-gray-600">Your data is protected</p>
            </div>

            {/* Affordable Prices */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-purple-100 rounded-full mb-3 sm:mb-4">
                <DollarSign className="text-purple-600" size={24} />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2">Affordable Prices</h3>
              <p className="text-xs sm:text-sm text-gray-600">Lowest rates guaranteed</p>
            </div>

            {/* Available 24/7 */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-orange-100 rounded-full mb-3 sm:mb-4">
                <Smartphone className="text-orange-600" size={24} />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2">Available 24/7</h3>
              <p className="text-xs sm:text-sm text-gray-600">Always at your service</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose BluePay Section */}
      <section id="why-choose" className="py-12 sm:py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-12 text-center">Why Choose BluePay?</h2>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 sm:p-8 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-blue-100">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-full mb-4 sm:mb-6">
                <Airplay className="text-white" size={28} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">Airtime & Data</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Buy airtime and data for all major networks instantly. Get the best rates and fastest delivery.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-6 sm:p-8 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-green-100">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-green-600 rounded-full mb-4 sm:mb-6">
                <FileText className="text-white" size={28} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">Bill Payments</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Pay electricity, cable TV, internet, and other utility bills with ease. Never miss a deadline again.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-6 sm:p-8 hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-purple-100">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-purple-600 rounded-full mb-4 sm:mb-6">
                <Wallet className="text-white" size={28} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">Secure Wallet</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Fund your wallet and enjoy seamless transactions. Your funds are safe and secure with us.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - More coming soon */}
      <section id="features" className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-4">More Features Coming Soon</h2>
          <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            We&apos;re constantly adding new features to make your digital payments experience even better.
          </p>
          <div className="inline-flex gap-3 sm:gap-4">
            <button className="bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-full font-bold hover:bg-blue-700 transition-all duration-300 hover:shadow-lg">
              Notify Me
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4 sm:mb-6">Ready to Simplify Your Payments?</h2>
          <p className="text-base sm:text-lg text-blue-100 mb-8 leading-relaxed">
            Join thousands of users who trust BluePay for their digital payment needs.
          </p>
          <Link href="/onboarding" className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3 sm:py-3.5 rounded-full font-bold text-base hover:bg-blue-50 transition-all duration-300 hover:shadow-lg hover:scale-105">
            Get Started Now
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#why-choose" className="hover:text-white transition-colors">Why BluePay</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="/support" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li><a href="/terms" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="/privacy" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="/security" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Follow Us</h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-xs sm:text-sm">
            <p>&copy; 2026 BluePay Mobile. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
