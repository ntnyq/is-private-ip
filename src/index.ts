/**
 * Parse an IPv4 address string into a 32-bit integer using single-pass
 * character-level parsing. Rejects zero-padded formats like `010.0.0.1`.
 *
 * @param ip - IPv4 address string
 * @returns 32-bit integer representation or `undefined` when invalid
 */
function parseIpv4ToInt(ip: string): number | undefined {
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
      if (segLen > 1 && ip.codePointAt(segStart) === 48) {
        return undefined
      }
      segStart = i + 1
    }
  }
  return (acc << 8) | part
}

/**
 * Parse the first hextet from an IPv6 address string.
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
 * Extract an embedded IPv4 address from an IPv4-mapped IPv6 string
 * (e.g. `::ffff:10.0.0.1`).
 *
 * @param hostname - Hostname in IPv6 format
 * @returns The embedded IPv4 string or `undefined` when not a mapped address
 */
function extractEmbeddedIpv4(hostname: string): string | undefined {
  const normalized = hostname.trim().toLowerCase()
  const match = normalized.match(
    /(?:::ffff:|:)(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/u,
  )
  if (!match) {
    return undefined
  }
  return match[1]
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
function checkPrivateIpv4(hostname: string): boolean {
  const ip = parseIpv4ToInt(hostname)
  if (ip === undefined) {
    return false
  }
  return (
    ip >>> 24 === 10 ||
    (ip >>> 24 === 172 &&
      ((ip >>> 16) & 0xff) >= 16 &&
      ((ip >>> 16) & 0xff) <= 31) ||
    (ip >>> 24 === 192 && ((ip >>> 16) & 0xff) === 168)
  )
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
function checkNonPublicIpv4(hostname: string): boolean {
  const ip = parseIpv4ToInt(hostname)
  if (ip === undefined) {
    return false
  }
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
 * Check whether an IPv6 hostname belongs to unique local ranges.
 *
 * Supported private range:
 * - `fc00::/7` unique local addresses (ULA)
 *
 * @param hostname - Hostname in IPv6 format
 * @returns `true` when host is private IPv6 (ULA)
 */
function checkPrivateIpv6(hostname: string): boolean {
  const ipv4 = extractEmbeddedIpv4(hostname)
  if (ipv4 !== undefined) {
    return checkPrivateIpv4(ipv4)
  }

  const firstHextet = parseIpv6FirstHextet(hostname)
  if (firstHextet === undefined) {
    return false
  }

  return firstHextet >= 0xfc00 && firstHextet <= 0xfdff
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
function checkNonPublicIpv6(hostname: string): boolean {
  const ipv4 = extractEmbeddedIpv4(hostname)
  if (ipv4 !== undefined) {
    return checkNonPublicIpv4(ipv4)
  }

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
  return checkPrivateIpv4(hostname)
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
  return checkPrivateIpv6(hostname)
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
  return checkNonPublicIpv4(hostname)
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
  return checkNonPublicIpv6(hostname)
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
