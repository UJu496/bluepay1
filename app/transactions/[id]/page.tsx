import type { Metadata } from "next"
import { TransactionDetails } from "@/components/transactions/transaction-details"

export const metadata: Metadata = {
  title: "Transaction Details | BLUEPAY MOBILE",
  description: "View the receipt and saved details for a BLUEPAY transaction.",
}

type PageParams = Promise<{ id: string }>
type PageSearchParams = Promise<{ returnTo?: string | string[] }>

export default async function TransactionDetailsPage({
  params,
  searchParams,
}: {
  params: PageParams
  searchParams: PageSearchParams
}) {
  const [{ id }, query] = await Promise.all([params, searchParams])
  const requestedReturn = Array.isArray(query.returnTo) ? query.returnTo[0] : query.returnTo
  const returnTo = requestedReturn === "/transactions" || requestedReturn?.startsWith("/transactions?")
    ? requestedReturn
    : null

  return <TransactionDetails id={id} returnTo={returnTo} />
}
