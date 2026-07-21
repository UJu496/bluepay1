"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  CreditCard,
  Building2,
  Plus,
  Check,
  Star,
  TrendingUp,
  Shield,
  Zap,
  Globe,
  DollarSign,
  Wallet,
  QrCode,
  LinkIcon,
} from "lucide-react"

const generateNigerianName = () => {
  const firstNames = [
    "Adebayo",
    "Chioma",
    "Emeka",
    "Fatima",
    "Ngozi",
    "Oluwaseun",
    "Amina",
    "Chukwudi",
    "Aisha",
    "Tunde",
    "Zainab",
    "Ikenna",
    "Blessing",
    "Yusuf",
    "Chiamaka",
    "Ibrahim",
    "Nneka",
    "Abdullahi",
    "Funke",
    "Chinedu",
    "Halima",
    "Obinna",
    "Kemi",
    "Musa",
    "Adaeze",
    "Usman",
    "Folake",
    "Chidi",
    "Hauwa",
    "Oluwatobi",
  ]
  const lastNames = [
    "Okafor",
    "Mohammed",
    "Adeleke",
    "Bello",
    "Nwosu",
    "Yusuf",
    "Okonkwo",
    "Abubakar",
    "Adeyemi",
    "Ibrahim",
    "Eze",
    "Hassan",
    "Okoro",
    "Suleiman",
    "Chukwu",
    "Aliyu",
    "Ojo",
    "Umar",
    "Nnamdi",
    "Musa",
    "Obi",
    "Abdullahi",
    "Adebisi",
    "Garba",
    "Nnaji",
    "Ismail",
    "Oluwole",
    "Bala",
    "Chikezie",
    "Sani",
  ]
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`
}

const nigerianBanks = [
  "Access Bank",
  "GTBank (Guaranty Trust Bank)",
  "First Bank of Nigeria",
  "Zenith Bank",
  "United Bank for Africa (UBA)",
  "Fidelity Bank",
  "Union Bank",
  "Stanbic IBTC Bank",
  "Sterling Bank",
  "Polaris Bank",
  "Wema Bank",
  "Ecobank Nigeria",
  "Keystone Bank",
  "Unity Bank",
  "Jaiz Bank",
  "Providus Bank",
  "SunTrust Bank",
  "Titan Trust Bank",
  "Globus Bank",
  "Parallex Bank",
  "Premium Trust Bank",
  "OPay",
  "Kuda Bank",
  "PalmPay",
  "Moniepoint",
  "VFD Microfinance Bank",
  "Rubies Bank",
  "Carbon (Formerly PAGA)",
  "FairMoney",
  "Renmoney",
  "ALAT by Wema",
  "V Bank (VFD)",
  "GoMoney (Interswitch)",
]

export default function PaymentMethodsPage() {
  const router = useRouter()
  const [selectedMethod, setSelectedMethod] = useState("bank")
  const [showAddCard, setShowAddCard] = useState(false)
  const [showAddBank, setShowAddBank] = useState(false)

  const [savedCards, setSavedCards] = useState([
    { id: 1, type: "Visa", last4: "4532", expiry: "12/25", holderName: generateNigerianName(), isDefault: true },
    { id: 2, type: "Mastercard", last4: "8901", expiry: "08/26", holderName: generateNigerianName(), isDefault: false },
  ])

  const [savedBanks, setSavedBanks] = useState([
    { id: 1, name: "Access Bank", accountNumber: "6711230988", accountName: "MOD...CHI...AGB.. (BLUEPAY MOBILE 2026 Agent)", isDefault: true },
    {
      id: 2,
      name: "GTBank (Guaranty Trust Bank)",
      accountNumber: "0987654321",
      accountName: generateNigerianName(),
      isDefault: false,
    },
    { id: 3, name: "OPay", accountNumber: "1234567890", accountName: generateNigerianName(), isDefault: false },
  ])

  const [newCard, setNewCard] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    holderName: "",
  })

  const [newBank, setNewBank] = useState({
    bankName: "",
    accountNumber: "",
    accountName: "",
  })

  const handleAddCard = () => {
    if (!newCard.cardNumber || !newCard.expiryDate || !newCard.cvv || !newCard.holderName) {
      alert("Please fill in all card details")
      return
    }

    const last4 = newCard.cardNumber.slice(-4)
    const cardType = newCard.cardNumber.startsWith("4") ? "Visa" : "Mastercard"

    const newCardData = {
      id: savedCards.length + 1,
      type: cardType,
      last4: last4,
      expiry: newCard.expiryDate,
      holderName: newCard.holderName,
      isDefault: savedCards.length === 0,
    }

    setSavedCards([...savedCards, newCardData])
    setNewCard({ cardNumber: "", expiryDate: "", cvv: "", holderName: "" })
    setShowAddCard(false)
    alert("Card added successfully!")
  }

  const handleAddBank = () => {
    if (!newBank.bankName || !newBank.accountNumber || !newBank.accountName) {
      alert("Please fill in all bank details")
      return
    }

    const newBankData = {
      id: savedBanks.length + 1,
      name: newBank.bankName,
      accountNumber: newBank.accountNumber,
      accountName: newBank.accountName,
      isDefault: savedBanks.length === 0,
    }

    setSavedBanks([...savedBanks, newBankData])
    setNewBank({ bankName: "", accountNumber: "", accountName: "" })
    setShowAddBank(false)
    alert("Bank account added successfully!")
  }

  const handleRemoveCard = (cardId: number) => {
    setSavedCards(savedCards.filter((card) => card.id !== cardId))
  }

  const handleRemoveBank = (bankId: number) => {
    setSavedBanks(savedBanks.filter((bank) => bank.id !== bankId))
  }

  const paymentFeatures = [
    {
      icon: Zap,
      title: "Instant Transfers",
      description: "Send and receive money instantly",
      color: "from-yellow-400 to-orange-500",
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Bank-level encryption for all transactions",
      color: "from-blue-400 to-cyan-500",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Pay anyone, anywhere in Nigeria",
      color: "from-green-400 to-teal-500",
    },
    {
      icon: TrendingUp,
      title: "Low Fees",
      description: "Competitive rates on all transactions",
      color: "from-purple-400 to-pink-500",
    },
  ]

  const quickActions = [
    { icon: QrCode, title: "Scan to Pay", description: "Use QR code for quick payments", color: "bg-blue-500" },
    { icon: LinkIcon, title: "Payment Link", description: "Generate payment links", color: "bg-green-500" },
    { icon: Wallet, title: "Virtual Card", description: "Create virtual cards", color: "bg-purple-500" },
    { icon: DollarSign, title: "Request Money", description: "Send payment requests", color: "bg-orange-500" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {showAddCard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Card</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={newCard.cardNumber}
                  onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value.replace(/\s/g, "") })}
                  maxLength={16}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={newCard.expiryDate}
                    onChange={(e) => setNewCard({ ...newCard, expiryDate: e.target.value })}
                    maxLength={5}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    value={newCard.cvv}
                    onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })}
                    maxLength={3}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={newCard.holderName}
                  onChange={(e) => setNewCard({ ...newCard, holderName: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowAddCard(false)
                    setNewCard({ cardNumber: "", expiryDate: "", cvv: "", holderName: "" })
                  }}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCard}
                  className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
                >
                  Add Card
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddBank && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Add Bank Account</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Bank Name</label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newBank.bankName}
                  onChange={(e) => setNewBank({ ...newBank, bankName: e.target.value })}
                >
                  <option value="">Select Bank</option>
                  {nigerianBanks.map((bank, index) => (
                    <option key={index} value={bank}>
                      {bank}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Account Number</label>
                <input
                  type="text"
                  placeholder="0123456789"
                  value={newBank.accountNumber}
                  onChange={(e) => setNewBank({ ...newBank, accountNumber: e.target.value })}
                  maxLength={10}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Account Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={newBank.accountName}
                  onChange={(e) => setNewBank({ ...newBank, accountName: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Enter your name as it appears on your bank account</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowAddBank(false)
                    setNewBank({ bankName: "", accountNumber: "", accountName: "" })
                  }}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddBank}
                  className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
                >
                  Add Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 pt-12">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => router.push("/settings")}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold">Payment Methods</h1>
        </div>
        <p className="text-white/90 text-sm">Manage your cards and bank accounts</p>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center`}>
                  <action.icon className="text-white" size={20} />
                </div>
                <p className="text-sm font-semibold text-gray-800 text-center">{action.title}</p>
                <p className="text-xs text-gray-600 text-center">{action.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Saved Cards</h2>
            <button
              onClick={() => setShowAddCard(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
            >
              <Plus size={20} />
              <span>Add Card</span>
            </button>
          </div>

          <div className="space-y-3">
            {savedCards.map((card) => (
              <div
                key={card.id}
                className="relative p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white"
              >
                {card.isDefault && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-white/20 rounded-full">
                    <Star className="text-yellow-300" size={12} fill="currentColor" />
                    <span className="text-xs font-semibold">Default</span>
                  </div>
                )}
                <div className="flex items-center justify-between mb-4">
                  <CreditCard size={20} />
                  <span className="text-sm font-semibold">{card.type}</span>
                </div>
                <p className="text-lg font-mono mb-2">•••• •••�� •••• {card.last4}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs opacity-80">Expires {card.expiry}</p>
                    <p className="text-sm font-semibold mt-1">{card.holderName}</p>
                  </div>
                  <button onClick={() => handleRemoveCard(card.id)} className="text-xs underline hover:text-red-200">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Bank Accounts</h2>
            <button
              onClick={() => setShowAddBank(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors"
            >
              <Plus size={20} />
              <span>Add Bank</span>
            </button>
          </div>

          <div className="space-y-3">
            {savedBanks.map((bank) => (
              <div key={bank.id} className="relative p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                {bank.isDefault && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-green-100 rounded-full">
                    <Check className="text-green-600" size={12} />
                    <span className="text-xs font-semibold text-green-600">Default</span>
                  </div>
                )}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Building2 className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{bank.name}</p>
                    <p className="text-sm text-gray-600">{bank.accountName}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-mono text-gray-700">{bank.accountNumber}</p>
                  <button
                    onClick={() => handleRemoveBank(bank.id)}
                    className="text-sm text-red-500 font-semibold hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Payment Features</h2>
          <div className="grid grid-cols-1 gap-3">
            {paymentFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center`}
                >
                  <feature.icon className="text-white" size={20} />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{feature.title}</p>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Transaction Limits</h2>
            <button className="w-full py-3 bg-purple-500 text-white rounded-xl font-semibold hover:bg-purple-600 transition-colors">
              Request Limit Increase
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Daily Withdrawal Limit</span>
                <span className="text-sm font-semibold text-gray-800">₦500,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: "60%" }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">₦300,000 used today</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Monthly Transfer Limit</span>
                <span className="text-sm font-semibold text-gray-800">₦5,000,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: "35%" }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">₦1,750,000 used this month</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-4 text-white shadow-sm">
          <h3 className="text-lg font-bold mb-2">Payment Security</h3>
          <div className="space-y-2 text-sm">
            <p>All transactions are encrypted with bank-level security</p>
            <p>3D Secure authentication for card payments</p>
            <p>Real-time fraud detection and prevention</p>
            <p>Instant notifications for all transactions</p>
            <p>24/7 customer support for payment issues</p>
          </div>
        </div>

        <div className="h-20"></div>
      </div>
    </div>
  )
}
