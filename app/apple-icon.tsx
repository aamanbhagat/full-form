import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

// The record-card mark (no text → no font needed), rendered to PNG for iOS.
export default function AppleIcon() {
  const line = (w: number, o: number) => ({
    width: w,
    height: 14,
    borderRadius: 7,
    background: '#ffffff',
    opacity: o,
  });
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          background: '#1C3D6E',
        }}
      >
        <div style={{ width: 34, height: '100%', background: '#E8732B' }} />
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 16,
            paddingLeft: 26,
          }}
        >
          <div style={line(96, 1)} />
          <div style={line(96, 0.85)} />
          <div style={line(64, 0.7)} />
        </div>
      </div>
    ),
    { ...size },
  );
}
