'use client';

import { Box, Paper, Typography } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ScriptableContext,
  Plugin,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Scan } from '@/services/scanService';
import { useThemeMode } from '@/theme/ThemeModeProvider';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ScoreHistoryChartProps {
  scans: Scan[];
  scoreType: 'performanceScore' | 'seoScore' | 'securityScore';
  title?: string;
}

const META: Record<string, { color: string; light: string; rgb: string; label: string }> = {
  performanceScore: { color: '#FC523F', light: '#FDA294', rgb: '252, 82, 63', label: 'Performance' },
  seoScore: { color: '#22C55E', light: '#86EFAC', rgb: '34, 197, 94', label: 'SEO' },
  securityScore: { color: '#F59E0B', light: '#FCD34D', rgb: '245, 158, 11', label: 'Security' },
};

const ScoreHistoryChart: React.FC<ScoreHistoryChartProps> = ({ scans, scoreType, title }) => {
  const { mode } = useThemeMode();
  const dark = mode === 'dark';

  const sortedScans = [...scans].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const labels = sortedScans.map((scan) => new Date(scan.createdAt).toLocaleDateString());
  const data = sortedScans.map((scan) => scan[scoreType]);
  const meta = META[scoreType];

  const latest = data.length ? data[data.length - 1] : 0;
  const prev = data.length > 1 ? data[data.length - 2] : latest;
  const delta = latest - prev;
  const avg = data.length ? Math.round(data.reduce((a, b) => a + b, 0) / data.length) : 0;
  const best = data.length ? Math.max(...data) : 0;

  // Vertical crosshair guide on hover
  const crosshairPlugin: Plugin<'line'> = {
    id: `crosshair-${scoreType}`,
    afterDraw(chart) {
      const active = chart.getActiveElements();
      if (!active.length) return;
      const { ctx, chartArea } = chart;
      const x = active[0].element.x;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, chartArea.top);
      ctx.lineTo(x, chartArea.bottom);
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
      ctx.stroke();
      ctx.restore();
    },
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: meta.label,
        data,
        borderWidth: 3,
        tension: 0.45,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: meta.light,
        pointHoverBorderColor: dark ? '#111827' : '#FFFFFF',
        pointHoverBorderWidth: 3,
        borderColor: (ctx: ScriptableContext<'line'>) => {
          const { chart } = ctx;
          const { ctx: canvas, chartArea } = chart;
          if (!chartArea) return meta.color;
          const g = canvas.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
          g.addColorStop(0, meta.color);
          g.addColorStop(1, meta.light);
          return g;
        },
        backgroundColor: (ctx: ScriptableContext<'line'>) => {
          const { chart } = ctx;
          const { ctx: canvas, chartArea } = chart;
          if (!chartArea) return `rgba(${meta.rgb}, 0)`;
          const g = canvas.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          g.addColorStop(0, `rgba(${meta.rgb}, 0.4)`);
          g.addColorStop(0.5, `rgba(${meta.rgb}, 0.1)`);
          g.addColorStop(1, `rgba(${meta.rgb}, 0)`);
          return g;
        },
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1100, easing: 'easeOutQuart' as const },
    interaction: { mode: 'index' as const, intersect: false },
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        backgroundColor: dark ? 'rgba(17,24,39,0.95)' : 'rgba(255,255,255,0.95)',
        titleColor: dark ? '#F1F5F9' : '#0F172A',
        bodyColor: dark ? '#CBD5E1' : '#334155',
        borderColor: `rgba(${meta.rgb}, 0.35)`,
        borderWidth: 1,
        padding: 12,
        cornerRadius: 10,
        displayColors: false,
        titleFont: { weight: 'bold' as const },
      },
    },
    scales: {
      x: {
        grid: { display: false, drawBorder: false } as any,
        ticks: { color: dark ? '#94A3B8' : '#64748B', maxTicksLimit: 6, font: { size: 11 } },
      },
      y: {
        min: 0,
        max: 100,
        border: { display: false } as any,
        grid: { color: dark ? 'rgba(255,255,255,0.06)' : 'rgba(15, 23, 42, 0.03)', drawBorder: false } as any,
        ticks: { stepSize: 25, color: dark ? '#94A3B8' : '#64748B', font: { size: 11 }, padding: 10 },
      },
    },
  };

  const Stat = ({ label, value }: { label: string; value: number }) => (
    <Box>
      <Typography sx={{ color: 'var(--text-faint)', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        {label}
      </Typography>
      <Typography sx={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 700, mt: 0.25 }}>{value}</Typography>
    </Box>
  );

  return (
    <Paper
      sx={{
        overflow: 'hidden',
        p: { xs: 2.5, md: 3 },
        height: '400px',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: '10px',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 9,
                height: 9,
                borderRadius: '50%',
                background: meta.color,
              }}
            />
            <Typography sx={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              {title || `${meta.label} Score`}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 1 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '2rem', color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1 }}>
              {latest}
            </Typography>
            {data.length > 1 && (
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.25,
                  px: 0.75,
                  py: 0.25,
                  borderRadius: '6px',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: delta >= 0 ? '#16A34A' : '#DC2626',
                  background: delta >= 0 ? 'rgba(22, 163, 74, 0.1)' : 'rgba(220, 38, 38, 0.1)',
                }}
              >
                {delta >= 0 ? '▲' : '▼'} {Math.abs(delta)}
              </Box>
            )}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2.5, textAlign: 'right' }}>
          <Stat label="Avg" value={avg} />
          <Stat label="Best" value={best} />
        </Box>
      </Box>
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <Line data={chartData} options={options} plugins={[crosshairPlugin]} />
      </Box>
    </Paper>
  );
};

export default ScoreHistoryChart;
