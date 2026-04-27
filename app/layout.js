import Script from 'next/script';

export const metadata = {
  title: "Venus Performance | Motor de Agenda 14/30",
  description: "Instalamos un sistema de captación de pacientes en tu clínica dental. 14 días de instalación. 10 citas confirmadas en 30 días. Garantizado.",
  themeColor: "#080808",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        {children}
        <Script
          id="meta-pixel"
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
              fbq('init', '1151846457038387');
              fbq('track', 'PageView');
            `,
          }}
        />
        <Script
          src="https://link.markgrowth.pro/js/form_embed.js"
          strategy="afterInteractive"
        />
        <Script
          src="https://fast.wistia.com/player.js"
          strategy="afterInteractive"
        />
        <Script
          src="https://fast.wistia.com/embed/du5mc2z1pq.js"
          strategy="afterInteractive"
          type="module"
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1151846457038387&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </body>
    </html>
  );
}
