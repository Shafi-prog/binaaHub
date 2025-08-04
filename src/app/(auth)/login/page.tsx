import { Metadata } from 'next';
import { LoginForm } from '@/domains/user/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Login - BinaaHub',
  description: 'Sign in to your BinaaHub account'
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to BinaaHub
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access your construction projects and marketplace
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
