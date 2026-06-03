'use client';

import { Box } from '@mui/material';
import LandingNavbar from '@/components/landing/LandingNavbar';
import HeroSection from '@/components/landing/HeroSection';
import ProblemSection from '@/components/landing/ProblemSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import DashboardFeaturesSection from '@/components/landing/DashboardFeaturesSection';
import MetricsShowcaseSection from '@/components/landing/MetricsShowcaseSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import RealTimeSection from '@/components/landing/RealTimeSection';
import DeveloperSection from '@/components/landing/DeveloperSection';
import PricingSection from '@/components/landing/PricingSection';
import TestimonialsStatsSection from '@/components/landing/TestimonialsStatsSection';
import FinalCTASection from '@/components/landing/FinalCTASection';
import LandingFooter from '@/components/landing/LandingFooter';

export default function LandingPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0A0E27 0%, #151932 45%, #0A0E27 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <LandingNavbar />
      <main>
        <HeroSection />
        <ProblemSection />
        <MetricsShowcaseSection />
        <FeaturesSection />
        <DashboardFeaturesSection />
        <HowItWorksSection />
        <RealTimeSection />
        <DeveloperSection />
        <PricingSection />
        <TestimonialsStatsSection />
        <FinalCTASection />
        <LandingFooter />
      </main>
    </Box>
  );
}
