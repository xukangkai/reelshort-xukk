#!/usr/bin/env node
// Vercel preinstall script: runs pnpm install from repo root to resolve workspace deps
const path = require('path')
const { execSync } = require('child_process')

const subDir = __dirname
const repoRoot = path.resolve(subDir, '..')

console.log('[preinstall] SubDir:', subDir)
console.log('[preinstall] RepoRoot:', repoRoot)

try {
  execSync('pnpm install --shamefully-hoist', {
    cwd: repoRoot,
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: undefined }
  })
  console.log('[preinstall] pnpm install completed from repo root')
} catch (err) {
  console.error('[preinstall] pnpm install failed:', err.message)
  process.exit(1)
}
