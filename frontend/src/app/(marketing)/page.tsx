import { Hero, Testimonials, Pricing } from './_components'
import { Footer } from '@/components'
import Script from 'next/script'
const Home = () => {
  return (
    <>
      <Hero />
      <Testimonials />
      <Pricing />
      <Footer />
      <Script
        src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js"
        integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r"
        crossOrigin="anonymous"
      />
    </>
  )
}
export default Home
