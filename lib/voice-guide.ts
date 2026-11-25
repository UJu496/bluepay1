import { getTransactionById } from "@/lib/transactions"

export type VoiceSpeed = "slow" | "normal" | "fast"

export type VoicePreferences = {
  financialDetailsVoice: boolean
  muted: boolean
  speed: VoiceSpeed
}

export const DEFAULT_VOICE_PREFERENCES: VoicePreferences = {
  financialDetailsVoice: false,
  muted: false,
  speed: "normal",
}

export const VOICE_PREFERENCES_EVENT = "bluepay:voice-preferences-changed"
export const VOICE_REPLAY_EVENT = "bluepay:voice-replay"
export const VOICE_EXIT_EVENT = "bluepay:voice-exit"

const routeGuidance: Record<string, string> = {
  "/": "This is the BLUEPAY MOBILE welcome page. Choose Get Started to create an account or Sign In if you already have one. Keep your login details private.",
  "/about": "This page explains BLUEPAY MOBILE. Read the information on screen, then use the navigation controls to return or continue. Contact official support if you need clarification.",
  "/airtime": "Use this page to buy airtime. Choose the mobile network and enter the phone number and amount requested on screen, then enter your BPC authorization code. Check the number and amount before confirming; never share your BPC code.",
  "/bills": "Use this page to pay a bill listed by BLUEPAY. Select the bill type and provider shown, enter only the account details requested, review the amount and recipient, then follow the on-screen payment button. Confirm the details with your provider before paying.",
  "/buy-bpc": "You are about to purchase a BLUEPAY BPC authorization code. Review the purchase amount and follow the payment instructions displayed on your screen. Select Next to continue. Never share an authorization code or payment credentials.",
  "/create-pin": "Create your BLUEPAY security PIN using the on-screen instructions, then continue. Do not say your PIN aloud or share it with anyone, including support.",
  "/dashboard": "This is your BLUEPAY dashboard. Check your wallet and recent activity, then choose the service you need, such as Transfer To Bank, Withdraw, Airtime, Data, Bills, or Earn. Review every transaction before you confirm it.",
  "/dangote-ipo": "This page contains the Dangote IPO information and actions available in BLUEPAY. Review the terms and details shown on screen, then use the available button to continue or return. Do not submit money unless you understand the displayed conditions.",
  "/data": "Use this page to buy mobile data. Choose a network and plan, enter the recipient phone number and BPC authorization code, then review the plan and amount before selecting the purchase button. Never share your BPC code.",
  "/earn": "Explore the earning activities shown on this page. Review each task's requirements and reward information, then choose an available task to continue. Do not provide account security details to complete a task.",
  "/faq": "This page contains frequently asked questions. Select a question to review its answer, or use Contact Support if your issue is not covered. Never send passwords, PINs, or BPC codes in a support request.",
  "/features": "This page describes BLUEPAY services. Review the features, then choose the service you want from the available links. Use the in-app instructions before sharing any payment information.",
  "/forgot-password": "Use this page to recover access to your account. Enter the requested account information and follow the on-screen instructions. Do not share your password or any verification code with another person.",
  "/get-started": "Create an account by entering the requested profile details, or choose Sign In if you already have a BLUEPAY account. Keep your password private and do not speak it aloud.",
  "/goals": "Use this page to review and manage your savings goals. Follow the fields shown to create or update a goal, then review the target before saving. Check the displayed terms before moving money.",
  "/language": "Choose your preferred language, region, date format, and time format on this page, then save your choices. These settings change how information is displayed.",
  "/login": "Enter your registered sign-in details and select the Sign In button. Keep your password private; BLUEPAY VOICE GUIDE will never read it aloud.",
  "/notifications": "Review your BLUEPAY notifications on this page. Open an item for details and use the displayed actions to follow up. Verify transaction status in Recent Activities rather than relying on a notification alone.",
  "/onboarding": "Follow the onboarding instructions shown on screen and use Continue to move through the setup. Provide only the information requested and keep security details private.",
  "/order-atm": "Use this page to review the ATM card ordering options available in BLUEPAY. Enter the requested delivery details, review any displayed charges and delivery information, then follow the order button. Confirm the address before submitting.",
  "/payment": "This page contains the BLUEPAY BPC purchase payment instructions. Review the beneficiary and payment details displayed, complete the transfer using your banking app, and attach a receipt if requested. Do not pay from OPay or PalmPay accounts, as the page says these are not accepted. BLUEPAY does not automatically verify the bank payment here; do not treat submission as confirmation.",
  "/payment-confirmation": "Your BLUEPAY BPC purchase submission is awaiting review unless the saved transaction status explicitly says otherwise. Review the displayed status and reference, then use the available recheck or support action. A submitted receipt is not proof that payment has been confirmed.",
  "/payment-methods": "Review the payment methods listed on this page and choose an available option to continue. Check any displayed fees and recipient details before authorizing a payment.",
  "/privacy": "This page explains BLUEPAY privacy information. Review the sections on screen and use the back button or navigation to return. Contact support if you have a privacy question.",
  "/profile": "Review your registered profile details here and use the available edit or settings controls to make changes. Confirm any updates before saving, and do not share private account information publicly.",
  "/reports": "Use this page to review the reports and analytics shown for your account. Choose an available date range or report filter, then inspect the results before making decisions. Keep downloaded financial information private.",
  "/reviews": "Use this page to submit a review about your BLUEPAY experience. Enter only the feedback requested and choose Submit when ready. Do not include passwords, PINs, or BPC authorization codes.",
  "/security": "Review the security and privacy options shown here. Choose the setting you want to manage and follow its instructions. Never disclose your PIN, password, or one-time verification code.",
  "/security-pin": "Use this page to set or update your security PIN. Enter it only in the protected fields and confirm it as requested. The voice guide will not read or repeat your PIN.",
  "/settings": "Manage your BLUEPAY preferences here. Voice guidance is built in and automatically introduces each page and transaction step. You can mute it using the floating voice control. Financial details are not spoken aloud by default for privacy.",
  "/spending-breakdown": "This page summarizes the spending breakdown available in your account. Review the categories shown and use the navigation controls to return to your transactions. Keep financial details private if other people can hear your device.",
  "/support": "Use this page to contact BLUEPAY support through the options shown. Describe the issue without including a password, PIN, full account number, one-time code, or BPC authorization code.",
  "/terms": "Review the BLUEPAY terms and privacy information on this page. Use the back button or navigation controls when you are finished.",
  "/testimonies": "This page shares BLUEPAY user stories. Browse the stories and use the page navigation to return to the service you need.",
  "/transaction-success": "Review the transaction result and status shown on this page. Use Transaction Details or Recent Activities to verify the recorded result. Do not assume an external payout succeeded unless the confirmed provider status is shown.",
  "/transactions": "This is Recent Activities. Search or filter your transactions, then open an item to review its recorded status and details. A pending or processing transaction is not a successful transaction.",
  "/verify-account": "Complete only the account verification fields requested on screen, then follow the verification button. Do not say or share your one-time code or other identity details aloud.",
  "/verify-pin": "Enter your existing security PIN in the protected field and select Continue. Never disclose the PIN; the voice guide does not access or read the entered digits.",
  "/watch": "This page contains the BLUEPAY watch content available in the app. Use the on-screen controls to play or return. Do not enter payment or account security details here.",
  "/withdraw": "",
  "/withdrawal-confirmation": "",
  "/withdrawal-success": "",
}

