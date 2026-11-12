import type { Metadata } from "next"
import { WithdrawalDestinationForm } from "@/components/withdrawal-destination-form"

export const metadata: Metadata = {
  title: "Withdrawal Destination | BLUEPAY MOBILE",
  description: "Choose a bank or mobile money destination in Nigeria, Ghana, or Cameroon. Live payouts are not enabled on this form.",
}

export default function WithdrawPage() {
  return <WithdrawalDestinationForm />
}
