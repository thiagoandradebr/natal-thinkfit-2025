'use client'

import Script from 'next/script'

declare global {
  interface Window {
    fbq: (
      action: string,
      event: string,
      params?: Record<string, any>
    ) => void
    _fbq?: any
  }
}

interface FacebookPixelProps {
  pixelId?: string
}

export default function FacebookPixel({ pixelId }: FacebookPixelProps) {
  const pixelIdValue = pixelId || process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID

  if (!pixelIdValue) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ [Facebook Pixel] Pixel ID não configurado!')
      console.warn('Configure a variável NEXT_PUBLIC_FACEBOOK_PIXEL_ID no Vercel')
    }
    return null
  }

  return (
    <>
      <Script
        id="facebook-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixelIdValue}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${pixelIdValue}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  )
}

