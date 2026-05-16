import { ImageResponse } from 'next/og'

export const size = { width: 48, height: 48 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 14,
          background: 'linear-gradient(135deg,#0d1029,#11162d)',
          border: '1px solid rgba(255,255,255,0.16)',
          color: '#cbd6ff',
          fontWeight: 800,
          fontSize: 24,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, SF Pro Display, SystemFont, Helvetica Neue, sans-serif',
        }}
      >
        N
      </div>
    ),
    size,
  )
}
