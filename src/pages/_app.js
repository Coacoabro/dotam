import "../styles/globals.css"
import { QueryClient, QueryClientProvider } from "react-query"
import Layout from "../components/Layout"

//require('dotenv').config()

const queryClient = new QueryClient()

export default function DotaM({ Component, pageProps }) {
    return (
        <QueryClientProvider client={queryClient}>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </QueryClientProvider>
    )
}