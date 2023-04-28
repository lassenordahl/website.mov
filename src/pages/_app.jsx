import { Analytics } from "@vercel/analytics/react";

import "@/styles/globals.scss";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
