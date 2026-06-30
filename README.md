# is-private-ip

[![CI](https://github.com/ntnyq/is-private-ip/workflows/CI/badge.svg)](https://github.com/ntnyq/is-private-ip/actions)
[![NPM VERSION](https://img.shields.io/npm/v/is-private-ip.svg)](https://www.npmjs.com/package/is-private-ip)
[![NPM DOWNLOADS](https://img.shields.io/npm/dy/is-private-ip.svg)](https://www.npmjs.com/package/is-private-ip)
[![LICENSE](https://img.shields.io/github/license/ntnyq/is-private-ip.svg)](https://github.com/ntnyq/is-private-ip/blob/main/LICENSE)

Tiny utility to detect whether an IP address is private or non-public.

- Supports strict private IPv4/IPv6 checks
- Supports broader non-public IPv4/IPv6 checks
- Works in Node.js and modern bundlers (ESM)

## Install

```shell
npm install is-private-ip
```

```shell
yarn add is-private-ip
```

```shell
pnpm add is-private-ip
```

## Usage

```ts
import {
  isNonPublicIp,
  isNonPublicIpv4,
  isNonPublicIpv6,
  isPrivateIp,
  isPrivateIpv4,
  isPrivateIpv6,
} from 'is-private-ip'

isPrivateIp('192.168.1.1') // true
isPrivateIpv4('127.0.0.1') // false
isPrivateIpv4('8.8.8.8') // false
isPrivateIpv6('fd12:3456:789a::1') // true
isNonPublicIpv4('100.64.10.10') // true
isNonPublicIpv4('203.0.113.10') // true
isNonPublicIpv6('fe80::1') // true
isNonPublicIpv6('2001:db8::1') // true
isNonPublicIp('::') // true
```

## API

### isPrivateIpv4(hostname)

Returns `true` when `hostname` is in RFC 1918 IPv4 private ranges:

- `10.0.0.0/8`
- `172.16.0.0/12`
- `192.168.0.0/16`

### isPrivateIpv6(hostname)

Returns `true` when `hostname` is in IPv6 unique local range:

- `fc00::/7` (unique local)

### isPrivateIp(hostname)

Returns `true` if either `isPrivateIpv4(hostname)` or `isPrivateIpv6(hostname)` is `true`.

### isNonPublicIpv4(hostname)

Returns `true` when `hostname` is in an IPv4 range that should not be treated as globally reachable.

This includes IPv4 special-purpose address blocks whose IANA `Globally Reachable` value is not `True`, plus IPv4 multicast (`224.0.0.0/4`). Prefixes are resolved by longest-prefix match, so globally reachable exceptions such as `192.0.0.9/32` and `192.0.0.10/32` return `false`.

### isNonPublicIpv6(hostname)

Returns `true` when `hostname` is in an IPv6 range that should not be treated as globally reachable.

This includes IPv6 special-purpose address blocks whose IANA `Globally Reachable` value is not `True`, plus IPv6 multicast (`ff00::/8`). Prefixes are resolved by longest-prefix match, so globally reachable exceptions inside broader IANA special-purpose blocks, such as `2001:1::1/128`, return `false`.

### isNonPublicIp(hostname)

Returns `true` if either `isNonPublicIpv4(hostname)` or `isNonPublicIpv6(hostname)` is `true`.

## Behavior Notes

- Invalid input returns `false`
- Hostnames like `localhost` return `false`
- IPv4 input must use strict dotted-decimal notation; empty octets and leading-zero octets are invalid
- IPv6 input is fully validated and may use full, compressed, or dotted-IPv4-tail notation
- IPv6 zone identifiers such as `fe80::1%eth0` are not supported
- `isPrivateIpv6` checks IPv4-mapped IPv6 addresses in `::ffff:0:0/96` against strict IPv4 private ranges
- `isNonPublicIpv6` treats IPv4-mapped IPv6 addresses in `::ffff:0:0/96` as an IPv6 special-purpose range
- Other IPv6 addresses with a dotted IPv4 tail are checked by their IPv6 prefix

## Links

- [RFC 1918 - Address Allocation for Private Internets](https://datatracker.ietf.org/doc/html/rfc1918#section-3)
- [IANA IPv4 Special-Purpose Address Space](https://www.iana.org/assignments/iana-ipv4-special-registry)
- [IANA IPv6 Special-Purpose Address Space](https://www.iana.org/assignments/iana-ipv6-special-registry)
- [CVE-2025-8020](https://nvd.nist.gov/vuln/detail/CVE-2025-8020)

## License

[MIT](./LICENSE) License © 2026-PRESENT [ntnyq](https://github.com/ntnyq)
