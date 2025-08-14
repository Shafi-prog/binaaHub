#!/usr/bin/env node
/**
 * Scan for Medusa imports and print a report.
 * Usage:
 *  - node scripts/scan-medusa-imports.js        (stdout)
 *  - node scripts/scan-medusa-imports.js --md   (markdown table)
 */

const path = require('node:path')
const fs = require('node:fs')

function walk(dir, results = []) {
  let entries
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true })
  } catch {
    return results
  }
  for (const e of entries) {
    if (e.name === 'node_modules' || e.name === '.next' || e.name === 'dist' || e.name === 'build') continue
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, results)
    else if (/\.(ts|tsx|js|jsx)$/.test(e.name)) results.push(p)
  }
  return results
}

function main() {
  const root = process.cwd()
  const base = path.join(root, 'src')
  const patterns = [ '@medusajs/', 'medusa-integration' ]

  const files = walk(base)
  const rows = []
  for (const abs of files) {
    const file = path.relative(root, abs)
    let content = ''
    try { content = fs.readFileSync(abs, 'utf8') } catch { continue }
    const lines = content.split(/\r?\n/)
    lines.forEach((line, idx) => {
      if (patterns.some(p => line.includes(p))) {
        // Extract module if present
        const m = line.match(/@medusajs\/[A-Za-z0-9_\/-]*/)
        const mod = m ? m[0] : ''
        rows.push({ file, line: idx + 1, text: line.trim(), mod })
      }
    })
  }

  const byRoot = new Map()
  const byModule = new Map()
  const filesSet = new Set()
  for (const r of rows) {
    filesSet.add(r.file)
    if (r.mod) {
      const parts = r.mod.split('/')
      const rootPkg = parts.length > 1 ? `@medusajs/${parts[1]}` : r.mod
      byRoot.set(rootPkg, (byRoot.get(rootPkg) || 0) + 1)
      byModule.set(r.mod, (byModule.get(r.mod) || 0) + 1)
    }
  }

  const isMd = process.argv.includes('--md')
  if (isMd) {
    console.log('# Medusa imports report')
    console.log('')
    console.log(`Total files with Medusa refs: ${filesSet.size}`)
    console.log('')
    console.log('## By root package')
    console.log('')
    console.log('| Package | Occurrences |')
    console.log('|---------|-------------|')
    for (const [pkg, count] of Array.from(byRoot.entries()).sort((a,b)=>b[1]-a[1])) {
      console.log(`| ${pkg} | ${count} |`)
    }
    console.log('')
    console.log('## Top modules')
    console.log('')
    console.log('| Module | Occurrences |')
    console.log('|--------|-------------|')
    for (const [mod, count] of Array.from(byModule.entries()).sort((a,b)=>b[1]-a[1]).slice(0,30)) {
      console.log(`| ${mod} | ${count} |`)
    }
    console.log('')
    console.log('## Lines')
    console.log('')
    console.log('| File | Line | Snippet |')
    console.log('|------|------|---------|')
    for (const r of rows) {
      const snippet = r.text.replace(/\|/g, '\\|')
      console.log(`| ${r.file} | ${r.line} | ${snippet} |`)
    }
  } else {
    console.log(`FILES ${filesSet.size}`)
    console.log('BY_ROOT', Object.fromEntries(Array.from(byRoot.entries()).sort((a,b)=>b[1]-a[1])))
    console.log('TOP_MODULES', Array.from(byModule.entries()).sort((a,b)=>b[1]-a[1]).slice(0,30))
  }

  // Exit non-zero if any non-allowed occurrences exist (basic heuristic)
  const allowed = new Set([
    'src/core/shared/services/medusa-integration.ts',
  ])
  const violations = rows.filter(r => !allowed.has(r.file) && !/\/types\//.test(r.file))
  if (violations.length) {
    process.exitCode = 2
  }
}

main()
