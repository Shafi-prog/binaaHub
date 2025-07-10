import { Metadata } from 'next'
import BinnaStockApp from '../components/binna-stock-app'

export const metadata: Metadata = {
  title: 'BinnaStock - Inventory Management System',
  description: 'Advanced inventory management system competing with Rewaa',
}

export default function BinnaStockPage() {
  return <BinnaStockApp />
}
