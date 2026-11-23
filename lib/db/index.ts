import { Pool } from "pg"
import { drizzle } from "drizzle-orm/node-postgres"
import { schema } from "@/lib/db/schema"

const globalForDatabase = globalThis as typeof globalThis & { bluepayPool?: Pool }

function createPool() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) throw new Error("DATABASE_URL is required for database access")

  const databaseUrl = new URL(connectionString)
  const sslMode = databaseUrl.searchParams.get("sslmode")
  if (["prefer", "require", "verify-ca"].includes(sslMode ?? "")) {
    databaseUrl.searchParams.set("sslmode", "verify-full")
  }

  return new Pool({ connectionString: databaseUrl.toString(), max: 10, idleTimeoutMillis: 30_000 })
}

export const pool = globalForDatabase.bluepayPool ?? createPool()

if (process.env.NODE_ENV !== "production") globalForDatabase.bluepayPool = pool

export const db = drizzle(pool, { schema })
