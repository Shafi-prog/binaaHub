"use client"

// Force dynamic rendering to avoid SSG auth context issues
import UserDashboard from '../../../domains/users/components/UserDashboard'

// Debug: Check if the right component is being imported
console.log('UserDashboard component:', UserDashboard)



export const dynamic = 'force-dynamic'
export default function UserDashboardPage() {
  return <UserDashboard />
}