function safeProfile() {
  if (typeof window === "undefined") return null
  try {
    const profile = JSON.parse(window.localStorage.getItem("userData") || "null") as { id?: string; firstName?: string; fullName?: string; name?: string; email?: string } | null
    if (!profile) return null
    const fullName = typeof profile.fullName === "string" ? profile.fullName : typeof profile.name === "string" ? profile.name : ""
    const candidateFirstName = typeof profile.firstName === "string" ? profile.firstName.trim() : fullName.trim().split(/\s+/)[0] || ""
    const firstName = candidateFirstName.includes("@") ? "" : candidateFirstName
    const identity = profile.id || profile.email || fullName
    return { firstName, identity }
  } catch {
    return null
  }
}

function hashIdentity(value: string) {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return (hash >>> 0).toString(36)
}

function preferenceKey() {
  const profile = safeProfile()
  return `bluepayVoicePreferences:${hashIdentity(profile?.identity || "guest")}`
}

export function getVoiceProfile() {
  const profile = safeProfile()
  return profile ? { firstName: profile.firstName, profileKey: hashIdentity(profile.identity || "guest") } : { firstName: "", profileKey: "" }
}

export function readVoicePreferences(): VoicePreferences {
  if (typeof window === "undefined") return DEFAULT_VOICE_PREFERENCES
  try {
    const saved = JSON.parse(window.localStorage.getItem(preferenceKey()) || "null") as Partial<VoicePreferences> | null
    const speed = saved?.speed === "slow" || saved?.speed === "fast" ? saved.speed : "normal"
    return {
      financialDetailsVoice: saved?.financialDetailsVoice === true,
      muted: saved?.muted === true,
      speed,
    }
  } catch {
    return DEFAULT_VOICE_PREFERENCES
  }
}

