import type { NextPage } from 'next'
import Head from 'next/head'

import styles from '../../styles/Home.module.scss'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Promobit - Movies</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Teste 123</h1>
    </div>
  )
}

export default Home