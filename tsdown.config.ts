import { defineConfig } from 'tsdown'
import ApiSnapshot from 'tsnapi/rolldown'

export default defineConfig({
  clean: true,
  dts: {
    tsgo: true,
  },
  entry: ['src/index.ts'],
  platform: 'neutral',
  plugins: [ApiSnapshot()],
})
