const CACHE_NAME = "bluepay-voice-guide-v1"
const VOICE_ASSETS = [
  "/audio/voice-guide/about.mp3",
  "/audio/voice-guide/airtime.mp3",
  "/audio/voice-guide/bills.mp3",
  "/audio/voice-guide/budgets.mp3",
  "/audio/voice-guide/buy-bpc.mp3",
  "/audio/voice-guide/create-pin.mp3",
  "/audio/voice-guide/dangote-ipo.mp3",
  "/audio/voice-guide/dashboard.mp3",
  "/audio/voice-guide/data.mp3",
  "/audio/voice-guide/default.mp3",
  "/audio/voice-guide/earn.mp3",
  "/audio/voice-guide/faq.mp3",
  "/audio/voice-guide/farewell.mp3",
  "/audio/voice-guide/features.mp3",
  "/audio/voice-guide/forgot-password.mp3",
  "/audio/voice-guide/get-started.mp3",
  "/audio/voice-guide/goals.mp3",
  "/audio/voice-guide/home.mp3",
  "/audio/voice-guide/interactions/account-number-entered.mp3",
  "/audio/voice-guide/interactions/bank-selected.mp3",
  "/audio/voice-guide/interactions/bpc-code-focus.mp3",
  "/audio/voice-guide/interactions/bpc-details.mp3",
  "/audio/voice-guide/interactions/recipient-name-entered.mp3",
  "/audio/voice-guide/interactions/transfer-amount-focus.mp3",
  "/audio/voice-guide/interactions/transfer-summary.mp3",
  "/audio/voice-guide/language.mp3",
  "/audio/voice-guide/login.mp3",
  "/audio/voice-guide/notifications.mp3",
  "/audio/voice-guide/onboarding.mp3",
  "/audio/voice-guide/order-atm.mp3",
  "/audio/voice-guide/payment-confirmation.mp3",
  "/audio/voice-guide/payment-methods.mp3",
  "/audio/voice-guide/payment.mp3",
  "/audio/voice-guide/privacy.mp3",
  "/audio/voice-guide/profile.mp3",
  "/audio/voice-guide/reports.mp3",
  "/audio/voice-guide/reviews.mp3",
  "/audio/voice-guide/security-pin.mp3",
  "/audio/voice-guide/security.mp3",
  "/audio/voice-guide/settings.mp3",
  "/audio/voice-guide/spending-breakdown.mp3",
  "/audio/voice-guide/support.mp3",
  "/audio/voice-guide/terms.mp3",
  "/audio/voice-guide/testimonies.mp3",
  "/audio/voice-guide/transaction-details.mp3",
  "/audio/voice-guide/transaction-success.mp3",
  "/audio/voice-guide/transactions.mp3",
  "/audio/voice-guide/verify-account.mp3",
  "/audio/voice-guide/verify-pin.mp3",
  "/audio/voice-guide/watch.mp3",
  "/audio/voice-guide/welcome.mp3",
  "/audio/voice-guide/withdraw.mp3",
  "/audio/voice-guide/withdrawal-confirmation.mp3",
  "/audio/voice-guide/withdrawal-success.mp3",
]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(VOICE_ASSETS))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys
        .filter((key) => key.startsWith("bluepay-voice-guide-") && key !== CACHE_NAME)
        .map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url)
  if (requestUrl.origin !== self.location.origin || !requestUrl.pathname.startsWith("/audio/voice-guide/")) return

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
      if (response.ok) {
        const copy = response.clone()
        void caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy))
      }
      return response
    })),
  )
})
