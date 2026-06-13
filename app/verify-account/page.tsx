"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle, User, MapPin } from "lucide-react"

export default function VerifyAccountPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isVerifying, setIsVerifying] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    idType: "",
    idNumber: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1)
    }
  }

  const handleVerification = () => {
    setIsVerifying(true)

    // Simulate verification process
    setTimeout(() => {
      // Mark user as verified
      localStorage.setItem("userVerified", "true")

      // Save verification data
      localStorage.setItem("verificationData", JSON.stringify(formData))

      setIsVerifying(false)
      alert("Account verified successfully! You now have a BLUEPAY verification badge.")
      router.push("/dashboard")
    }, 5000)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Loading Overlay */}
      {isVerifying && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-xl text-center">
            <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-800 font-semibold">Verifying your account...</p>
            <p className="text-sm text-gray-600 mt-2">Please wait while we process your information</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12" style={{ backgroundColor: "#4169E1" }}>
        <button onClick={() => router.back()}>
          <ArrowLeft className="text-white" size={20} />
        </button>
        <h1 className="text-white text-xl font-bold">Verify Account</h1>
        <div className="w-6"></div>
      </div>

      <div className="p-4">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-4">
          {[1, 2, 3].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step >= stepNum ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-600"
                }`}
              >
                {stepNum}
              </div>
              {stepNum < 3 && <div className={`w-16 h-1 ${step > stepNum ? "bg-blue-500" : "bg-gray-300"}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          {step === 1 && (
            <div>
              <div className="text-center mb-6">
                <User className="mx-auto mb-4 text-blue-500" size={48} />
                <h2 className="text-xl font-bold text-gray-800 mb-2">Personal Information</h2>
                <p className="text-gray-600">Please provide your basic information</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <button
                onClick={handleNextStep}
                className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold mt-3 hover:bg-blue-600"
              >
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="text-center mb-6">
                <MapPin className="mx-auto mb-4 text-blue-500" size={48} />
                <h2 className="text-xl font-bold text-gray-800 mb-2">Address & ID Information</h2>
                <p className="text-gray-600">Provide your address and identification details</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
                    placeholder="Enter your full address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ID Type</label>
                  <select
                    value={formData.idType}
                    onChange={(e) => handleInputChange("idType", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select ID Type</option>
                    <option value="nin">National ID (NIN)</option>
                    <option value="bvn">Bank Verification Number (BVN)</option>
                    <option value="passport">International Passport</option>
                    <option value="drivers">Driver's License</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ID Number</label>
                  <input
                    type="text"
                    value={formData.idNumber}
                    onChange={(e) => handleInputChange("idNumber", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your ID number"
                  />
                </div>
              </div>

              <button
                onClick={handleNextStep}
                className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold mt-3 hover:bg-blue-600"
              >
                Continue
              </button>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="text-center mb-6">
                <CheckCircle className="mx-auto mb-4 text-green-500" size={48} />
                <h2 className="text-xl font-bold text-gray-800 mb-2">Review & Submit</h2>
                <p className="text-gray-600">Please review your information before submitting</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-2">Personal Information</h4>
                  <p className="text-sm text-gray-600">Name: {formData.fullName}</p>
                  <p className="text-sm text-gray-600">Email: {formData.email}</p>
                  <p className="text-sm text-gray-600">Phone: {formData.phone}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-2">Address & ID</h4>
                  <p className="text-sm text-gray-600">Address: {formData.address}</p>
                  <p className="text-sm text-gray-600">ID Type: {formData.idType}</p>
                  <p className="text-sm text-gray-600">ID Number: {formData.idNumber}</p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="text-blue-500" size={20} />
                  <h4 className="font-semibold text-blue-800">Verification Benefits</h4>
                </div>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• BLUEPAY verification badge on your profile</li>
                  <li>• Higher transaction limits</li>
                  <li>• Priority customer support</li>
                  <li>• Enhanced security features</li>
                </ul>
              </div>

              <button
                onClick={handleVerification}
                className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600"
              >
                Submit for Verification
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
