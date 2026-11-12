export type BankCategory = "Commercial bank" | "Digital bank" | "Mobile money"
export type AccountIdentifier = "bank-account" | "mobile-number"

export type Bank = {
  id: string
  name: string
  code: string | null
  logo: string | null
  providerSupported: false
  category: BankCategory
  identifier: AccountIdentifier
}

export type AfricanCountry = {
  code: string
  name: string
  currency: string | null
  withdrawalFormEnabled: boolean
}

const countryList: Array<[string, string]> = [
  ["DZ", "Algeria"], ["AO", "Angola"], ["BJ", "Benin"], ["BW", "Botswana"],
  ["BF", "Burkina Faso"], ["BI", "Burundi"], ["CV", "Cabo Verde"], ["CM", "Cameroon"],
  ["CF", "Central African Republic"], ["TD", "Chad"], ["KM", "Comoros"],
  ["CD", "Democratic Republic of the Congo"], ["CG", "Republic of the Congo"], ["CI", "Côte d’Ivoire"],
  ["DJ", "Djibouti"], ["EG", "Egypt"], ["GQ", "Equatorial Guinea"], ["ER", "Eritrea"],
  ["SZ", "Eswatini"], ["ET", "Ethiopia"], ["GA", "Gabon"], ["GM", "The Gambia"], ["GH", "Ghana"],
  ["GN", "Guinea"], ["GW", "Guinea-Bissau"], ["KE", "Kenya"], ["LS", "Lesotho"], ["LR", "Liberia"],
  ["LY", "Libya"], ["MG", "Madagascar"], ["MW", "Malawi"], ["ML", "Mali"], ["MR", "Mauritania"],
  ["MU", "Mauritius"], ["MA", "Morocco"], ["MZ", "Mozambique"], ["NA", "Namibia"], ["NE", "Niger"],
  ["NG", "Nigeria"], ["RW", "Rwanda"], ["ST", "São Tomé and Príncipe"], ["SN", "Senegal"],
  ["SC", "Seychelles"], ["SL", "Sierra Leone"], ["SO", "Somalia"], ["ZA", "South Africa"],
  ["SS", "South Sudan"], ["SD", "Sudan"], ["TZ", "Tanzania"], ["TG", "Togo"], ["TN", "Tunisia"],
  ["UG", "Uganda"], ["EH", "Western Sahara"], ["ZM", "Zambia"], ["ZW", "Zimbabwe"],
]

export const africanCountries: AfricanCountry[] = countryList.map(([code, name]) => ({
  code,
  name,
  currency: code === "NG" ? "NGN" : code === "GH" ? "GHS" : code === "CM" ? "XAF" : null,
  withdrawalFormEnabled: code === "NG" || code === "GH" || code === "CM",
}))

