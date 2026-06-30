/**
 * Parse an IPv4 address string into a 32-bit integer using single-pass
 * character-level parsing. Rejects zero-padded formats like `010.0.0.1`.
 *
 * @param ip - IPv4 address string
 * @returns 32-bit integer representation or `undefined` when invalid
 */
export function parseIpv4ToInt(ip: string): number | undefined {
  let acc = 0,
    dots = 0,
    part = 0
  for (let i = 0; i < ip.length; i++) {
    const c = ip.codePointAt(i)
    if (c === undefined) {
      return undefined
    }
    if (c === 46) {
      // '.'
      if (
        part > 255 ||
        (dots < 3 && part === 0 && i > 0 && ip.codePointAt(i - 1) === 46)
      ) {
        return undefined
      }
      acc = (acc << 8) | part
      part = 0
      dots++
    } else if (c >= 48 && c <= 57) {
      part = part * 10 + (c - 48)
    } else {
      return undefined
    }
  }
  if (dots !== 3 || part > 255) {
    return undefined
  }
  // Reject leading zeros (e.g. "010.0.0.1")
  let segStart = 0
  for (let i = 0; i <= ip.length; i++) {
    if (i === ip.length || ip.codePointAt(i) === 46) {
      const segLen = i - segStart
      if (segLen === 0 || (segLen > 1 && ip.codePointAt(segStart) === 48)) {
        return undefined
      }
      segStart = i + 1
    }
  }
  return (acc << 8) | part
}

/**
 * Check whether an IPv4 integer belongs to RFC 1918 private ranges.
 *
 * @param ip - IPv4 address integer
 * @returns `true` when host is private IPv4 (RFC 1918)
 */
export function checkPrivateIpv4Int(ip: number): boolean {
  return (
    ip >>> 24 === 10 ||
    (ip >>> 24 === 172 &&
      ((ip >>> 16) & 0xff) >= 16 &&
      ((ip >>> 16) & 0xff) <= 31) ||
    (ip >>> 24 === 192 && ((ip >>> 16) & 0xff) === 168)
  )
}

/**
 * Check whether an IPv4 integer belongs to non-public ranges.
 *
 * @param ip - IPv4 address integer
 * @returns `true` when host is non-public IPv4
 */
export function checkNonPublicIpv4Int(ip: number): boolean {
  const a = ip >>> 24
  const b = (ip >>> 16) & 0xff
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
export function checkPrivateIpv4(hostname: string): boolean {
  const ip = parseIpv4ToInt(hostname)
  if (ip === undefined) {
    return false
  }
  return checkPrivateIpv4Int(ip)
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
export function checkNonPublicIpv4(hostname: string): boolean {
  const ip = parseIpv4ToInt(hostname)
  if (ip === undefined) {
    return false
  }
  return checkNonPublicIpv4Int(ip)
}
