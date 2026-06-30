import { checkNonPublicIpv4, checkPrivateIpv4 } from './ipv4'
import { checkNonPublicIpv6, checkPrivateIpv6 } from './ipv6'

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
