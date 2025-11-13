import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Автомобили из Европы под ключ — распродажа склада | Скидки до 30%</title>
        <meta name="description" content="Официальная распродажа склада. BMW, Mercedes-Benz, Audi, Porsche, Lexus. Растаможены, оформлены, готовы к выдаче. Полный пакет документов. 24 авто в наличии." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta property="og:title" content="Распродажа склада — автомобили из Европы под ключ" />
        <meta property="og:description" content="Растаможенные авто с документами. Скидки до 30%. 24 автомобиля в наличии. Бесплатная консультация." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

