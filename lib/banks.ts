export type Bank = {
  id: string
  name: string
  code: string | null
  logo: string | null
  providerSupported: boolean
}

const names = [
  "Access Bank", "First Bank", "UBA", "GTBank", "Zenith Bank", "FCMB", "Fidelity Bank", "Wema Bank",
  "Polaris Bank", "Stanbic IBTC", "Sterling Bank", "Union Bank", "Ecobank", "Keystone Bank", "Unity Bank",
  "Jaiz Bank", "Globus Bank", "Providus Bank", "Premium Trust Bank", "Parallex Bank", "Lotus Bank", "TAJBank",
  "OPay", "PalmPay", "Kuda MFB", "Moniepoint MFB", "VFD MFB", "FirstMonie", "Paga", "FairMoney", "Sparkle", "Rubies",
]

export const localBanks: Bank[] = names.map((name) => ({
  id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  name,
  code: null,
  logo: null,
  providerSupported: false,
}))
