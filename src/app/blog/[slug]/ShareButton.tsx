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
      className="terminal-cmd ml-auto"
      style={{ fontSize: '9px', padding: '5px 12px' }}
    >
      <FiShare2 size={10} />
      {copied ? 'URL_COPIED' : 'SHARE_POST'}
    </button>
  )
}
