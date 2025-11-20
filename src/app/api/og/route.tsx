import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // Get parameters from query string
  const title = searchParams.get('title') || 'Lookiy - The Way to Africa and World\'s Next Generation of Social Communication';
  const description = searchParams.get('description') || 'Making lives easier than ever. Connect globally, build locally.';
  const logo = searchParams.get('logo') || 'https://lookiy.net/logomin.png';

  try {
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            padding: '40px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative elements */}
          <div
            style={{
              position: 'absolute',
              top: '-100px',
              right: '-100px',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-50px',
              left: '-50px',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: 'rgba(0, 0, 0, 0.1)',
            }}
          />

          {/* Main content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              textAlign: 'center',
            }}
          >
            {/* Logo */}
            <img
              src={logo}
              alt="Lookiy Logo"
              width={120}
              height={120}
              style={{
                marginBottom: '30px',
                borderRadius: '20px',
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '10px',
              }}
            />

            {/* Title */}
            <h1
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: 'white',
                margin: '0 0 20px 0',
                lineHeight: '1.3',
                maxWidth: '100%',
              }}
            >
              {title}
            </h1>

            {/* Description */}
            <p
              style={{
                fontSize: '28px',
                color: 'rgba(255, 255, 255, 0.95)',
                margin: '0 0 40px 0',
                maxWidth: '90%',
                lineHeight: '1.4',
              }}
            >
              {description}
            </p>

            {/* CTA Text */}
            <div
              style={{
                display: 'flex',
                gap: '20px',
                alignItems: 'center',
                marginTop: '20px',
              }}
            >
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '20px',
                  color: 'white',
                  fontWeight: '600',
                  border: '2px solid rgba(255, 255, 255, 0.4)',
                }}
              >
                lookiy.net
              </div>
            </div>
          </div>

          {/* Bottom accent */}
          <div
            style={{
              position: 'absolute',
              bottom: '0',
              left: '0',
              right: '0',
              height: '4px',
              background: 'rgba(0, 0, 0, 0.2)',
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        },
      }
    );
  } catch (error) {
    console.error('OG Image generation error:', error);
    return new Response('Failed to generate OG image', { status: 500 });
  }
}
