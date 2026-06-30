/**
 * Prefix rule for matching an IPv4 address against a CIDR range.
 */
export interface Ipv4PrefixRule {
  /**
   * IPv4 CIDR base address encoded as a 32-bit integer.
   */
  base: number

  /**
   * CIDR prefix length, from 0 to 32.
   */
  prefixLength: number

  /**
   * Whether addresses matched by this rule are considered non-public.
   */
  nonPublic: boolean
}

/**
 * Prefix rule for matching an IPv6 address against a CIDR range.
 */
export interface Ipv6PrefixRule {
  /**
   * IPv6 CIDR base address encoded as a 128-bit integer.
   */
  base: bigint

  /**
   * CIDR prefix length, from 0 to 128.
   */
  prefixLength: number

  /**
   * Whether addresses matched by this rule are considered non-public.
   */
  nonPublic: boolean
}

/**
 * Parsed IPv6 address represented as eight 16-bit hextets.
 */
export interface ParsedIpv6Address {
  /**
   * IPv6 address parts in network byte order.
   */
  hextets: number[]
}
