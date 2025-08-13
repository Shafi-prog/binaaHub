import { redirect } from 'next/navigation';

export default function UserSmartInsightsPage() {
  // Legacy page replaced by the new advice experience
  redirect('/user/building-advice');
}
