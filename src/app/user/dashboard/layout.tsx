import { AppSidebar } from './components/app-sidebar';

export default async function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <AppSidebar />
      {/* Main content with right margin to account for fixed sidebar */}
      <div className="mr-72 min-h-screen">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
