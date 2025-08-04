import { Metadata } from 'next';
import { SignupForm } from '@/domains/user/components/auth/SignupForm';

export const metadata: Metadata = {
  title: 'Sign Up - BinaaHub',
  description: 'Create your BinaaHub account'
};

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join BinaaHub to manage your construction projects
          </p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}
