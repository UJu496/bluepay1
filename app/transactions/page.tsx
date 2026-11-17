import type { Metadata } from "next"
import { RecentTransactions } from "@/components/transactions/recent-transactions"
import type { TransactionStatusKey } from "@/lib/transactions"

export const metadata: Metadata = {
  title: "Recent Transactions | BLUEPAY MOBILE",
  description: "Review and manage your BLUEPAY transaction history.",
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>

const supportedStatuses: TransactionStatusKey[] = ["successful", "pending", "failed", "reversed", "completed", "unrecorded", "other"]

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export default async function TransactionsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const typeValue = firstValue(params.type)
  const statusValue = firstValue(params.status)
  const type = typeValue === "income" || typeValue === "expense" ? typeValue : "all"
  const status = supportedStatuses.includes(statusValue as TransactionStatusKey) ? statusValue as TransactionStatusKey : "all"

  return <RecentTransactions initialFilters={{
    query: firstValue(params.q) || "",
    type,
    status,
    from: firstValue(params.from) || "",
    to: firstValue(params.to) || "",
  }} />
}
