import { Metadata } from 'next'
import BinnaPOSApp from '../components/binna-pos-app'

export const metadata: Metadata = {
  title: 'BinnaPOS - Point of Sale System',
  description: 'Saudi Arabia\'s leading POS system competing with OnyxPro',
}

export default function BinnaPOSPage() {
  return <BinnaPOSApp />
}
