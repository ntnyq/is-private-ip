import type { Ipv4PrefixRule, Ipv6PrefixRule } from './types'

/**
 * IPv4 special-purpose prefix rules used by `isNonPublicIpv4`.
 *
 * The table is resolved by longest-prefix match. Rules with `nonPublic: false`
 * represent globally reachable exceptions inside broader special-purpose
 * ranges.
 */
export const IPV4_NON_PUBLIC_PREFIX_RULES: readonly Ipv4PrefixRule[] = [
  { base: 0x00000000, prefixLength: 8, nonPublic: true },
  { base: 0x0a000000, prefixLength: 8, nonPublic: true },
  { base: 0x64400000, prefixLength: 10, nonPublic: true },
  { base: 0x7f000000, prefixLength: 8, nonPublic: true },
  { base: 0xa9fe0000, prefixLength: 16, nonPublic: true },
  { base: 0xac100000, prefixLength: 12, nonPublic: true },
  { base: 0xc0000000, prefixLength: 24, nonPublic: true },
  { base: 0xc0000009, prefixLength: 32, nonPublic: false },
  { base: 0xc000000a, prefixLength: 32, nonPublic: false },
  { base: 0xc0000200, prefixLength: 24, nonPublic: true },
  { base: 0xc0586302, prefixLength: 32, nonPublic: true },
  { base: 0xc0a80000, prefixLength: 16, nonPublic: true },
  { base: 0xc6120000, prefixLength: 15, nonPublic: true },
  { base: 0xc6336400, prefixLength: 24, nonPublic: true },
  { base: 0xcb007100, prefixLength: 24, nonPublic: true },
  { base: 0xe0000000, prefixLength: 4, nonPublic: true },
  { base: 0xf0000000, prefixLength: 4, nonPublic: true },
]

/**
 * IPv6 special-purpose prefix rules used by `isNonPublicIpv6`.
 *
 * Base values are stored as 128-bit integers. The table is resolved by
 * longest-prefix match, so more specific globally reachable exceptions can
 * override broader non-public ranges.
 */
export const IPV6_NON_PUBLIC_PREFIX_RULES: readonly Ipv6PrefixRule[] = [
  { base: 0x0n, prefixLength: 128, nonPublic: true },
  { base: 0x1n, prefixLength: 128, nonPublic: true },
  {
    base: 0x00000000000000000000ffff00000000n,
    prefixLength: 96,
    nonPublic: true,
  },
  {
    base: 0x0064ff9b000100000000000000000000n,
    prefixLength: 48,
    nonPublic: true,
  },
  {
    base: 0x01000000000000000000000000000000n,
    prefixLength: 64,
    nonPublic: true,
  },
  {
    base: 0x01000000000000010000000000000000n,
    prefixLength: 64,
    nonPublic: true,
  },
  {
    base: 0x20010000000000000000000000000000n,
    prefixLength: 23,
    nonPublic: true,
  },
  {
    base: 0x20010001000000000000000000000001n,
    prefixLength: 128,
    nonPublic: false,
  },
  {
    base: 0x20010001000000000000000000000002n,
    prefixLength: 128,
    nonPublic: false,
  },
  {
    base: 0x20010001000000000000000000000003n,
    prefixLength: 128,
    nonPublic: false,
  },
  {
    base: 0x20010003000000000000000000000000n,
    prefixLength: 32,
    nonPublic: false,
  },
  {
    base: 0x20010004011200000000000000000000n,
    prefixLength: 48,
    nonPublic: false,
  },
  {
    base: 0x20010020000000000000000000000000n,
    prefixLength: 28,
    nonPublic: false,
  },
  {
    base: 0x20010030000000000000000000000000n,
    prefixLength: 28,
    nonPublic: false,
  },
  {
    base: 0x20020000000000000000000000000000n,
    prefixLength: 16,
    nonPublic: true,
  },
  {
    base: 0x20010db8000000000000000000000000n,
    prefixLength: 32,
    nonPublic: true,
  },
  {
    base: 0x3fff0000000000000000000000000000n,
    prefixLength: 20,
    nonPublic: true,
  },
  {
    base: 0x5f000000000000000000000000000000n,
    prefixLength: 16,
    nonPublic: true,
  },
  {
    base: 0xfc000000000000000000000000000000n,
    prefixLength: 7,
    nonPublic: true,
  },
  {
    base: 0xfe800000000000000000000000000000n,
    prefixLength: 10,
    nonPublic: true,
  },
  {
    base: 0xff000000000000000000000000000000n,
    prefixLength: 8,
    nonPublic: true,
  },
]
