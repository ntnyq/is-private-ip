import { describe, expect, it } from 'vitest'
import {
  isNonPublicIp,
  isNonPublicIpv4,
  isNonPublicIpv6,
  isPrivateIp,
  isPrivateIpv4,
  isPrivateIpv6,
} from '../src'
import {
  INVALID_IPV4_CASES,
  INVALID_IPV6_CASES,
  IPV4_MAPPED_NON_PUBLIC_IPV6_CASES,
  IPV4_MAPPED_PRIVATE_IPV6_CASES,
  NON_PRIVATE_IPV4_CASES,
  NON_PRIVATE_IPV6_CASES,
  NON_PUBLIC_IP_FALSE_CASES,
  NON_PUBLIC_IP_TRUE_CASES,
  NON_PUBLIC_IPV4_CASES,
  NON_PUBLIC_IPV6_IANA_SPECIAL_CASES,
  NON_PUBLIC_IPV6_LINK_LOCAL_CASES,
  NON_PUBLIC_IPV6_SPECIAL_CASES,
  NON_PUBLIC_IPV6_ULA_CASES,
  PRIVATE_IP_FALSE_CASES,
  PRIVATE_IP_TRUE_CASES,
  PRIVATE_IPV6_CASES,
  PUBLIC_IPV4_CASES,
  PUBLIC_OR_UNSUPPORTED_IPV6_CASES,
  RFC1918_PRIVATE_IPV4_CASES,
} from './fixtures'

describe(isPrivateIpv4, () => {
  it.each(RFC1918_PRIVATE_IPV4_CASES)(
    'returns true for RFC 1918 private IPv4 ranges: %s',
    ip => {
      expect(isPrivateIpv4(ip)).toBe(true)
    },
  )

  it.each(NON_PRIVATE_IPV4_CASES)(
    'returns false for non-private IPv4 addresses: %s',
    ip => {
      expect(isPrivateIpv4(ip)).toBe(false)
    },
  )

  it.each(INVALID_IPV4_CASES)(
    'returns false for invalid IPv4 inputs: %s',
    ip => {
      expect(isPrivateIpv4(ip)).toBe(false)
    },
  )
})

describe(isPrivateIpv6, () => {
  it.each(PRIVATE_IPV6_CASES)(
    'returns true for unique local addresses (fc00::/7): %s',
    ip => {
      expect(isPrivateIpv6(ip)).toBe(true)
    },
  )

  it.each(IPV4_MAPPED_PRIVATE_IPV6_CASES)(
    'returns true for IPv4-mapped private addresses: %s',
    ip => {
      expect(isPrivateIpv6(ip)).toBe(true)
    },
  )

  it.each(NON_PRIVATE_IPV6_CASES)(
    'returns false for global or unsupported IPv6 addresses: %s',
    ip => {
      expect(isPrivateIpv6(ip)).toBe(false)
    },
  )

  it.each(INVALID_IPV6_CASES)(
    'returns false for invalid IPv6-like inputs: %s',
    ip => {
      expect(isPrivateIpv6(ip)).toBe(false)
    },
  )
})

describe(isNonPublicIpv4, () => {
  it.each(NON_PUBLIC_IPV4_CASES)(
    'returns true for known non-public IPv4 ranges: %s',
    ip => {
      expect(isNonPublicIpv4(ip)).toBe(true)
    },
  )

  it.each(PUBLIC_IPV4_CASES)(
    'returns false for public IPv4 addresses: %s',
    ip => {
      expect(isNonPublicIpv4(ip)).toBe(false)
    },
  )

  it.each(INVALID_IPV4_CASES)(
    'returns false for invalid IPv4 inputs: %s',
    ip => {
      expect(isNonPublicIpv4(ip)).toBe(false)
    },
  )
})

describe(isNonPublicIpv6, () => {
  it.each(NON_PUBLIC_IPV6_SPECIAL_CASES)(
    'returns true for unspecified and loopback addresses: %s',
    ip => {
      expect(isNonPublicIpv6(ip)).toBe(true)
    },
  )

  it.each(NON_PUBLIC_IPV6_IANA_SPECIAL_CASES)(
    'returns true for IANA special-purpose IPv6 ranges that are not globally reachable: %s',
    ip => {
      expect(isNonPublicIpv6(ip)).toBe(true)
    },
  )

  it.each(NON_PUBLIC_IPV6_ULA_CASES)(
    'returns true for unique local addresses (fc00::/7): %s',
    ip => {
      expect(isNonPublicIpv6(ip)).toBe(true)
    },
  )

  it.each(NON_PUBLIC_IPV6_LINK_LOCAL_CASES)(
    'returns true for link-local addresses (fe80::/10): %s',
    ip => {
      expect(isNonPublicIpv6(ip)).toBe(true)
    },
  )

  it.each(IPV4_MAPPED_NON_PUBLIC_IPV6_CASES)(
    'returns true for IPv4-mapped non-public addresses: %s',
    ip => {
      expect(isNonPublicIpv6(ip)).toBe(true)
    },
  )

  it.each(PUBLIC_OR_UNSUPPORTED_IPV6_CASES)(
    'returns false for global or unsupported IPv6 addresses: %s',
    ip => {
      expect(isNonPublicIpv6(ip)).toBe(false)
    },
  )

  it.each(INVALID_IPV6_CASES)(
    'returns false for invalid IPv6-like inputs: %s',
    ip => {
      expect(isNonPublicIpv6(ip)).toBe(false)
    },
  )
})

describe(isPrivateIp, () => {
  it.each(PRIVATE_IP_TRUE_CASES)(
    'delegates correctly for strict private IPv4 and IPv6: %s',
    ip => {
      expect(isPrivateIp(ip)).toBe(true)
    },
  )

  it.each(PRIVATE_IP_FALSE_CASES)(
    'returns false for non-private, invalid, and hostnames: %s',
    ip => {
      expect(isPrivateIp(ip)).toBe(false)
    },
  )
})

describe(isNonPublicIp, () => {
  it.each(NON_PUBLIC_IP_TRUE_CASES)(
    'delegates correctly for non-public IPv4 and IPv6: %s',
    ip => {
      expect(isNonPublicIp(ip)).toBe(true)
    },
  )

  it.each(NON_PUBLIC_IP_FALSE_CASES)(
    'returns false for globally routable or invalid addresses: %s',
    ip => {
      expect(isNonPublicIp(ip)).toBe(false)
    },
  )
})
