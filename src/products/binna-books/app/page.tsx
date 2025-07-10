import { Metadata } from 'next'
import BinnaBooksApp from '../components/binna-books-app'

export const metadata: Metadata = {
  title: 'BinnaBooks - Accounting System',
  description: 'ZATCA-compliant accounting system competing with Wafeq',
}

export default function BinnaBooksPage() {
  return <BinnaBooksApp />
}
