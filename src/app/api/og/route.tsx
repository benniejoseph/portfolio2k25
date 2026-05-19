import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title') ?? 'Bennie Joseph'
  const tags = (searchParams.get('tags') ?? '').split(',').filter(Boolean)

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0d1117 0%, #161b22 50%, #0d1117 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '60px 70px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Grid lines background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(59,130,246,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.05) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Top accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)',
          }}
        />

        {/* Tags */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '28px', flexWrap: 'wrap' }}>
          {tags.slice(0, 4).map((tag) => (
            <div
              key={tag}
              style={{
                background: 'rgba(59,130,246,0.15)',
                border: '1px solid rgba(59,130,246,0.3)',
                color: '#60a5fa',
                fontSize: '14px',
                padding: '4px 14px',
                borderRadius: '999px',
                fontFamily: 'monospace',
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: title.length > 60 ? '40px' : '52px',
            fontWeight: 900,
            color: '#f0f6fc',
            lineHeight: 1.15,
            flex: 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {title}
        </div>

        {/* Author row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 800,
                fontSize: '18px',
              }}
            >
              B
            </div>
            <div>
              <div style={{ color: '#f0f6fc', fontWeight: 700, fontSize: '16px' }}>Bennie Joseph</div>
              <div style={{ color: '#8b949e', fontSize: '13px', fontFamily: 'monospace' }}>
                Salesforce Architect · AI Builder
              </div>
            </div>
          </div>
          <div
            style={{
              color: '#3b82f6',
              fontSize: '14px',
              fontFamily: 'monospace',
              opacity: 0.7,
            }}
          >
            benniejoseph.dev/blog
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
