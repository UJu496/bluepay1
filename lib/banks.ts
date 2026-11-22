export type BankCategory = "Commercial bank" | "Non-interest bank" | "Microfinance bank" | "Digital / mobile money"

export type Bank = {
  id: string
  name: string
  code: string | null
  logo: string | null
  providerSupported: boolean
  category: BankCategory
}

const catalog: Array<{ name: string; category: BankCategory }> = [
  { name: "Access Bank", category: "Commercial bank" },
  { name: "Access Bank (Diamond)", category: "Commercial bank" },
  { name: "Citibank Nigeria", category: "Commercial bank" },
  { name: "Ecobank Nigeria", category: "Commercial bank" },
  { name: "Fidelity Bank", category: "Commercial bank" },
  { name: "First Bank of Nigeria", category: "Commercial bank" },
  { name: "First City Monument Bank (FCMB)", category: "Commercial bank" },
  { name: "Globus Bank", category: "Commercial bank" },
  { name: "Guaranty Trust Bank (GTBank)", category: "Commercial bank" },
  { name: "Keystone Bank", category: "Commercial bank" },
  { name: "Parallex Bank", category: "Commercial bank" },
  { name: "Polaris Bank", category: "Commercial bank" },
  { name: "PremiumTrust Bank", category: "Commercial bank" },
  { name: "Providus Bank", category: "Commercial bank" },
  { name: "Signature Bank", category: "Commercial bank" },
  { name: "Stanbic IBTC Bank", category: "Commercial bank" },
  { name: "Standard Chartered Bank Nigeria", category: "Commercial bank" },
  { name: "Sterling Bank", category: "Commercial bank" },
  { name: "SunTrust Bank", category: "Commercial bank" },
  { name: "Union Bank of Nigeria", category: "Commercial bank" },
  { name: "United Bank for Africa (UBA)", category: "Commercial bank" },
  { name: "Unity Bank", category: "Commercial bank" },
  { name: "Wema Bank", category: "Commercial bank" },
  { name: "Zenith Bank", category: "Commercial bank" },
  { name: "Jaiz Bank", category: "Non-interest bank" },
  { name: "Lotus Bank", category: "Non-interest bank" },
  { name: "TAJBank", category: "Non-interest bank" },
  { name: "Moniepoint MFB", category: "Microfinance bank" },
  { name: "Kuda Microfinance Bank", category: "Microfinance bank" },
  { name: "VFD Microfinance Bank", category: "Microfinance bank" },
  { name: "FairMoney Microfinance Bank", category: "Microfinance bank" },
  { name: "Carbon Microfinance Bank", category: "Microfinance bank" },
  { name: "Sparkle Microfinance Bank", category: "Microfinance bank" },
  { name: "Rubies Microfinance Bank", category: "Microfinance bank" },
  { name: "OPay", category: "Digital / mobile money" },
  { name: "PalmPay", category: "Digital / mobile money" },
  { name: "Paga", category: "Digital / mobile money" },
  { name: "ALAT by Wema", category: "Digital / mobile money" },
]

function categoryFor(name: string): BankCategory {
  const normalized = name.toLowerCase()
  if (/(mfb|microfinance|micro-finance)/.test(normalized)) return "Microfinance bank"
  if (/(opay|palmpay|paga|alat|mobile money)/.test(normalized)) return "Digital / mobile money"
  if (/(jaiz|lotus|taj)/.test(normalized)) return "Non-interest bank"
  return "Commercial bank"
}

export function getBankCategory(name: string): BankCategory {
  return catalog.find((bank) => bank.name.toLowerCase() === name.toLowerCase())?.category ?? categoryFor(name)
}

export const localBanks: Bank[] = catalog.map(({ name, category }) => ({
  id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  name,
  code: null,
  logo: null,
  providerSupported: false,
  category,
}))
