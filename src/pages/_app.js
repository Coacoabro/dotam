import "../styles/tailwind.css";
import { useEffect } from "react";
import Layout from '../components/Layout'
require('dotenv').config()

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp;