import '../node_modules/destyle.css/destyle.css';
import "../designSystem/global.scss"
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
export default MyApp
