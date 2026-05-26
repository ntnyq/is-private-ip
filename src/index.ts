/**
 * Parse a decimal IPv4 segment and ensure it is in the valid range.
 *
 * @param segment - IPv4 segment candidate
 * @returns Parsed segment value or `undefined` when invalid
 */
function parseIpv4Segment(segment: string): number | undefined {
  if (segment.length === 0 || !/^\d+$/u.test(segment)) {
    return undefined
  }

  const value = Number(segment)
  if (!Number.isInteger(value) || value < 0 || value > 255) {
    return undefined
  }

  return value
}

/**
 * Parse the first IPv6 hextet for prefix checks.
 *
 * This performs light validation (hex chars, separators, and first hextet width)
 * and is enough for range checks used by this package.
 *
 * @param hostname - Hostname in IPv6 format
 * @returns First hextet as number or `undefined` when invalid
 */
function parseIpv6FirstHextet(hostname: string): number | undefined {
  const normalized = hostname.trim().toLowerCase()
  if (!normalized.includes(':') || !/^[0-9a-f:]+$/u.test(normalized)) {
    return undefined
  }

  const first = normalized.split(':', 1)[0] ?? ''
  if (first === '') {
    return 0
  }

  if (!/^[0-9a-f]{1,4}$/u.test(first)) {
    return undefined
  }

  return Number.parseInt(first, 16)
}

/**
 * Check whether an IPv4 hostname belongs to RFC 1918 private ranges.
 *
 * Supported private ranges:
 * - `10.0.0.0/8`
 * - `172.16.0.0/12`
 * - `192.168.0.0/16`
 *
 * @param hostname - Hostname in IPv4 format
 * @returns `true` when host is private IPv4 (RFC 1918)
 */
export function isPrivateIpv4(hostname: string): boolean {
  const parts = hostname.split('.')
  if (parts.length !== 4) {
    return false
  }

  const parsed = parts.map(p => parseIpv4Segment(p))
  if (parsed.some(part => part === undefined)) {
    return false
  }

  const [a, b] = parsed as [number, number, number, number]

  return (
    a === 10 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168)
  )
}

/**
 * Check whether an IPv6 hostname belongs to unique local ranges.
 *
 * Supported private range:
 * - `fc00::/7` unique local addresses (ULA)
 *
 * @param hostname - Hostname in IPv6 format
 * @returns `true` when host is private IPv6 (ULA)
 */
export function isPrivateIpv6(hostname: string): boolean {
  const firstHextet = parseIpv6FirstHextet(hostname)
  if (firstHextet === undefined) {
    return false
  }

  return firstHextet >= 0xfc00 && firstHextet <= 0xfdff
}

/**
 * Check whether an IPv4 hostname belongs to non-public ranges.
 *
 * Supported non-public ranges:
 * - `0.0.0.0/8` this network
 * - `10.0.0.0/8` private
 * - `100.64.0.0/10` shared address space (CGNAT)
 * - `127.0.0.0/8` loopback
 * - `169.254.0.0/16` link-local
 * - `172.16.0.0/12` private
 * - `192.168.0.0/16` private
 * - `224.0.0.0/4` multicast
 * - `240.0.0.0/4` reserved
 *
 * @param hostname - Hostname in IPv4 format
 * @returns `true` when host is non-public IPv4
 */
export function isNonPublicIpv4(hostname: string): boolean {
  const parts = hostname.split('.')
  if (parts.length !== 4) {
    return false
  }

  const parsed = parts.map(p => parseIpv4Segment(p))
  if (parsed.some(part => part === undefined)) {
    return false
  }

  const [a, b] = parsed as [number, number, number, number]

  return (
    a === 0 ||
    a === 10 ||
    (a === 100 && b >= 64 && b <= 127) ||
    a === 127 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    a >= 224
  )
}

/**
 * Check whether an IPv6 hostname belongs to non-public ranges.
 *
 * Supported non-public ranges:
 * - `::/128` unspecified
 * - `::1` loopback
 * - `fe80::/10` link-local
 * - `fc00::/7` unique local
 *
 * @param hostname - Hostname in IPv6 format
 * @returns `true` when host is non-public IPv6
 */
export function isNonPublicIpv6(hostname: string): boolean {
  const normalized = hostname.trim().toLowerCase()
  const firstHextet = parseIpv6FirstHextet(normalized)
  if (firstHextet === undefined) {
    return false
  }

  return (
    normalized === '::' ||
    normalized === '::1' ||
    (firstHextet >= 0xfe80 && firstHextet <= 0xfebf) ||
    (firstHextet >= 0xfc00 && firstHextet <= 0xfdff)
  )
}

/**
 * Check whether a hostname is private IPv4 or private IPv6.
 *
 * @param hostname - Hostname in IPv4 or IPv6 format
 * @returns `true` when host is private
 */
export function isPrivateIp(hostname: string): boolean {
  return isPrivateIpv4(hostname) || isPrivateIpv6(hostname)
}

/**
 * Check whether a hostname is non-public IPv4 or non-public IPv6.
 *
 * @param hostname - Hostname in IPv4 or IPv6 format
 * @returns `true` when host is non-public
 */
export function isNonPublicIp(hostname: string): boolean {
  return isNonPublicIpv4(hostname) || isNonPublicIpv6(hostname)
}
