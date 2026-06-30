'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, CircularProgress, Typography } from '@mui/material';
import { authService } from '@/services/authService';
import Logo from '@/components/Logo';

function CallbackInner() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const token = params.get('token');
    const error = params.get('error');

    if (error || !token) {
      router.replace(`/login?error=${error || 'oauth_failed'}`);
      return;
    }

    (async () => {
      try {
        localStorage.setItem('token', token);
        const user = await authService.getMe();
        localStorage.setItem('user', JSON.stringify({ _id: user._id, name: user.name, email: user.email }));
        // Full reload so AuthProvider re-initialises from storage.
        window.location.href = '/dashboard';
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.replace('/login?error=oauth_failed');
      }
    })();
  }, [params, router]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        background: 'var(--bg-base)',
      }}
    >
      <Logo size={44} fontSize="1.6rem" />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <CircularProgress size={22} sx={{ color: '#FC523F' }} />
        <Typography sx={{ color: 'var(--text-muted)', fontWeight: 500 }}>Signing you in…</Typography>
      </Box>
    </Box>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={null}>
      <CallbackInner />
    </Suspense>
  );
}
