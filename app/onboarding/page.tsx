'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Button, TextField, InputAdornment } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ProtectedRoute from '@/components/ProtectedRoute';
import Logo from '@/components/Logo';
import { useAuth } from '@/context/AuthContext';
import LanguageIcon from '@mui/icons-material/Language';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import BusinessIcon from '@mui/icons-material/Business';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

const goals = [
  { id: 'seo', label: 'Rank higher (SEO)', icon: TrendingUpIcon },
  { id: 'performance', label: 'Faster site (Performance)', icon: SpeedIcon },
  { id: 'security', label: 'Stay secure (Security)', icon: SecurityIcon },
  { id: 'all', label: 'All-round growth', icon: AutoAwesomeIcon },
];

const roles = [
  { id: 'solo', label: 'Just me', icon: PersonIcon },
  { id: 'small', label: 'Small team (2-10)', icon: GroupsIcon },
  { id: 'company', label: 'Company (10+)', icon: BusinessIcon },
];

const TOTAL_STEPS = 4;

const cardSx = {
  width: '100%',
  maxWidth: 560,
  p: { xs: 3, sm: 5 },
  borderRadius: '12px',
  background: 'var(--bg-surface)',
  border: '1px solid var(--border)',
  boxShadow: 'var(--shadow-md)',
};

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [website, setWebsite] = useState('');
  const [goal, setGoal] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  // If already onboarded, skip straight to the dashboard.
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('onboardingComplete') === '1') {
      router.replace('/dashboard');
    }
  }, [router]);

  const firstName = user?.name?.split(' ')[0] || 'there';

  const finish = (startScan: boolean) => {
    try {
      localStorage.setItem('onboardingComplete', '1');
      if (website.trim()) localStorage.setItem('onboardingWebsite', website.trim());
      if (goal) localStorage.setItem('onboardingGoal', goal);
      if (role) localStorage.setItem('onboardingRole', role);
      // Ensure the dashboard tour runs right after onboarding.
      localStorage.removeItem('dashboardTourDone');
    } catch {
      /* ignore */
    }
    if (startScan && website.trim()) {
      router.push(`/analyzer?url=${encodeURIComponent(website.trim())}`);
    } else {
      router.push('/dashboard');
    }
  };

  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const ChoiceButton = ({
    active,
    icon: Icon,
    label,
    onClick,
  }: {
    active: boolean;
    icon: React.ElementType;
    label: string;
    onClick: () => void;
  }) => (
    <Box
      component={motion.button}
      type="button"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        width: '100%',
        textAlign: 'left',
        cursor: 'pointer',
        p: 1.75,
        borderRadius: '10px',
        background: active ? 'rgba(252, 82, 63, 0.12)' : 'var(--overlay-03)',
        border: active ? '1px solid rgba(252, 82, 63, 0.5)' : '1px solid var(--border)',
        color: 'var(--text-primary)',
        transition: 'background 0.15s ease, border-color 0.15s ease',
        '&:hover': { borderColor: 'rgba(252, 82, 63, 0.4)' },
      }}
    >
      <Box
        sx={{
          width: 38,
          height: 38,
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color: active ? '#FD7565' : 'var(--text-muted)',
          background: active ? 'rgba(252, 82, 63, 0.18)' : 'var(--overlay-04)',
        }}
      >
        <Icon sx={{ fontSize: 20 }} />
      </Box>
      <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', flex: 1 }}>{label}</Typography>
      {active && <CheckCircleRoundedIcon sx={{ color: '#FC523F', fontSize: 20 }} />}
    </Box>
  );

  return (
    <ProtectedRoute>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-base)',
          position: 'relative',
          overflow: 'hidden',
          p: 2,
        }}
      >
        <Box
          component={motion.div}
          animate={{ scale: [1, 1.2, 1], opacity: [0.12, 0.2, 0.12] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          sx={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: 500,
            height: 500,
            background: 'radial-gradient(circle, rgba(252, 82, 63, 0.3) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(70px)',
          }}
        />

        {/* Progress dots */}
        <Box sx={{ display: 'flex', gap: 1, mb: 3, zIndex: 1 }}>
          {[...Array(TOTAL_STEPS)].map((_, i) => (
            <Box
              key={i}
              sx={{
                height: 6,
                width: i === step ? 28 : 6,
                borderRadius: '9999px',
                background: i <= step ? 'linear-gradient(90deg, #FC523F, #E13E2C)' : 'var(--overlay-10)',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </Box>

        <Box sx={{ ...cardSx, position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Logo size={36} fontSize="1.25rem" />
          </Box>

          <AnimatePresence mode="wait">
            {/* STEP 0 — Welcome */}
            {step === 0 && (
              <motion.div key="s0" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ width: 64, height: 64, mx: 'auto', mb: 2, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(252, 82, 63, 0.15)' }}>
                    <RocketLaunchIcon sx={{ fontSize: 32, color: '#FC523F' }} />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: 'var(--text-primary)', mb: 1 }}>
                    Welcome, {firstName}! 👋
                  </Typography>
                  <Typography sx={{ color: 'var(--text-muted)', fontSize: '1rem', mb: 4, lineHeight: 1.6 }}>
                    Let&apos;s set up your growth workspace in under a minute. We&apos;ll tailor SiteScore AI to what matters most to you.
                  </Typography>
                  <Button fullWidth variant="contained" onClick={next} sx={primaryBtn}>
                    Let&apos;s go
                  </Button>
                </Box>
              </motion.div>
            )}

            {/* STEP 1 — Website */}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'var(--text-primary)', mb: 1 }}>
                  What site do you want to grow?
                </Typography>
                <Typography sx={{ color: 'var(--text-muted)', mb: 3 }}>
                  Add your website so we can run your first scan. You can change this later.
                </Typography>
                <TextField
                  fullWidth
                  placeholder="example.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LanguageIcon sx={{ color: 'var(--text-muted)', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={inputSx}
                />
                <Box sx={{ display: 'flex', gap: 1.5, mt: 4 }}>
                  <Button onClick={back} sx={ghostBtn}>
                    Back
                  </Button>
                  <Button fullWidth variant="contained" onClick={next} sx={primaryBtn}>
                    Continue
                  </Button>
                </Box>
              </motion.div>
            )}

            {/* STEP 2 — Goal */}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'var(--text-primary)', mb: 1 }}>
                  What&apos;s your main goal?
                </Typography>
                <Typography sx={{ color: 'var(--text-muted)', mb: 3 }}>
                  We&apos;ll prioritize your action plan around this.
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                  {goals.map((g) => (
                    <ChoiceButton key={g.id} active={goal === g.id} icon={g.icon} label={g.label} onClick={() => setGoal(g.id)} />
                  ))}
                </Box>
                <Box sx={{ display: 'flex', gap: 1.5, mt: 4 }}>
                  <Button onClick={back} sx={ghostBtn}>
                    Back
                  </Button>
                  <Button fullWidth variant="contained" disabled={!goal} onClick={next} sx={primaryBtn}>
                    Continue
                  </Button>
                </Box>
              </motion.div>
            )}

            {/* STEP 3 — Role + finish */}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'var(--text-primary)', mb: 1 }}>
                  Who&apos;s growing with you?
                </Typography>
                <Typography sx={{ color: 'var(--text-muted)', mb: 3 }}>
                  This helps us recommend the right collaboration features.
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                  {roles.map((r) => (
                    <ChoiceButton key={r.id} active={role === r.id} icon={r.icon} label={r.label} onClick={() => setRole(r.id)} />
                  ))}
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, mt: 4 }}>
                  <Button fullWidth variant="contained" onClick={() => finish(true)} sx={primaryBtn} disabled={!website.trim()}>
                    {website.trim() ? 'Finish & run my first scan' : 'Add a website to scan'}
                  </Button>
                  <Button fullWidth onClick={() => finish(false)} sx={ghostBtn}>
                    Skip to dashboard
                  </Button>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>

        {step === 0 && (
          <Button onClick={() => finish(false)} sx={{ mt: 2, color: 'var(--text-muted)', textTransform: 'none', zIndex: 1, '&:hover': { color: 'var(--text-primary)', background: 'transparent' } }}>
            Skip onboarding
          </Button>
        )}
      </Box>
    </ProtectedRoute>
  );
}

const primaryBtn = {
  py: 1.4,
  borderRadius: '8px',
  fontSize: '1rem',
  fontWeight: 700,
  textTransform: 'none',
  background: '#E13E2C',
  boxShadow: 'none',
  '&:hover': { background: '#C9341F', boxShadow: 'none' },
  '&:disabled': { background: 'rgba(252, 82, 63, 0.35)', color: 'rgba(255,255,255,0.6)' },
};

const ghostBtn = {
  py: 1.4,
  px: 3,
  borderRadius: '8px',
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  color: 'var(--text-muted)',
  '&:hover': { background: 'var(--overlay-04)', color: 'var(--text-primary)' },
};

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    background: 'var(--overlay-03)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
    '& fieldset': { border: 'none' },
    '&:hover': { borderColor: 'rgba(252, 82, 63, 0.3)' },
    '&.Mui-focused': { borderColor: 'rgba(252, 82, 63, 0.6)', boxShadow: '0 0 0 3px rgba(252, 82, 63, 0.15)' },
  },
};
