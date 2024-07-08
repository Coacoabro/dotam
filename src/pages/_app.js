import "../styles/globals.css"
import Layout from "../components/Layout"

//require('dotenv').config()

export default function Dotam({ Component, pageProps }) {
    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    )
}