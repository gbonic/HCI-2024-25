// src/app/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="hr">
      <Head>
        {/* Dodavanje Google fonta */}
        <link
          href="https://fonts.googleapis.com/css2?family=Italianno&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}