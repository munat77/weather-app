'use client';

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
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useTheme } from 'next-themes';

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

interface TemperatureChartProps {
  hourlyData: {
    time: string;
    temperature: number;
  }[];
}

export function TemperatureChart({ hourlyData }: TemperatureChartProps) {
  const { theme } = useTheme();
  
  const isDark = theme === 'dark';
  const textColor = isDark ? 'white' : 'black';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const lineColor = isDark ? 'rgb(59, 130, 246)' : 'rgb(37, 99, 235)';
  const fillColor = isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(37, 99, 235, 0.1)';

  const data = {
    labels: hourlyData.map(data => data.time),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: hourlyData.map(data => data.temperature),
        borderColor: lineColor,
        backgroundColor: fillColor,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: lineColor,
        pointBorderColor: isDark ? 'rgb(30, 41, 59)' : 'white',
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Today's Temperature",
        color: textColor,
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        backgroundColor: isDark ? 'rgb(30, 41, 59)' : 'white',
        titleColor: textColor,
        bodyColor: textColor,
        borderColor: isDark ? 'rgb(71, 85, 105)' : 'rgb(209, 213, 219)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
        },
      },
      y: {
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
          callback: function(tickValue: string | number) {
            return tickValue + '°C';
          },
        },
      },
    },
  };

  return (
    <div className="bg-card rounded-lg p-6 border">
      <div className="h-64">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}