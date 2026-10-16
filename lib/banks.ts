export type Bank = {
  id: string
  name: string
  code: string | null
  logo: string | null
  providerSupported: boolean
}

const names = [
  "Access Bank", "Access Bank (Diamond)", "Ecobank", "Fidelity Bank", "First Bank of Nigeria", "FCMB",
  "Globus Bank", "Guaranty Trust Bank (GTBank)", "Keystone Bank", "Kuda", "Moniepoint", "Opay",
  "Palmpay", "Parallex Bank", "Polaris Bank", "PremiumTrust Bank", "Providus Bank", "Stanbic IBTC Bank",
  "Standard Chartered Bank", "Sterling Bank", "SunTrust Bank", "TajBank", "Union Bank of Nigeria",
  "United Bank for Africa (UBA)", "Unity Bank", "VFD Microfinance Bank", "Wema Bank", "Zenith Bank",
]

export const localBanks: Bank[] = names.map((name) => ({
  id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  name,
  code: null,
  logo: null,
  providerSupported: false,
}))
