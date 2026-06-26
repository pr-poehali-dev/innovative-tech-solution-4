import Layout from './Layout'
import OfferCards from './OfferCards'

export default function LandingPage() {
  return (
    <Layout>
      <div className="h-full overflow-y-auto">
        <OfferCards />
      </div>
    </Layout>
  )
}
