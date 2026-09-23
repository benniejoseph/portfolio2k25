import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title') ?? 'Bennie Joseph'
  const tags = (searchParams.get('tags') ?? '').split(',').filter(Boolean)

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #012AC1 0%, #2B2AE8 48%, #7C3AED 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '60px 70px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Soft constellation field */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle at 18% 24%, rgba(130,240,229,0.36) 0 2px, transparent 3px), radial-gradient(circle at 82% 18%, rgba(254,138,167,0.44) 0 3px, transparent 4px), radial-gradient(circle at 72% 78%, rgba(209,125,254,0.42) 0 2px, transparent 3px)',
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
            background: 'linear-gradient(90deg, #82F0E5, #D17DFE, #FE8AA7)',
          }}
        />

        {/* Tags */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '28px', flexWrap: 'wrap' }}>
          {tags.slice(0, 4).map((tag) => (
            <div
              key={tag}
              style={{
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.24)',
                color: '#FFFFFF',
                fontSize: '14px',
                padding: '4px 14px',
                borderRadius: '999px',
                fontFamily: 'sans-serif',
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
            color: '#FFFFFF',
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
                background: 'linear-gradient(135deg, #82F0E5, #D17DFE)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#08206F',
                fontWeight: 800,
                fontSize: '18px',
              }}
            >
              B
            </div>
            <div>
              <div style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '16px' }}>Bennie Joseph</div>
              <div style={{ color: '#DDE8FF', fontSize: '13px' }}>
                Customer Success Manager · Salesforce
              </div>
            </div>
          </div>
          <div
            style={{
              color: '#82F0E5',
              fontSize: '14px',
              fontFamily: 'sans-serif',
              opacity: 0.7,
            }}
          >
            bennierichard.com/blog
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
