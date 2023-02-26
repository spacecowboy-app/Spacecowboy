import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'


export default function Home() {
    return (
        <>
            <Head>
                <title>Spacecowboy</title>
                <meta name="description" content="Spacecowboy : Quick decisions" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta property="og:title" content="Spacecowboy : Quick decisions" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://spacecowboy.app" />
                <meta property="og:image" content="https://spacecowboy.app/thumbnail.png" />
                <link rel="apple-touch-icon" href="/logo192.png" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <div className={styles.description}>
                    <p>
                        Spacecowboy
                    </p>
                </div>
            </main>
      </>
    )
}
