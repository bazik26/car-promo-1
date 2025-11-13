import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>🔥 СУПЕР РАСПРОДАЖА АВТО СО СКЛАДА | 24 из 67 осталось!</title>
        <meta name="description" content="Успей купить авто из Европы и Азии! Растаможены и готовы к выдаче. Невероятные цены на BMW, Mercedes, Audi и другие премиум бренды!" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta property="og:title" content="🔥 СУПЕР РАСПРОДАЖА АВТО СО СКЛАДА" />
        <meta property="og:description" content="24 автомобиля из 67 осталось в наличии! Успей купить!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

