"use client"

import { ArrowLeft, Award, Users, Globe, Shield, TrendingUp, Heart } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const milestones = [
  { year: "2020", event: "BLUEPAY Founded", description: "Started with a vision to revolutionize Nigerian fintech" },
  {
    year: "2021",
    event: "CBN License Obtained",
    description: "Received official approval from Central Bank of Nigeria",
  },
  { year: "2022", event: "1M Users Milestone", description: "Reached 1 million active users across Nigeria" },
  { year: "2023", event: "International Expansion", description: "Launched services in Ghana and Kenya" },
  { year: "2024", event: "5M Users & Counting", description: "Now serving over 5 million users daily" },
]

const values = [
  {
    icon: Shield,
    title: "Security First",
    description: "Bank-level encryption and CBN compliance ensure your money is always safe",
  },
  {
    icon: Users,
    title: "Customer Focused",
    description: "24/7 support and user-friendly design put you at the center of everything",
  },
  {
    icon: TrendingUp,
    title: "Innovation",
    description: "Constantly improving with new features and cutting-edge technology",
  },
  {
    icon: Heart,
    title: "Financial Inclusion",
    description: "Making banking accessible to everyone, everywhere in Nigeria",
  },
]

const team = [
  { name: "Dr. Adebayo Ogunlesi", role: "CEO & Founder", experience: "15+ years in fintech" },
  { name: "Amina Mohammed", role: "CTO", experience: "Former Google engineer" },
  { name: "Chukwudi Eze", role: "CFO", experience: "Ex-Goldman Sachs" },
  { name: "Fatima Bello", role: "Head of Operations", experience: "10+ years banking" },
]

const achievements = [
  { metric: "5M+", label: "Active Users" },
  { metric: "₦50B+", label: "Transactions Monthly" },
  { metric: "99.9%", label: "Uptime" },
  { metric: "24/7", label: "Support" },
  { metric: "150+", label: "Team Members" },
  { metric: "36", label: "States Covered" },
]

export default function AboutPage() {
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
            <h1 className="text-xl font-bold text-gray-900">About BLUEPAY INT'L</h1>
            <p className="text-sm text-gray-600">Empowering financial freedom for all Nigerians</p>
          </div>
          <Globe className="h-8 w-8 text-blue-600" />
        </div>

        {/* Hero Section */}
        <Card className="p-4 mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <h2 className="text-xl font-bold mb-3">Our Mission</h2>
          <p className="text-lg leading-relaxed opacity-95">
            To provide accessible, secure, and innovative financial services that empower every Nigerian to achieve
            their financial goals and build a prosperous future.
          </p>
        </Card>

        {/* Achievements Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {achievements.map((item, idx) => (
            <Card key={idx} className="p-4 text-center">
              <div className="text-xl font-bold text-blue-600 mb-1">{item.metric}</div>
              <div className="text-xs text-gray-600">{item.label}</div>
            </Card>
          ))}
        </div>

        {/* Our Story */}
        <Card className="p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Award className="h-6 w-6 text-blue-600" />
            Our Story
          </h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              BLUEPAY INT'L was founded in 2020 with a simple yet powerful vision: to make financial services accessible
              to every Nigerian, regardless of their location or economic status.
            </p>
            <p>
              Starting as a small team of passionate fintech enthusiasts, we recognized the challenges millions of
              Nigerians faced in accessing basic banking services. Long queues, limited branch access, and complex
              processes were barriers we were determined to break down.
            </p>
            <p>
              Today, BLUEPAY serves over 5 million users across Nigeria, processing billions of naira in transactions
              monthly. We're proud to be CBN-licensed and NDIC-insured, ensuring your money is always safe and secure.
            </p>
            <p>
              Our journey is just beginning. We're committed to continuous innovation, expanding our services, and
              remaining true to our core mission of financial inclusion for all.
            </p>
          </div>
        </Card>

        {/* Timeline */}
        <Card className="p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4">Our Journey</h2>
          <div className="space-y-4">
            {milestones.map((milestone, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                    {milestone.year}
                  </div>
                  {idx < milestones.length - 1 && <div className="w-0.5 h-full bg-blue-200 mt-2" />}
                </div>
                <div className="flex-1 pb-6">
                  <h3 className="font-semibold text-gray-900">{milestone.event}</h3>
                  <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Core Values */}
        <Card className="p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {values.map((value, idx) => {
              const Icon = value.icon
              return (
                <div key={idx} className="flex gap-3 p-4 rounded-lg bg-blue-50">
                  <Icon className="h-8 w-8 text-blue-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">{value.title}</h3>
                    <p className="text-sm text-gray-600">{value.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Leadership Team */}
        <Card className="p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600" />
            Leadership Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {team.map((member, idx) => (
              <div key={idx} className="p-4 rounded-lg border">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 mb-3" />
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-blue-600 mb-1">{member.role}</p>
                <p className="text-xs text-gray-600">{member.experience}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Licenses & Certifications */}
        <Card className="p-4 mb-6 bg-green-50 border-green-200">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <Shield className="h-6 w-6 text-green-600" />
            Licenses & Certifications
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-600" />
              <span>Licensed by Central Bank of Nigeria (CBN)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-600" />
              <span>Insured by Nigeria Deposit Insurance Corporation (NDIC)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-600" />
              <span>PCI DSS Level 1 Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-600" />
              <span>ISO 27001 Information Security Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-600" />
              <span>Member of Nigeria Inter-Bank Settlement System (NIBSS)</span>
            </div>
          </div>
        </Card>

        {/* Contact */}
        <Card className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <h3 className="font-semibold mb-2">Get in Touch</h3>
          <div className="space-y-2 text-sm opacity-95">
            <p>Email: support@bluepay.ng</p>
            <p>Phone: 0800-BLUEPAY (0800-258-3729)</p>
            <p>Address: 123 Victoria Island, Lagos, Nigeria</p>
            <p>Business Hours: 24/7 Support Available</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
