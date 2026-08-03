import Script from 'next/script';

export const metadata = {
  title: "Venus Performance | Motor de Agenda 14/30",
  description: "Instalamos un sistema de captación de pacientes en tu clínica dental. 14 días de instalación. 10 citas confirmadas en 30 días. Garantizado.",
  themeColor: "#080808",
  // Los iconos viven en public/ y no en app/ para poder versionarlos: Chrome
  // cachea el favicon de forma muy persistente y no lo suelta ni con un hard
  // reload. Subir el ?v= es la unica forma confiable de forzar el refresco.
  // Ojo: si hubiera un app/icon.* o app/apple-icon.*, Next usaria esos archivos
  // e ignoraria por completo este bloque.
  icons: {
    icon: [{ url: "/favicon.ico?v=2", sizes: "16x16 32x32 48x48", type: "image/x-icon" }],
    apple: [{ url: "/apple-icon.png?v=2", sizes: "180x180", type: "image/png" }],
  },
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
              // Desactiva la configuracion automatica del pixel: es la que
              // dispara SubscribedButtonClick al hacer clic en cualquier boton.
              // Va antes del init para que no alcance a registrarse.
              fbq('set', 'autoConfig', false, '1151846457038387');
              fbq('init', '1151846457038387');
              fbq('track', 'PageView');
            `,
          }}
        />
        <Script
          src="https://link.msgsndr.com/js/form_embed.js"
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
        {/*
          El <img> va como HTML crudo a proposito. Si se escribe como elemento
          JSX, Next lo detecta en el arbol y le agrega un
          <link rel="preload" as="image">, con lo cual el navegador descarga la
          URL aunque el <noscript> nunca se muestre. Esa descarga cuenta como un
          PageView y por eso el pixel registraba dos.
        */}
        <noscript
          dangerouslySetInnerHTML={{
            __html:
              '<img height="1" width="1" style="display:none" alt="" ' +
              'src="https://www.facebook.com/tr?id=1151846457038387&ev=PageView&noscript=1" />',
          }}
        />
      </body>
    </html>
  );
}
