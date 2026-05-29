import { bench, describe } from 'vitest'
import {
  isNonPublicIp,
  isNonPublicIpv4,
  isNonPublicIpv6,
  isPrivateIp,
  isPrivateIpv4,
  isPrivateIpv6,
} from '../src'

describe('isPrivateIpv4', () => {
  bench('ipv4 private', () => {
    isPrivateIpv4('10.0.0.1')
  })
})

describe('isPrivateIpv6', () => {
  bench('ipv6 ULA', () => {
    isPrivateIpv6('fd00::1')
  })
  bench('ipv4-mapped private', () => {
    isPrivateIpv6('::ffff:10.0.0.1')
  })
})

describe('isNonPublicIpv4', () => {
  bench('ipv4 non-public', () => {
    isNonPublicIpv4('127.0.0.1')
  })
})

describe('isNonPublicIpv6', () => {
  bench('ipv6 loopback', () => {
    isNonPublicIpv6('::1')
  })
  bench('ipv4-mapped non-public', () => {
    isNonPublicIpv6('::ffff:192.168.1.1')
  })
})

describe('isPrivateIp', () => {
  bench('ipv4 private', () => {
    isPrivateIp('10.0.0.1')
  })
  bench('ipv6 private', () => {
    isPrivateIp('fd00::1')
  })
})

describe('isNonPublicIp', () => {
  bench('ipv4 loopback', () => {
    isNonPublicIp('127.0.0.1')
  })
  bench('ipv6 loopback', () => {
    isNonPublicIp('::1')
  })
})
