import { IPV6_NON_PUBLIC_PREFIX_RULES } from './constants'
import { checkPrivateIpv4Int, parseIpv4ToInt } from './ipv4'
import type { ParsedIpv6Address } from './types'

/**
 * Convert eight IPv6 hextets into a 128-bit integer.
 *
 * @param hextets - Parsed IPv6 hextets
 * @returns 128-bit integer representation
 */
function ipv6ToBigInt(hextets: number[]): bigint {
  let value = 0n

  for (const hextet of hextets) {
    value = (value << 16n) | BigInt(hextet)
  }

  return value
}

/**
 * Check whether an IPv6 integer is within a CIDR prefix.
 *
 * @param ip - IPv6 address integer
 * @param base - CIDR base address integer
 * @param prefixLength - CIDR prefix length
 * @returns `true` when `ip` is inside the prefix
 */
function matchesIpv6Prefix(
  ip: bigint,
  base: bigint,
  prefixLength: number,
): boolean {
  const shift = 128n - BigInt(prefixLength)
  return ip >> shift === base >> shift
}

/**
 * Resolve non-public IPv6 status with longest-prefix matching.
 *
 * @param hextets - Parsed IPv6 hextets
 * @returns `true` when host is non-public IPv6
 */
function isNonPublicIpv6ByPrefixRules(hextets: number[]): boolean {
  const ip = ipv6ToBigInt(hextets)
  let matchedPrefixLength = -1
  let matchedNonPublic = false

  for (const rule of IPV6_NON_PUBLIC_PREFIX_RULES) {
    if (
      rule.prefixLength > matchedPrefixLength &&
      matchesIpv6Prefix(ip, rule.base, rule.prefixLength)
    ) {
      matchedPrefixLength = rule.prefixLength
      matchedNonPublic = rule.nonPublic
    }
  }

  return matchedNonPublic
}

/**
 * Parse an IPv6 segment list into one or more 16-bit hextets.
 *
 * @param segments - IPv6 segments split on `:`
 * @param allowIpv4Tail - Whether the final segment may be dotted IPv4 notation
 * @returns Parsed hextets or `undefined` when invalid
 */
function parseIpv6Segments(
  segments: string[],
  allowIpv4Tail: boolean,
): number[] | undefined {
  const hextets: number[] = []

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]

    if (segment === undefined || segment === '') {
      return undefined
    }

    if (segment.includes('.')) {
      if (!allowIpv4Tail || i !== segments.length - 1) {
        return undefined
      }

      const ipv4 = parseIpv4ToInt(segment)
      if (ipv4 === undefined) {
        return undefined
      }

      hextets.push((ipv4 >>> 16) & 0xffff, ipv4 & 0xffff)
    } else if (/^[0-9a-f]{1,4}$/u.test(segment)) {
      hextets.push(Number.parseInt(segment, 16))
    } else {
      return undefined
    }
  }

  return hextets
}

/**
 * Parse an IPv6 address string into eight 16-bit hextets.
 *
 * Supports full, compressed, and dotted-IPv4-tail RFC 4291 text forms.
 *
 * @param hostname - Hostname in IPv6 format
 * @returns Parsed IPv6 address or `undefined` when invalid
 */
function parseIpv6Address(hostname: string): ParsedIpv6Address | undefined {
  const normalized = hostname.trim().toLowerCase()
  if (!normalized.includes(':') || normalized.includes('%')) {
    return undefined
  }

  const compressionIndex = normalized.indexOf('::')
  if (
    compressionIndex !== -1 &&
    normalized.includes('::', compressionIndex + 2)
  ) {
    return undefined
  }

  if (compressionIndex === -1) {
    const hextets = parseIpv6Segments(normalized.split(':'), true)
    if (hextets === undefined || hextets.length !== 8) {
      return undefined
    }

    return { hextets }
  }

  const headRaw = normalized.slice(0, compressionIndex)
  const tailRaw = normalized.slice(compressionIndex + 2)
  const head =
    headRaw === '' ? [] : parseIpv6Segments(headRaw.split(':'), false)
  const tail = tailRaw === '' ? [] : parseIpv6Segments(tailRaw.split(':'), true)

  if (head === undefined || tail === undefined) {
    return undefined
  }

  const zeros = 8 - head.length - tail.length
  if (zeros <= 0) {
    return undefined
  }

  return {
    hextets: [...head, ...Array.from({ length: zeros }, () => 0), ...tail],
  }
}

/**
 * Check whether parsed IPv6 is an IPv4-mapped address (`::ffff:0:0/96`).
 *
 * @param hextets - Parsed IPv6 hextets
 * @returns `true` when address is IPv4-mapped
 */
function isIpv4MappedIpv6(hextets: number[]): boolean {
  return (
    hextets[0] === 0 &&
    hextets[1] === 0 &&
    hextets[2] === 0 &&
    hextets[3] === 0 &&
    hextets[4] === 0 &&
    hextets[5] === 0xffff
  )
}

/**
 * Convert the final 32 bits of an IPv6 address to an IPv4 integer.
 *
 * @param hextets - Parsed IPv6 hextets
 * @returns IPv4 integer from the final two hextets
 */
function ipv4FromIpv6Tail(hextets: number[]): number {
  const high = hextets[6] ?? 0
  const low = hextets[7] ?? 0
  return high * 0x10000 + low
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
export function checkPrivateIpv6(hostname: string): boolean {
  const parsed = parseIpv6Address(hostname)
  if (parsed === undefined) {
    return false
  }

  if (isIpv4MappedIpv6(parsed.hextets)) {
    return checkPrivateIpv4Int(ipv4FromIpv6Tail(parsed.hextets))
  }

  const firstHextet = parsed.hextets[0] ?? 0
  return firstHextet >= 0xfc00 && firstHextet <= 0xfdff
}

/**
 * Check whether an IPv6 hostname belongs to non-public ranges.
 *
 * Uses longest-prefix matching over IPv6 special-purpose ranges that are not
 * globally reachable, plus multicast ranges.
 *
 * @param hostname - Hostname in IPv6 format
 * @returns `true` when host is non-public IPv6
 */
export function checkNonPublicIpv6(hostname: string): boolean {
  const parsed = parseIpv6Address(hostname)
  if (parsed === undefined) {
    return false
  }

  return isNonPublicIpv6ByPrefixRules(parsed.hextets)
}