export function saveVoicePreferences(preferences: VoicePreferences) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(preferenceKey(), JSON.stringify(preferences))
}

export function notifyVoicePreferencesChanged(preferences: VoicePreferences) {
  if (typeof window === "undefined") return
  window.dispatchEvent(new CustomEvent(VOICE_PREFERENCES_EVENT, { detail: { preferences } }))
}

export function announceVoiceGuideExit() {
  if (typeof window === "undefined") return
  window.dispatchEvent(new CustomEvent(VOICE_EXIT_EVENT, { detail: { firstName: getVoiceProfile().firstName } }))
}

export function buildWelcomeScript(firstName: string) {
  if (!firstName) return "Welcome to BLUEPAY MOBILE!"
  return `Welcome to BLUEPAY MOBILE, ${firstName}! It's great to have you here. I'm your personal BLUEPAY assistant. I will guide you through your banking activities, payments, transfers, withdrawals and other services. Let's get started!`
}

function currencyForSpeech(value: number) {
  const amount = Number.isFinite(value) ? Math.max(0, value) : 0
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(amount)
}

function getTransferInformation() {
  if (typeof window === "undefined") return { balance: 0, tier: "Standard", fee: 0, minimum: 100 }
  const element = document.querySelector<HTMLElement>("[data-voice-transfer-info]")
  const storedBalance = Number(window.localStorage.getItem("userBalance"))
  return {
    balance: Number.isFinite(storedBalance) && storedBalance >= 0 ? storedBalance : 0,
    tier: element?.dataset.voiceTier || "Standard",
    fee: Number(element?.dataset.voiceFee || 0),
    minimum: Number(element?.dataset.voiceMinimum || 100),
  }
}

function transferBalanceScript(financialDetailsVoice: boolean) {
  if (!financialDetailsVoice) {
    return "Your wallet balance, current transfer tier, fee, and minimum amount are displayed on screen. For privacy, I will not read financial details aloud unless you enable financial-detail narration in Settings."
  }
  const { balance, tier, fee, minimum } = getTransferInformation()
  return `Your available wallet balance is ${currencyForSpeech(balance)}. Your current transfer tier is ${tier}. Your transfer fee is ${currencyForSpeech(fee)}, and the minimum transfer amount is ${currencyForSpeech(minimum)}. Please make sure you have sufficient funds before proceeding.`
}

function transferSummaryScript(financialDetailsVoice: boolean) {
  const reviewPrompt = "Before sending your money, carefully review your transfer summary. Confirm the destination bank, recipient details, transfer amount, applicable fee and remaining wallet balance. Make sure everything is correct."
  if (!financialDetailsVoice || typeof window === "undefined") return reviewPrompt

  const bank = document.getElementById("destination-bank")?.textContent?.trim() || "the selected bank"
  const recipient = document.getElementById("account-name") as HTMLInputElement | null
  const amountInput = document.getElementById("transfer-amount") as HTMLInputElement | null
  const enteredAmount = Number(amountInput?.value || 0) || 0
  const { balance, fee } = getTransferInformation()
  const remaining = Math.max(0, balance - enteredAmount - fee)
  const recipientName = recipient?.value.trim()
  return `${reviewPrompt} The destination is ${bank}${recipientName ? `, for recipient ${recipientName}` : ""}. The transfer amount is ${currencyForSpeech(enteredAmount)}, the fee is ${currencyForSpeech(fee)}, and the estimated remaining wallet balance is ${currencyForSpeech(remaining)}. I will not read the account number aloud.`
}

