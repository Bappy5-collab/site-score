'use client';

import { Paper, Typography } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Scan } from '@/services/scanService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ScoreHistoryChartProps {
  scans: Scan[];
  scoreType: 'performanceScore' | 'seoScore' | 'securityScore';
  title?: string;
}

const ScoreHistoryChart: React.FC<ScoreHistoryChartProps> = ({
  scans,
  scoreType,
  title,
}) => {
  // Sort scans by date (oldest first)
  const sortedScans = [...scans].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const labels = sortedScans.map((scan) =>
    new Date(scan.createdAt).toLocaleDateString()
  );

  const data = sortedScans.map((scan) => scan[scoreType]);

  const getColor = () => {
    switch (scoreType) {
      case 'performanceScore':
        return '#8B5CF6';
      case 'seoScore':
        return '#22C55E';
      case 'securityScore':
        return '#F59E0B';
      default:
        return '#8B5CF6';
    }
  };

  const getLabel = () => {
    switch (scoreType) {
      case 'performanceScore':
        return 'Performance Score';
      case 'seoScore':
        return 'SEO Score';
      case 'securityScore':
        return 'Security Score';
      default:
        return 'Score';
    }
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: getLabel(),
        data,
        borderColor: getColor(),
        backgroundColor: getColor().includes('rgb') 
          ? getColor().replace('rgb', 'rgba').replace(')', ', 0.1)')
          : `${getColor()}1A`,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#94A3B8',
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#F1F5F9',
        bodyColor: '#94A3B8',
        borderColor: 'rgba(255, 255, 255, 0.08)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: '#94A3B8',
        },
      },
      y: {
        beginAtZero: false,
        min: 0,
        max: 100,
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          stepSize: 10,
          color: '#94A3B8',
        },
      },
    },
  };

  return (
    <Paper
      sx={{
        p: 3,
        height: '400px',
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '20px',
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#F1F5F9' }}>
        {title || `${getLabel()} History`}
      </Typography>
      <div style={{ height: '320px' }}>
        <Line data={chartData} options={options} />
      </div>
    </Paper>
  );
};

export default ScoreHistoryChart;
