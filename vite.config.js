import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { analyzeListingImage } from './server/ai/geminiListingAssistant.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      nodePolyfills({
        include: ['buffer', 'crypto', 'stream', 'util', 'process'],
        globals: { Buffer: true, global: true, process: true },
      }),
      {
        name: 'gemini-listing-assistant-api',
        configureServer(server) {
          server.middlewares.use('/api/analyze-listing', (req, res, next) => {
            if (req.method !== 'POST') {
              next()
              return
            }

            let rawBody = ''
            req.on('data', (chunk) => {
              rawBody += chunk
            })

            req.on('end', async () => {
              res.setHeader('Content-Type', 'application/json')

              try {
                const body = rawBody ? JSON.parse(rawBody) : {}
                const suggestion = await analyzeListingImage({
                  apiKey: env.GEMINI_API_KEY,
                  mimeType: body.mimeType,
                  imageBase64: body.imageBase64,
                  listedCondition: body.listedCondition,
                })
                res.statusCode = 200
                res.end(JSON.stringify(suggestion))
              } catch (error) {
                res.statusCode = 500
                res.end(JSON.stringify({ error: error?.message || 'Could not analyze image.' }))
              }
            })

            req.on('error', () => {
              res.statusCode = 500
              res.end(JSON.stringify({ error: 'Failed to read request body.' }))
            })
          })
        },
      },
    ],
  }
})