function withdrawalResultScript(firstName: string) {
  if (typeof window === "undefined") return "Review the transaction status shown on screen."
  try {
    const data = JSON.parse(window.localStorage.getItem("withdrawalData") || "null") as { status?: string } | null
    const status = data?.status?.toLowerCase()
    if (status === "successful") {
      const name = firstName ? `, ${firstName}` : ""
      return `Congratulations${name}! The BLUEPAY transaction record shows that your transfer was marked successful. This confirms the recorded app status only, not that the receiving bank has credited the account. Check Recent Activities and confirm with the recipient's bank before assuming the payout arrived.`
    }
    if (status === "failed") return "Your transfer is recorded as failed. Do not retry until you have reviewed the transaction status and any balance update in Recent Activities or contacted BLUEPAY support."
    if (["pending", "initiated", "processing", "awaiting_review", "awaiting review"].includes(status || "")) {
      return `Hello${firstName ? ` ${firstName}` : ""}, your transfer request is awaiting confirmation or review. It is not recorded as successful. Please check Recent Activities for updates.`
    }
    return "The transfer status is not confirmed as successful. Review Recent Activities for the recorded status before taking another action."
  } catch {
    return "The transfer status could not be verified. Review Recent Activities before taking another action."
  }
}

function transactionDetailsScript(pathname: string, firstName: string) {
  if (typeof window === "undefined") return "Review the transaction status shown on screen."
  try {
    const transactionId = decodeURIComponent(pathname.split("/").pop() || "")
    const status = getTransactionById(transactionId)?.status?.trim().toLowerCase()
    if (status === "successful" || status === "completed") {
      return `Congratulations${firstName ? `, ${firstName}` : ""}. This transaction is marked successful in the BLUEPAY activity record. Review the details shown on screen. For an external bank transfer, this record alone does not confirm that the receiving bank has credited the account.`
    }
    if (["pending", "pending_verification", "processing", "initiated", "awaiting_review", "awaiting review"].includes(status || "")) {
      const spokenStatus = status === "initiated" ? "awaiting confirmation" : status === "pending_verification" || status === "awaiting_review" || status === "awaiting review" ? "awaiting review" : status
      return `Hello${firstName ? ` ${firstName}` : ""}, this transaction is ${spokenStatus}. It is not recorded as successful. Check Recent Activities for updates.`
    }
    if (status === "failed" || status === "rejected") return "This transaction is recorded as failed. Review the details and status before trying again, or contact BLUEPAY support."
    if (status === "reversed") return "This transaction is recorded as reversed. Review the transaction details and balance, then contact BLUEPAY support if you need clarification."
    return "The transaction status is not confirmed as successful. Review the status shown on screen and check Recent Activities before taking another action."
  } catch {
    return "The transaction status could not be verified. Review the details on screen and check Recent Activities before taking another action."
  }
}

function paymentReviewScript() {
  if (typeof window === "undefined") return "Review the payment status shown on screen."
  try {
    const id = new URLSearchParams(window.location.search).get("attemptId")
    const stored = id ? window.localStorage.getItem(`bluepayPaymentAttempt:${id}`) : window.localStorage.getItem("paymentAttempt")
    const attempt = stored ? JSON.parse(stored) as { status?: string } : null
    const status = attempt?.status?.toLowerCase()
    if (status === "successful" || status === "completed" || status === "paid") {
      return "The saved payment attempt is marked successful. This is the recorded payment status only; review the transaction details for confirmation."
    }
    if (status === "failed" || status === "rejected") return "The saved payment attempt is recorded as failed or rejected. Follow the instructions on screen or contact support before retrying."
    return "Your payment submission is awaiting review and has not been confirmed as successful. Keep your receipt available and check the payment review page for updates."
  } catch {
    return "The payment review status could not be verified. Follow the instructions on screen or contact support."
  }
}

function transactionSuccessPageScript(firstName: string) {
  if (typeof window === "undefined") return "Review the transaction status shown on screen."
  try {
    const transaction = JSON.parse(window.localStorage.getItem("lastTransaction") || "null") as { id?: string; status?: string } | null
    const status = (transaction?.status || (transaction?.id ? getTransactionById(transaction.id)?.status : ""))?.trim().toLowerCase()
    if (status === "successful" || status === "completed") {
      return `Congratulations${firstName ? `, ${firstName}` : ""}. The saved transaction status is successful. Review the transaction details. For an external bank transfer, this record alone does not confirm that the receiving bank has credited the account.`
    }
    if (["pending", "pending_verification", "processing", "initiated", "awaiting_review", "awaiting review"].includes(status || "")) {
      return `Hello${firstName ? ` ${firstName}` : ""}, this transaction is awaiting confirmation or review and is not recorded as successful. Check Recent Activities for updates.`
    }
    if (status === "failed" || status === "rejected") return "This transaction is recorded as failed. Review its status and contact BLUEPAY support before trying again."
    return `Hello${firstName ? ` ${firstName}` : ""}, this page shows transaction details, but the saved record does not include a confirmed success status. I cannot announce that the transaction succeeded. Review Recent Activities and confirm any external payout with the receiving provider.`
  } catch {
    return "The transaction status could not be verified. Review Recent Activities before taking another action."
  }
}

