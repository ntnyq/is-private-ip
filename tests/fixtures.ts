// cSpell: disable

// RFC 1918 IPv4 private addresses that should return true for isPrivateIpv4.
export const RFC1918_PRIVATE_IPV4_CASES = [
  '10.0.0.1',
  '10.255.255.255',
  '172.16.0.0',
  '172.20.10.5',
  '172.31.255.255',
  '192.168.0.1',
  '192.168.255.255',
]

// IPv4-mapped IPv6 addresses that should return true for isPrivateIpv6.
export const IPV4_MAPPED_PRIVATE_IPV6_CASES = [
  '::ffff:10.0.0.1',
  '::ffff:172.16.0.1',
  '::ffff:192.168.1.1',
]

// IPv4-mapped IPv6 addresses that should return true for isNonPublicIpv6.
export const IPV4_MAPPED_NON_PUBLIC_IPV6_CASES = [
  '::ffff:10.0.0.1',
  '::ffff:127.0.0.1',
  '::ffff:100.64.0.1',
  '::ffff:169.254.1.1',
  '::ffff:192.168.1.1',
  '::ffff:240.0.0.1',
]

// IPv4 addresses outside RFC 1918 ranges that should return false for isPrivateIpv4.
export const NON_PRIVATE_IPV4_CASES = [
  '0.0.0.0',
  '1.1.1.1',
  '8.8.8.8',
  '11.0.0.1',
  '100.64.0.1',
  '126.255.255.255',
  '127.0.0.1',
  '128.0.0.1',
  '169.254.10.10',
  '169.253.255.255',
  '169.255.0.1',
  '172.15.255.255',
  '172.32.0.1',
  '192.167.255.255',
  '192.169.0.0',
  '203.0.113.10',
]

// Invalid IPv4-like inputs used to verify parser rejection.
export const INVALID_IPV4_CASES = [
  '',
  'localhost',
  '.10.0.0',
  '1.2.3',
  '1.2.3.',
  '1.2.3.4.5',
  '1..3.4',
  '10.0.0.',
  '192.168.1.',
  'a.b.c.d',
  '256.0.0.1',
  '-1.0.0.0',
  ' 10.0.0.1',
  '10.0.0.1 ',
  '01.02.03.04x',
  '010.000.000.001',
  '001.002.003.004',
]

// IPv6 ULA addresses that should return true for isPrivateIpv6.
export const PRIVATE_IPV6_CASES = [
  'fc00::1',
  'fd00::',
  'fd00::8.8.8.8',
  'fd12:3456:789a::1',
  'FCAB::1',
]

// IPv6 addresses that are not private ULA for strict private checks.
export const NON_PRIVATE_IPV6_CASES = [
  '::',
  '::1',
  '2001:db8::192.168.1.1',
  '2001:4860:4860::8888',
  'ff00::1',
  'fec0::1',
  'fe80::1',
  'fe70::1',
]

// Invalid IPv6-like inputs used to verify parser rejection.
export const INVALID_IPV6_CASES = [
  '',
  'localhost',
  '127.0.0.1',
  'fe80',
  'abc:def',
  ':::',
  'fc00:::',
  'fd00:def',
  'fd00:12345::1',
  'fe80::1::2',
  'fe80:12345::1',
]

// Non-public IPv4 ranges expected to return true for isNonPublicIpv4.
export const NON_PUBLIC_IPV4_CASES = [
  '0.0.0.0',
  '0.255.255.255',
  '10.0.0.1',
  '10.255.255.255',
  '100.64.0.0',
  '100.100.0.1',
  '100.127.255.255',
  '127.0.0.1',
  '127.255.255.255',
  '169.254.1.1',
  '169.254.255.255',
  '172.16.0.0',
  '172.20.10.5',
  '172.31.255.255',
  '192.168.0.1',
  '192.168.255.255',
  '224.0.0.1',
  '239.255.255.255',
  '240.0.0.1',
  '255.255.255.255',
]

// Globally routable IPv4 addresses expected to return false for isNonPublicIpv4.
export const PUBLIC_IPV4_CASES = [
  '1.1.1.1',
  '8.8.8.8',
  '11.0.0.1',
  '100.63.255.255',
  '100.128.0.0',
  '126.255.255.255',
  '128.0.0.1',
  '169.253.255.255',
  '169.255.0.1',
  '172.15.255.255',
  '172.32.0.1',
  '192.167.255.255',
  '192.169.0.0',
  '203.0.113.10',
  '223.255.255.255',
]

// Non-public special IPv6 values like unspecified and loopback.
export const NON_PUBLIC_IPV6_SPECIAL_CASES = ['::', '::1', '::1'.toUpperCase()]

// Non-public IPv6 ULA values expected to return true for isNonPublicIpv6.
export const NON_PUBLIC_IPV6_ULA_CASES = [
  'fc00::1',
  'fd00::',
  'fd00::8.8.8.8',
  'fd12:3456:789a::1',
  'FCAB::1',
]

// Non-public IPv6 link-local values expected to return true for isNonPublicIpv6.
export const NON_PUBLIC_IPV6_LINK_LOCAL_CASES = [
  'fe80::1',
  'fe80::8.8.8.8',
  'fe90::1',
  'fea0::1',
  'febf::abcd',
]

// IPv6 values that should be rejected by non-public IPv6 checks.
export const PUBLIC_OR_UNSUPPORTED_IPV6_CASES = [
  '2001:db8::192.168.1.1',
  '2001:4860:4860::8888',
  'ff00::1',
  'fec0::1',
  'fe70::1',
  'febg::1',
]

// Inputs expected to return true for the strict private aggregate API.
export const PRIVATE_IP_TRUE_CASES = [
  '10.0.0.1',
  '172.16.0.1',
  '192.168.1.10',
  'fd00::1',
]

// Inputs expected to return false for the strict private aggregate API.
export const PRIVATE_IP_FALSE_CASES = [
  '0.0.0.0',
  '127.0.0.1',
  '169.254.1.1',
  '100.64.0.1',
  '::',
  '::1',
  'fe80::1',
  '8.8.8.8',
  '203.0.113.20',
  '2001:4860:4860::8888',
  'example.com',
  '',
]

// Inputs expected to return true for the non-public aggregate API.
export const NON_PUBLIC_IP_TRUE_CASES = [
  '0.0.0.0',
  '10.0.0.1',
  '100.64.0.1',
  '127.0.0.1',
  '169.254.1.1',
  '172.16.0.1',
  '192.168.1.10',
  '240.0.0.1',
  '::',
  '::1',
  'fd00::1',
  'fe80::1',
]

// Inputs expected to return false for the non-public aggregate API.
export const NON_PUBLIC_IP_FALSE_CASES = [
  '8.8.8.8',
  '203.0.113.20',
  '2001:4860:4860::8888',
  'example.com',
  '',
]
