'use client'

import { FiShare2 } from 'react-icons/fi'
import { useState } from 'react'

export default function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      await navigator.share({ title, url })
    } else {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleShare}
      className="ml-auto flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full glass border border-white/10 hover:border-blue-400/30 transition-colors"
    >
      <FiShare2 size={12} />
      {copied ? 'Copied!' : 'Share'}
    </button>
  )
}
