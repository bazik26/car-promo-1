import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>ЭКСКЛЮЗИВНАЯ РАСПРОДАЖА ПРЕМИУМ АВТОМОБИЛЕЙ | Осталось 24 из 67</title>
        <meta name="description" content="Автомобили премиум-класса из Европы и Азии. Растаможены и готовы к выдаче. BMW, Mercedes-Benz, Audi, Porsche, Lexus. Ограниченное предложение." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta property="og:title" content="ЭКСКЛЮЗИВНАЯ РАСПРОДАЖА ПРЕМИУМ АВТОМОБИЛЕЙ" />
        <meta property="og:description" content="24 автомобиля премиум-класса. Ограниченное предложение." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

