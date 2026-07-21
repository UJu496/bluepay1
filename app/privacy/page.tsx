"use client"

import { ArrowLeft, Shield, Lock, Eye, Database, Share2, Mail } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function PrivacyPage() {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem("userData")
    if (!userData) {
      router.push("/get-started")
      return
    }
    setIsAuthorized(true)
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 pt-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Privacy Policy</h1>
            <p className="text-sm text-blue-100">Last updated: January 2025</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 max-w-4xl mx-auto pb-12">
        {/* Introduction */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Shield className="text-blue-600" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Your Privacy Matters</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                At BluePay Mobile, we are committed to protecting your personal data and respecting your privacy. This policy explains how we collect, use, and protect your information.
              </p>
            </div>
          </div>
        </div>

        {/* Information We Collect */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Database className="text-blue-600" size={24} />
            <h3 className="text-lg font-bold text-gray-900">Information We Collect</h3>
          </div>
          <div className="space-y-3 text-sm text-gray-700">
            <p className="font-semibold text-gray-900">We collect the following types of information:</p>
            <ul className="space-y-2">
              <li className="flex gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Personal Information:</strong> Name, email, phone number, BVN, date of birth</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Transaction Data:</strong> Payment history, amount, recipient information</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Device Information:</strong> IP address, device type, operating system, browser type</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Location Data:</strong> With your permission, we collect location information</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Usage Data:</strong> How you interact with our app and services</span>
              </li>
            </ul>
          </div>
        </div>

        {/* How We Use Your Information */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Eye className="text-green-600" size={24} />
            <h3 className="text-lg font-bold text-gray-900">How We Use Your Information</h3>
          </div>
          <div className="space-y-3 text-sm text-gray-700">
            <p className="font-semibold text-gray-900">Your information is used to:</p>
            <ul className="space-y-2">
              <li className="flex gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Provide and improve our services</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Process transactions and send notifications</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Verify your identity and prevent fraud</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Comply with legal and regulatory requirements</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Send you important updates and customer support</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Data Security */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="text-purple-600" size={24} />
            <h3 className="text-lg font-bold text-gray-900">Data Security</h3>
          </div>
          <div className="space-y-2 text-sm text-gray-700">
            <p>We implement industry-standard security measures to protect your information:</p>
            <ul className="space-y-2 mt-3">
              <li className="flex gap-2">
                <span className="text-purple-600 font-bold">🔒</span>
                <span>256-bit encryption for all data in transit</span>
              </li>
              <li className="flex gap-2">
                <span className="text-purple-600 font-bold">🔒</span>
                <span>Secure servers with regular security audits</span>
              </li>
              <li className="flex gap-2">
                <span className="text-purple-600 font-bold">🔒</span>
                <span>Employee training on data protection</span>
              </li>
              <li className="flex gap-2">
                <span className="text-purple-600 font-bold">🔒</span>
                <span>Compliance with international security standards</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Information Sharing */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Share2 className="text-orange-600" size={24} />
            <h3 className="text-lg font-bold text-gray-900">Information Sharing</h3>
          </div>
          <div className="space-y-3 text-sm text-gray-700">
            <p className="font-semibold text-gray-900">We do not sell your personal information. We share it only with:</p>
            <ul className="space-y-2 mt-3">
              <li className="flex gap-2">
                <span className="text-orange-600 font-bold">•</span>
                <span>Service providers who help us operate our platform</span>
              </li>
              <li className="flex gap-2">
                <span className="text-orange-600 font-bold">•</span>
                <span>Financial institutions to process transactions</span>
              </li>
              <li className="flex gap-2">
                <span className="text-orange-600 font-bold">•</span>
                <span>Regulatory bodies as required by law (CBN, NDIC, EFCC)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-orange-600 font-bold">•</span>
                <span>Law enforcement when legally required</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Your Rights */}
        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Your Privacy Rights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex gap-3">
              <span className="text-blue-600 font-bold text-lg">→</span>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Access Your Data</p>
                <p className="text-xs text-gray-600">Request a copy of your personal data</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-600 font-bold text-lg">→</span>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Correct Your Data</p>
                <p className="text-xs text-gray-600">Update inaccurate information</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-600 font-bold text-lg">→</span>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Delete Your Data</p>
                <p className="text-xs text-gray-600">Request deletion of your information</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-blue-600 font-bold text-lg">→</span>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Export Your Data</p>
                <p className="text-xs text-gray-600">Download your account information</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Us */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="text-blue-600" size={24} />
            <h3 className="text-lg font-bold text-gray-900">Questions About Privacy?</h3>
          </div>
          <div className="space-y-2 text-sm text-gray-700">
            <p className="text-blue-600 font-semibold">Contact our Data Protection Officer:</p>
            <p className="text-gray-600">Email: privacy@bluepay.ng</p>
            <p className="text-gray-600">Phone: 0800-BLUEPAY (0800-258-3729)</p>
            <p className="text-gray-600">Address: 123 Victoria Island, Lagos, Nigeria</p>
          </div>
        </div>

        <div className="h-12"></div>
      </div>
    </div>
  )
}
