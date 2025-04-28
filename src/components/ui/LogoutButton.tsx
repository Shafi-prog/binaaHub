'use client';

import { toast } from 'react-hot-toast';

export function LogoutButton() {
    const handleLogout = async () => {
        try {
            const res = await fetch('/api/logout', {
                method: 'POST',
            });

            if (res.ok) {
                toast.success('تم تسجيل الخروج بنجاح ✅');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 1000);
            } else {
                toast.error('فشل تسجيل الخروج');
            }
        } catch (error) {
            toast.error('حدث خطأ أثناء تسجيل الخروج');
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="mt-6 w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition font-semibold"
        >
            تسجيل الخروج
        </button>
    );
}
