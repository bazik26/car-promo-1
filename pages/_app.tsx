import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Premium Cars From The Future | Exclusive Collection | Future Motors</title>
        <meta name="description" content="Эксклюзивная коллекция премиум автомобилей. BMW, Mercedes-Benz, Audi, Porsche, Lexus. Растаможены и готовы к выдаче. Ограниченное предложение — 24 из 67." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta property="og:title" content="Premium Cars From The Future | Future Motors" />
        <meta property="og:description" content="Эксклюзивная коллекция премиум автомобилей. 24 из 67 в наличии." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

