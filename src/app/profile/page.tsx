'use client';

import { useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

function ProfileContent() {
  const router = useRouter();
  const { username, name, user_id, user_group, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-400 italic text-sm">Đang tải hồ sơ...</span>
        </div>
      </div>
    );
  }

  const fields = [
    { label: 'User ID',   value: user_id },
    { label: 'Họ tên',    value: name },
    { label: 'Email',     value: username },
    { label: 'Nhóm',      value: user_group?.toUpperCase() },
  ];

  return (
    <div className="flex h-full bg-gray-100 overflow-hidden text-sm p-4 items-start justify-center">
      <div className="w-full max-w-lg flex flex-col gap-3">

        {/* Toolbar */}
        <div className="bg-white rounded-xl shadow-sm border p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold bg-white hover:bg-orange-50 text-gray-600 border-gray-200 transition"
            >
              ← Quay lại
            </button>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Thông tin tài khoản
            </span>
          </div>
          <span className="px-2.5 py-1 rounded-md text-[9px] font-black tracking-tighter shadow-sm bg-green-100 text-green-700">
            HOẠT ĐỘNG
          </span>
        </div>

        {/* Profile card */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">

          {/* Header */}
          <div className="p-4 border-b bg-orange-600 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500 border-2 border-orange-400 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-black text-xl uppercase">
                {name?.charAt(0) ?? '?'}
              </span>
            </div>
            <div>
              <p className="text-white font-black text-base uppercase leading-tight">
                {name ?? '—'}
              </p>
              <p className="text-orange-200 text-[11px] font-mono mt-0.5">
                {username ?? '—'}
              </p>
            </div>
          </div>

          {/* Fields */}
          <div className="p-5 space-y-0 divide-y divide-gray-50">
            {fields.map((f, i) => (
              <div key={i} className="flex items-center justify-between py-3">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest w-28 flex-shrink-0">
                  {f.label}
                </span>
                <span className="text-sm font-bold text-gray-800 text-right break-all">
                  {f.value ?? <span className="text-gray-300 font-normal">—</span>}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <ProfileContent />
      </AppLayout>
    </ProtectedRoute>
  );
}