export function getPageVoiceScript(pathname: string, firstName: string, preferences: VoicePreferences) {
  if (pathname === "/withdraw") {
    const greeting = firstName ? `Hello ${firstName}, ` : "Hello, "
    return `${greeting}welcome to Transfer to Bank on BLUEPAY MOBILE. Here, you can send money from your BLUEPAY wallet to supported Nigerian bank accounts. Let me guide you through the process. ${transferBalanceScript(preferences.financialDetailsVoice)} Step one, recipient bank account. Select your destination bank from the popular banks or the complete bank list. Enter the recipient's ten-digit account number and the recipient's account name. Please confirm the details with the recipient before proceeding.`
  }
  if (pathname === "/buy-bpc") {
    const greeting = firstName ? `Hello ${firstName}, ` : "Hello, "
    return `${greeting}you are about to purchase a BLUEPAY BPC authorization code. Please review the purchase amount and follow the payment instructions displayed on your screen. Select Next to continue. Never share the authorization code or your payment credentials.`
  }
  if (pathname === "/payment-confirmation") return `${firstName ? `Hello ${firstName}. ` : ""}${paymentReviewScript()}`
  if (pathname === "/withdrawal-confirmation") {
    const greeting = firstName ? `Thank you, ${firstName}. ` : "Thank you. "
    return `${greeting}your transfer request is being prepared. Please wait while BLUEPAY validates your transfer details and BPC authorization. Carefully review the destination bank, recipient details, amount, fee and remaining wallet balance on screen. Only select YES, I CONFIRM if the displayed recipient and amount are correct. This confirmation does not verify an external bank payout.`
  }
  if (pathname === "/withdrawal-success") return withdrawalResultScript(firstName)
  if (pathname === "/transaction-success") return transactionSuccessPageScript(firstName)
  if (pathname.startsWith("/transactions/")) return transactionDetailsScript(pathname, firstName)
  const script = routeGuidance[pathname]
  const guidance = script || "Review the page title and instructions shown on screen. Complete only the requested fields, check the details before continuing, and use the page's visible action button. Keep passwords, PINs, one-time codes, full account numbers and BPC authorization codes private."
  return firstName ? `Hello ${firstName}. ${guidance}` : guidance
}

export function getInteractionVoiceScript(kind: string, firstName: string, preferences: VoicePreferences, value?: string) {
  if (kind === "bank-selected") return `Excellent${firstName ? `, ${firstName}` : ""}. You have selected ${value || "the destination bank"}. Now enter the recipient's account number.`
  if (kind === "account-number-entered") return "Thank you. Enter the recipient's account name manually and carefully confirm that the details are correct. I will not read the account number aloud."
  if (kind === "recipient-name-entered") return "Thank you. Confirm the recipient's name with them before continuing. Your BPC authorization code is required for this external bank transfer. Enter your valid code in the authorization field. If you do not have a code, use Buy BPC Code. I will never read the code aloud."
  if (kind === "bpc-code-focus") return "Your BPC authorization code is required to authorize this external bank transfer. Enter your valid BPC code in the authorization field. If you do not have a code, you can use the Buy BPC Code option. I will not read the code aloud."
  if (kind === "transfer-amount-focus") {
    const balance = transferBalanceScript(preferences.financialDetailsVoice)
    return `Step two, transfer amount. Enter the amount you want to send. You can choose one of the suggested amounts or enter a different amount. You can also use the MAX button to select your available balance, subject to your transfer limits. ${balance}`
  }
  if (kind === "transfer-summary") return `${firstName ? `Please carefully review, ${firstName}. ` : ""}${transferSummaryScript(preferences.financialDetailsVoice)}`
  if (kind === "bpc-details") return "Review the BPC purchase amount and your account details on screen. Select the payment button only when you are ready, then follow the displayed bank transfer instructions. A submitted receipt may still require review."
  return ""
}
