#!/usr/bin/env node
const fs = require('node:fs')
const path = require('node:path')

const ROOT = process.cwd()
const SRC = path.join(ROOT, 'src')

const MAP = new Map([
  ['@medusajs/ui', '@platform/ui'],
  ['@medusajs/icons', '@platform/icons'],
  ['@medusajs/types', '@platform/types'],
  ['@medusajs/utils', '@platform/utils'],
  ['@medusajs/js-sdk', '@platform/js-sdk'],
  ['@medusajs/framework/types', '@platform/framework/types'],
  ['@medusajs/framework/utils', '@platform/framework/utils'],
  ['@medusajs/framework/modules-sdk', '@platform/framework/modules-sdk'],
  ['@medusajs/framework/orchestration', '@platform/framework/orchestration'],
  ['@medusajs/framework/workflows-sdk', '@platform/framework/workflows-sdk'],
])

function walk(dir, out=[]) {
  let entries
  try { entries = fs.readdirSync(dir, { withFileTypes: true }) } catch { return out }
  for (const e of entries) {
    if (e.name === 'node_modules' || e.name === '.next' || e.name === 'dist' || e.name === 'build') continue
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, out)
    else if (/\.(ts|tsx|js|jsx)$/.test(e.name)) out.push(p)
  }
  return out
}

function transform(content) {
  let changed = false
  let text = content
  for (const [from, to] of MAP.entries()) {
    if (text.includes(from)) {
      const re = new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
      text = text.replace(re, to)
      changed = true
    }
  }
  // Also replace comment mentions of @medusajs/medusa
  text = text.replace(/`@medusajs\/medusa`/g, '`medusa-legacy`')
  return { text, changed }
}

const files = walk(SRC)
let count = 0
for (const f of files) {
  const orig = fs.readFileSync(f, 'utf8')
  const { text, changed } = transform(orig)
  if (changed) {
    fs.writeFileSync(f, text, 'utf8')
    count++
  }
}

console.log(`Rewrote imports in ${count} files.`)