function createBank(
  countryCode: string,
  name: string,
  category: BankCategory = "Commercial bank",
  identifier: AccountIdentifier = "bank-account",
): Bank {
  return {
    id: `${countryCode.toLowerCase()}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
    name,
    code: null,
    logo: null,
    providerSupported: false,
    category,
    identifier,
  }
}

const nigeriaBanks = [
  "Access Bank", "Citibank Nigeria", "Ecobank Nigeria", "Fidelity Bank", "First Bank of Nigeria",
  "First City Monument Bank", "Globus Bank", "Guaranty Trust Bank", "Keystone Bank", "Optimus Bank",
  "Parallex Bank", "Polaris Bank", "Premium Trust Bank", "Providus Bank", "Signature Bank",
  "Stanbic IBTC Bank", "Standard Chartered Bank Nigeria", "Sterling Bank", "SunTrust Bank",
  "TAJBank", "The Alternative Bank", "Union Bank of Nigeria", "United Bank for Africa", "Unity Bank",
  "Wema Bank", "Zenith Bank", "Jaiz Bank", "Lotus Bank",
].map((name) => createBank("NG", name))

const nigeriaDigitalBanks = [
  "ALAT by Wema", "Carbon MFB", "FairMoney MFB", "Kuda MFB", "Moniepoint MFB", "Rubies MFB",
  "Sparkle MFB", "VFD MFB",
].map((name) => createBank("NG", name, "Digital bank"))

const nigeriaMobileMoney = [
  "FirstMonie", "GoMoney", "OPay", "PalmPay", "Paga", "SmartCash PSB",
].map((name) => createBank("NG", name, "Mobile money", "mobile-number"))

const ghanaBanks = [
  "Absa Bank Ghana", "Access Bank Ghana", "Agricultural Development Bank", "Bank of Africa Ghana",
  "CalBank", "Consolidated Bank Ghana", "Ecobank Ghana", "FBNBank Ghana", "Fidelity Bank Ghana",
  "First Atlantic Bank", "First National Bank Ghana", "GCB Bank", "Guaranty Trust Bank Ghana",
  "National Investment Bank", "OmniBSIC Bank Ghana", "Prudential Bank", "Republic Bank Ghana",
  "Stanbic Bank Ghana", "Standard Chartered Bank Ghana", "United Bank for Africa Ghana", "Zenith Bank Ghana",
].map((name) => createBank("GH", name))

const ghanaMobileMoney = [
  "AT Money", "G-Money", "MTN MoMo", "Telecel Cash", "Zeepay",
].map((name) => createBank("GH", name, "Mobile money", "mobile-number"))

const cameroonBanks = [
  "Afriland First Bank", "Banque Internationale du Cameroun pour l’Épargne et le Crédit (BICEC)",
  "CCA-Bank", "Commercial Bank of Cameroon", "Citibank Cameroon", "Ecobank Cameroon",
  "National Financial Credit Bank", "SCB Cameroun", "Société Générale Cameroun", "Union Bank of Cameroon",
  "United Bank for Africa Cameroon",
].map((name) => createBank("CM", name))

const cameroonMobileMoney = [
  "MTN MoMo", "Orange Money",
].map((name) => createBank("CM", name, "Mobile money", "mobile-number"))

export const localBanks: Bank[] = [...nigeriaBanks, ...nigeriaDigitalBanks, ...nigeriaMobileMoney]

export const banksByCountry: Record<string, Bank[]> = {
  NG: localBanks,
  GH: [...ghanaBanks, ...ghanaMobileMoney],
  CM: [...cameroonBanks, ...cameroonMobileMoney],
}

export function getBanksForCountry(countryCode: string) {
  return banksByCountry[countryCode] ?? []
}

export function getAccountNumberGuidance(countryCode: string, bank: Bank | null) {
  if (!bank) return "Choose a destination institution to see the correct account format."
  if (bank.identifier === "mobile-number") {
    if (countryCode === "NG") return "Enter the wallet phone number (10–13 digits, with or without the 234 country code)."
    if (countryCode === "GH") return "Enter the registered mobile number: 10 digits locally, or 12 digits with the 233 country code."
    return "Enter the registered mobile number: 9 digits locally, or 12 digits with the 237 country code."
  }
  if (countryCode === "NG") return "Nigeria bank accounts use a 10-digit NUBAN account number."
  if (countryCode === "GH") return "Ghana bank account lengths vary by institution and may exceed 10 digits. Enter the full number from your bank."
  return "Cameroon account/RIB lengths vary by bank and may exceed 10 digits. Enter the complete number shown on your bank RIB."
}

export function isValidAccountNumber(countryCode: string, bank: Bank, rawValue: string) {
  const value = rawValue.replace(/\D/g, "")
  if (bank.identifier === "mobile-number") {
    if (countryCode === "NG") return value.length >= 10 && value.length <= 13
    if (countryCode === "GH") return value.length === 10 || (value.length === 12 && value.startsWith("233"))
    return value.length === 9 || (value.length === 12 && value.startsWith("237"))
  }
  if (countryCode === "NG") return value.length === 10
  if (countryCode === "GH") return value.length >= 6 && value.length <= 23
  return value.length >= 6 && value.length <= 23
}

export function getAccountNumberMaxLength(countryCode: string, bank: Bank | null) {
  if (!bank) return 23
  if (bank.identifier === "mobile-number") return countryCode === "NG" ? 13 : 12
  if (countryCode === "NG") return 10
  return 23
}
