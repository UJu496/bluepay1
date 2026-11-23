import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto"

export const PIN_VERIFIED_COOKIE = "bluepay_pin_verified"

const SCRYPT_COST = 32_768
const SCRYPT_BLOCK_SIZE = 8
const SCRYPT_PARALLELIZATION = 1
const SCRYPT_KEY_LENGTH = 64
const SCRYPT_OPTIONS = {
  N: SCRYPT_COST,
  r: SCRYPT_BLOCK_SIZE,
  p: SCRYPT_PARALLELIZATION,
  maxmem: 64 * 1024 * 1024,
}

function getSecret() {
  const secret = process.env.BETTER_AUTH_SECRET
  if (!secret) throw new Error("BETTER_AUTH_SECRET is required for PIN security")
  return secret
}

function derivePinKey(pin: string, salt: Buffer) {
  return new Promise<Buffer>((resolve, reject) => {
    scryptCallback(pin, salt, SCRYPT_KEY_LENGTH, SCRYPT_OPTIONS, (error, key) => {
      if (error) reject(error)
      else resolve(key as Buffer)
    })
  })
}

export async function hashPin(pin: string) {
  if (!/^\d{4}$/.test(pin)) throw new Error("A BLUEPAY PIN must contain exactly four digits")
  const salt = randomBytes(16)
  const derivedKey = await derivePinKey(pin, salt)
  return `scrypt$${SCRYPT_COST}$${SCRYPT_BLOCK_SIZE}$${SCRYPT_PARALLELIZATION}$${salt.toString("base64url")}$${derivedKey.toString("base64url")}`
}

export async function verifyPin(pin: string, storedHash: string) {
  if (!/^\d{4}$/.test(pin)) return false
  const [algorithm, cost, blockSize, parallelization, encodedSalt, encodedKey] = storedHash.split("$")
  if (
    algorithm !== "scrypt" ||
    cost !== String(SCRYPT_COST) ||
    blockSize !== String(SCRYPT_BLOCK_SIZE) ||
    parallelization !== String(SCRYPT_PARALLELIZATION) ||
    !encodedSalt ||
    !encodedKey
  ) {
    return false
  }

  try {
    const expected = Buffer.from(encodedKey, "base64url")
    const actual = await derivePinKey(pin, Buffer.from(encodedSalt, "base64url"))
    return expected.length === actual.length && timingSafeEqual(expected, actual)
  } catch {
    return false
  }
}

export function hashSecurityToken(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("hex")
}

export function createPinProof(sessionToken: string) {
  return hashSecurityToken(`bluepay-pin-verified:${sessionToken}`)
}

export function verifyPinProof(sessionToken: string, proof: string | undefined) {
  if (!proof) return false
  const expected = Buffer.from(createPinProof(sessionToken))
  const actual = Buffer.from(proof)
  return expected.length === actual.length && timingSafeEqual(expected, actual)
}

export function normalizeFullName(value: string) {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase("en-US")
}

export function isSameOriginRequest(request: Request) {
  const origin = request.headers.get("origin")
  if (!origin) return false

  const host = request.headers.get("host")?.trim() || request.headers.get("x-forwarded-host")?.split(",")[0]?.trim()
  const forwardedProtocol = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim()
  const protocol = forwardedProtocol || new URL(request.url).protocol.replace(":", "")
  const expectedOrigin = host ? `${protocol}://${host}` : new URL(request.url).origin

  return origin === expectedOrigin
}

export function getRequestIp(request: Request) {
  const realIp = request.headers.get("x-real-ip")?.trim()
  if (realIp) return realIp
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
}
