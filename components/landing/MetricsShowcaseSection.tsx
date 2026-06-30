'use client';

import { useState } from 'react';
import { Box, Container, Grid, Paper, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
  ScriptableContext,
} from 'chart.js';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import SearchIcon from '@mui/icons-material/Search';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

// ---- Demo data (illustrative of what the dashboard renders) ----
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
const performanceSeries = [58, 62, 66, 64, 71, 76, 80, 84];
const seoSeries = [64, 67, 70, 74, 78, 80, 83, 87];
const securitySeries = [70, 72, 71, 76, 79, 82, 85, 88];

const makeFill = (rgb: string) => (ctx: ScriptableContext<'line'>) => {
  const { chart } = ctx;
  const { ctx: canvas, chartArea } = chart;
  if (!chartArea) return `rgba(${rgb}, 0)`;
  const g = canvas.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
  g.addColorStop(0, `rgba(${rgb}, 0.35)`);
  g.addColorStop(0.55, `rgba(${rgb}, 0.08)`);
  g.addColorStop(1, `rgba(${rgb}, 0)`);
  return g;
};

const lineData = {
  labels: months,
  datasets: [
    {
      label: 'Performance',
      data: performanceSeries,
      borderColor: '#FC523F',
      backgroundColor: makeFill('252, 82, 63'),
      tension: 0.45,
      fill: true,
      pointRadius: 0,
      pointHoverRadius: 5,
      borderWidth: 2.5,
    },
    {
      label: 'SEO',
      data: seoSeries,
      borderColor: '#22C55E',
      backgroundColor: makeFill('34, 197, 94'),
      tension: 0.45,
      fill: true,
      pointRadius: 0,
      pointHoverRadius: 5,
      borderWidth: 2.5,
    },
    {
      label: 'Security',
      data: securitySeries,
      borderColor: '#F59E0B',
      backgroundColor: makeFill('245, 158, 11'),
      tension: 0.45,
      fill: true,
      pointRadius: 0,
      pointHoverRadius: 5,
      borderWidth: 2.5,
    },
  ],
};

const barData = {
  labels: ['SEO', 'Perf', 'A11y', 'Security', 'Content', 'Mobile'],
  datasets: [
    {
      label: 'Score',
      data: [87, 84, 79, 88, 76, 82],
      backgroundColor: (ctx: ScriptableContext<'bar'>) => {
        const { chart } = ctx;
        const { ctx: canvas, chartArea } = chart;
        if (!chartArea) return 'rgba(252, 82, 63, 0.6)';
        const g = canvas.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
        g.addColorStop(0, 'rgba(252, 82, 63, 0.25)');
        g.addColorStop(1, 'rgba(252, 82, 63, 0.95)');
        return g;
      },
      borderRadius: 6,
      borderSkipped: false,
      barThickness: 26,
    },
  ],
};

const doughnutData = {
  labels: ['Excellent', 'Good', 'Needs work'],
  datasets: [
    {
      data: [62, 28, 10],
      backgroundColor: ['#22C55E', '#FC523F', '#EF4444'],
      borderColor: '#F8FAFC',
      borderWidth: 3,
      hoverOffset: 6,
    },
  ],
};

const radarData = {
  labels: ['SEO', 'Speed', 'Security', 'Content', 'UX', 'Authority'],
  datasets: [
    {
      label: 'Your site',
      data: [87, 84, 88, 76, 81, 79],
      borderColor: '#FC523F',
      backgroundColor: 'rgba(252, 82, 63, 0.18)',
      borderWidth: 2,
      pointBackgroundColor: '#FC523F',
      pointRadius: 3,
    },
    {
      label: 'Competitor avg',
      data: [70, 65, 72, 68, 64, 60],
      borderColor: '#64748B',
      backgroundColor: 'rgba(100, 116, 139, 0.12)',
      borderWidth: 1.5,
      pointBackgroundColor: '#64748B',
      pointRadius: 2,
    },
  ],
};

const baseScales = {
  x: {
    grid: { display: false, drawBorder: false } as any,
    ticks: { color: '#64748B', font: { size: 11 } },
  },
  y: {
    min: 0,
    max: 100,
    border: { display: false } as any,
    grid: { color: 'rgba(15, 23, 42, 0.04)', drawBorder: false } as any,
    ticks: { color: '#64748B', stepSize: 25, font: { size: 11 } },
  },
};

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index' as const, intersect: false },
  plugins: {
    legend: {
      position: 'top' as const,
      align: 'end' as const,
      labels: { color: '#64748B', usePointStyle: true, pointStyle: 'circle' as const, boxWidth: 8, padding: 16, font: { size: 12 } },
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      titleColor: '#0F172A',
      bodyColor: '#334155',
      borderColor: 'rgba(15, 23, 42, 0.1)',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 10,
      usePointStyle: true,
    },
  },
  scales: baseScales,
};

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      titleColor: '#0F172A',
      bodyColor: '#334155',
      borderColor: 'rgba(15, 23, 42, 0.1)',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 10,
    },
  },
  scales: baseScales,
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '68%',
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: { color: '#64748B', usePointStyle: true, pointStyle: 'circle' as const, boxWidth: 8, padding: 14, font: { size: 12 } },
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      titleColor: '#0F172A',
      bodyColor: '#334155',
      borderColor: 'rgba(15, 23, 42, 0.1)',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 10,
    },
  },
};

const radarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: { color: '#64748B', usePointStyle: true, pointStyle: 'circle' as const, boxWidth: 8, padding: 14, font: { size: 12 } },
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      titleColor: '#0F172A',
      bodyColor: '#334155',
      borderColor: 'rgba(15, 23, 42, 0.1)',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 10,
    },
  },
  scales: {
    r: {
      min: 0,
      max: 100,
      angleLines: { color: 'rgba(15, 23, 42, 0.05)' },
      grid: { color: 'rgba(15, 23, 42, 0.05)' },
      pointLabels: { color: '#64748B', font: { size: 11 } },
      ticks: { display: false, stepSize: 25 },
    },
  },
};

const stats = [
  { icon: SearchIcon, label: 'Scans run', value: '128', delta: '+18%', color: '#06B6D4' },
  { icon: SpeedIcon, label: 'Avg performance', value: '84', delta: '+12 pts', color: '#FC523F' },
  { icon: TrendingUpIcon, label: 'Avg SEO', value: '87', delta: '+9 pts', color: '#22C55E' },
  { icon: SecurityIcon, label: 'Avg security', value: '88', delta: '+6 pts', color: '#F59E0B' },
];

const cardSx = {
  p: { xs: 2.5, md: 3 },
  height: '100%',
  background: 'linear-gradient(155deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.95) 100%)',
  border: '1px solid rgba(15, 23, 42, 0.08)',
  borderRadius: '12px',
  backdropFilter: 'blur(20px)',
};

const ChartTitle = ({ children }: { children: React.ReactNode }) => (
  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0F172A', mb: 2 }}>
    {children}
  </Typography>
);

export default function MetricsShowcaseSection() {
  const [range, setRange] = useState<'3M' | '6M' | '8M'>('8M');

  const slice = range === '3M' ? -3 : range === '6M' ? -6 : -8;
  const rangedLine = {
    labels: months.slice(slice),
    datasets: lineData.datasets.map((d) => ({ ...d, data: (d.data as number[]).slice(slice) })),
  };

  return (
    <Box id="analytics" sx={{ py: { xs: 8, md: 12 }, position: 'relative' }}>
      <Container maxWidth="lg">
        <SectionHeading
          eyebrow="Live Analytics"
          title="See your growth in real numbers"
          subtitle="Every scan feeds beautiful, interactive charts—track trends, compare categories, and spot what to fix next."
        />

        {/* Stat row */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <Grid item xs={6} md={3} key={s.label}>
                <Paper
                  component={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  sx={cardSx}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1.5 }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: s.color,
                        background: `${s.color}22`,
                        border: `1px solid ${s.color}33`,
                      }}
                    >
                      <Icon sx={{ fontSize: 20 }} />
                    </Box>
                    <Typography variant="caption" sx={{ color: '#22C55E', fontWeight: 700 }}>
                      {s.delta}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: '1.9rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>
                    {s.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
                    {s.label}
                  </Typography>
                </Paper>
              </Grid>
            );
          })}
        </Grid>

        {/* Main line chart + doughnut */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={8}>
            <Paper
              component={motion.div}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              sx={cardSx}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                <ChartTitle>Score trends over time</ChartTitle>
                <ToggleButtonGroup
                  size="small"
                  exclusive
                  value={range}
                  onChange={(_, v) => v && setRange(v)}
                  sx={{
                    '& .MuiToggleButton-root': {
                      px: 1.5,
                      py: 0.25,
                      color: '#64748B',
                      border: '1px solid rgba(15,23,42,0.1)',
                      textTransform: 'none',
                      fontSize: '0.75rem',
                      '&.Mui-selected': { color: '#FD7565', background: 'rgba(252, 82, 63, 0.14)' },
                    },
                  }}
                >
                  <ToggleButton value="3M">3M</ToggleButton>
                  <ToggleButton value="6M">6M</ToggleButton>
                  <ToggleButton value="8M">8M</ToggleButton>
                </ToggleButtonGroup>
              </Box>
              <Box sx={{ height: 300 }}>
                <Line data={rangedLine} options={lineOptions} />
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              component={motion.div}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              sx={cardSx}
            >
              <ChartTitle>Site health split</ChartTitle>
              <Box sx={{ height: 300 }}>
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Bar + Radar */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              sx={cardSx}
            >
              <ChartTitle>Category breakdown</ChartTitle>
              <Box sx={{ height: 280 }}>
                <Bar data={barData} options={barOptions} />
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              sx={cardSx}
            >
              <ChartTitle>You vs. competitors</ChartTitle>
              <Box sx={{ height: 280 }}>
                <Radar data={radarData} options={radarOptions} />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
