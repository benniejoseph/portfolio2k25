#!/usr/bin/env npx tsx

import fs from 'node:fs'
import path from 'node:path'
import {
  generateLinkedInDraft,
  type LinkedInDraftLimits,
} from '../src/lib/linkedin-draft'

function loadLocalEnvironment(): void {
  const envPath = path.join(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) return

  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const separator = trimmed.indexOf('=')
    if (separator < 1) continue
    const key = trimmed.slice(0, separator).trim()
    const rawValue = trimmed.slice(separator + 1).trim()
    const value = rawValue.replace(/^(['"])(.*)\1$/u, '$2')
    if (!process.env[key]) process.env[key] = value
  }
}

function optionValue(args: string[], flag: string): string | undefined {
  const index = args.indexOf(flag)
  if (index === -1) return undefined
  const value = args[index + 1]
  if (!value || value.startsWith('--')) throw new Error(`${flag} requires a value`)
  return value
}

function positiveInteger(value: string | undefined, flag: string): number | undefined {
  if (value === undefined) return undefined
  if (!/^\d+$/u.test(value) || Number(value) <= 0) {
    throw new Error(`${flag} requires a positive integer`)
  }
  return Number(value)
}

async function main(): Promise<void> {
  const args = process.argv.slice(2)
  const slug = optionValue(args, '--slug')
  if (!slug) {
    throw new Error('Usage: publish-linkedin.ts --slug <post-slug> [--max-words 180] [--max-characters 2600] [--force]')
  }

  loadLocalEnvironment()
  const limits: Partial<LinkedInDraftLimits> = {
    maxWords: positiveInteger(optionValue(args, '--max-words'), '--max-words'),
    maxCharacters: positiveInteger(optionValue(args, '--max-characters'), '--max-characters'),
  }
  for (const key of Object.keys(limits) as Array<keyof LinkedInDraftLimits>) {
    if (limits[key] === undefined) delete limits[key]
  }

  const result = await generateLinkedInDraft({
    slug,
    force: args.includes('--force'),
    limits,
  })

  console.log('\n' + '─'.repeat(64))
  console.log(`LINKEDIN POST DRAFT — ${result.wordCount}/${result.limits.maxWords} words · ${result.characterCount}/${result.limits.maxCharacters} characters`)
  console.log(`MODEL — ${result.model}`)
  console.log('─'.repeat(64))
  console.log(result.post)
  console.log('─'.repeat(64))
  console.log(`Saved: ${path.relative(process.cwd(), result.draftPath)}\n`)
}

main().catch((error) => {
  console.error(`LinkedIn draft generation failed: ${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
})
