import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>🔥 МЕГА РАСПРОДАЖА АВТО! Скидки до 30%! Осталось 24 из 67! | АвтоМакс</title>
        <meta name="description" content="⚡ СУПЕР ЦЕНЫ на авто из Европы и Азии! BMW, Mercedes, Audi, Porsche, Lexus. Растаможены и готовы к выдаче! Успей купить!" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta property="og:title" content="🔥 МЕГА РАСПРОДАЖА АВТО! Скидки до 30%!" />
        <meta property="og:description" content="Осталось 24 автомобиля из 67! Успей купить по супер-цене! 🚗⚡" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

