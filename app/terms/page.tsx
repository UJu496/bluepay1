"use client"

import { ArrowLeft, FileText, Shield, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function TermsPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">Terms & Privacy Policy</h1>
            <p className="text-sm text-gray-600">Last updated: January 2025</p>
          </div>
          <FileText className="h-8 w-8 text-blue-600" />
        </div>

        {/* Important Notice */}
        <Card className="p-4 mb-6 bg-yellow-50 border-yellow-200">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">Important Notice</p>
              <p>
                By using BLUEPAY services, you agree to these terms. Please read carefully and contact us if you have
                any questions.
              </p>
            </div>
          </div>
        </Card>

        {/* Terms of Service */}
        <Card className="p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            Terms of Service
          </h2>
          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">1. Acceptance of Terms</h3>
              <p>
                By accessing and using BLUEPAY INT'L services, you accept and agree to be bound by these Terms of
                Service. If you do not agree to these terms, please do not use our services.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">2. Account Registration</h3>
              <p>
                You must be at least 18 years old to create a BLUEPAY account. You agree to provide accurate, current,
                and complete information during registration and to update such information to keep it accurate,
                current, and complete.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">3. Account Security</h3>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials. You agree to notify
                us immediately of any unauthorized use of your account. BLUEPAY will not be liable for any loss or
                damage arising from your failure to protect your account information.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">4. Prohibited Activities</h3>
              <p>You agree not to:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Use the service for any illegal or unauthorized purpose</li>
                <li>Violate any laws in your jurisdiction</li>
                <li>Transmit any viruses, malware, or harmful code</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Use the service for money laundering or terrorist financing</li>
                <li>Engage in fraudulent activities or scams</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">5. Transaction Limits</h3>
              <p>
                BLUEPAY imposes transaction limits based on your account verification level. These limits are subject to
                change and are designed to protect both you and our platform from fraud.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">6. Fees and Charges</h3>
              <p>
                You agree to pay all applicable fees for transactions and services. Fees are clearly displayed before
                you complete any transaction. BLUEPAY reserves the right to modify fees with 30 days notice.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">7. Dispute Resolution</h3>
              <p>
                If you have a dispute regarding a transaction, you must notify us within 60 days. We will investigate
                and attempt to resolve the dispute within 45 days. Unresolved disputes may be subject to arbitration
                under Nigerian law.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">8. Account Termination</h3>
              <p>
                BLUEPAY reserves the right to suspend or terminate your account if you violate these terms or engage in
                suspicious activity. You may close your account at any time by contacting support.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">9. Limitation of Liability</h3>
              <p>
                BLUEPAY shall not be liable for any indirect, incidental, special, consequential, or punitive damages
                resulting from your use of the service. Our total liability shall not exceed the amount of fees you paid
                to us in the 12 months preceding the claim.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">10. Changes to Terms</h3>
              <p>
                We reserve the right to modify these terms at any time. We will notify you of significant changes via
                email or in-app notification. Continued use of the service after changes constitutes acceptance of the
                new terms.
              </p>
            </div>
          </div>
        </Card>

        {/* Privacy Policy */}
        <Card className="p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            Privacy Policy
          </h2>
          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">1. Information We Collect</h3>
              <p>We collect the following types of information:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Personal information (name, email, phone number, BVN)</li>
                <li>Transaction data and payment information</li>
                <li>Device information and IP addresses</li>
                <li>Location data (with your permission)</li>
                <li>Usage data and analytics</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">2. How We Use Your Information</h3>
              <p>We use your information to:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Provide and improve our services</li>
                <li>Process transactions and send notifications</li>
                <li>Verify your identity and prevent fraud</li>
                <li>Comply with legal and regulatory requirements</li>
                <li>Send you marketing communications (with your consent)</li>
                <li>Analyze usage patterns and improve user experience</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">3. Information Sharing</h3>
              <p>We do not sell your personal information. We may share your information with:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Service providers who help us operate our platform</li>
                <li>Financial institutions to process transactions</li>
                <li>Regulatory bodies as required by law (CBN, NDIC, EFCC)</li>
                <li>Law enforcement when legally required</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">4. Data Security</h3>
              <p>
                We implement industry-standard security measures including 256-bit encryption, secure servers, regular
                security audits, and employee training. However, no method of transmission over the internet is 100%
                secure.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">5. Your Rights</h3>
              <p>You have the right to:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to data processing</li>
                <li>Export your data</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">6. Data Retention</h3>
              <p>
                We retain your personal data for as long as necessary to provide our services and comply with legal
                obligations. Transaction records are kept for 7 years as required by Nigerian law.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">7. Cookies and Tracking</h3>
              <p>
                We use cookies and similar technologies to improve your experience, analyze usage, and deliver
                personalized content. You can control cookie preferences in your browser settings.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">8. Children's Privacy</h3>
              <p>
                Our services are not intended for children under 18. We do not knowingly collect personal information
                from children. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">9. International Transfers</h3>
              <p>
                Your data may be transferred to and processed in countries outside Nigeria. We ensure appropriate
                safeguards are in place to protect your data in accordance with this privacy policy.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">10. Contact Us</h3>
              <p>
                For privacy-related questions or to exercise your rights, contact our Data Protection Officer at
                privacy@bluepay.ng or call 0800-BLUEPAY.
              </p>
            </div>
          </div>
        </Card>

        {/* Compliance */}
        <Card className="p-4 mb-6 bg-green-50 border-green-200">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Regulatory Compliance
          </h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p>BLUEPAY INT'L is fully compliant with:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Central Bank of Nigeria (CBN) Regulations</li>
              <li>Nigeria Data Protection Regulation (NDPR)</li>
              <li>Anti-Money Laundering (AML) Laws</li>
              <li>Know Your Customer (KYC) Requirements</li>
              <li>Payment Card Industry Data Security Standard (PCI DSS)</li>
            </ul>
          </div>
        </Card>

        {/* Contact */}
        <Card className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <h3 className="font-semibold mb-2">Questions About Our Terms or Privacy?</h3>
          <p className="text-sm opacity-95 mb-3">Our legal team is here to help clarify any concerns you may have.</p>
          <div className="space-y-1 text-sm">
            <p>Email: legal@bluepay.ng</p>
            <p>Phone: 0800-BLUEPAY (0800-258-3729)</p>
            <p>Address: 123 Victoria Island, Lagos, Nigeria</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
