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
isNonPublicIpv6('fe80::1') // true
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

Returns `true` when `hostname` is in one of these non-public IPv4 ranges:

- `0.0.0.0/8` (this network)
- `10.0.0.0/8` (private)
- `100.64.0.0/10` (shared address space, CGNAT)
- `127.0.0.0/8` (loopback)
- `169.254.0.0/16` (link-local)
- `172.16.0.0/12` (private)
- `192.168.0.0/16` (private)
- `224.0.0.0/4` (multicast)
- `240.0.0.0/4` (reserved)

### isNonPublicIpv6(hostname)

Returns `true` when `hostname` is in one of these non-public IPv6 ranges:

- `::/128` (unspecified)
- `::1` (loopback)
- `fe80::/10` (link-local)
- `fc00::/7` (unique local)

### isNonPublicIp(hostname)

Returns `true` if either `isNonPublicIpv4(hostname)` or `isNonPublicIpv6(hostname)` is `true`.

## Behavior Notes

- Invalid input returns `false`
- Hostnames like `localhost` return `false`
- Whitespace around IPv4 input is treated as invalid
- IPv4-mapped IPv6 addresses (e.g. `::ffff:10.0.0.1`) are recognized and checked against IPv4 ranges

## Links

- [RFC 1918 - Address Allocation for Private Internets](https://datatracker.ietf.org/doc/html/rfc1918#section-3)
- [CVE-2025-8020](https://nvd.nist.gov/vuln/detail/CVE-2025-8020)

## License

[MIT](./LICENSE) License © 2026-PRESENT [ntnyq](https://github.com/ntnyq)
