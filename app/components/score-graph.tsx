'use client';

import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ScoreGraphProps {
  pointsToDays: { day: string; points: number }[];
}

const ScoreGraph = ({ pointsToDays }: ScoreGraphProps) => {
  const [loading, setLoading] = useState(true);

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Points Earned Per Day',
      },
    },
    animation: {
      duration: 0,
      onComplete: () => { setLoading(false); }
    }
  };

  const data = {
    labels: pointsToDays.map((x) => `Day ${x.day}`),
    datasets: [
      {
        label: 'Points',
        data: pointsToDays.map((x) => x.points),
        borderColor: '#f57c00',
        backgroundColor: '#f57c00',
      }
    ]
  };

  return (
    <>
      {
        loading && (
          <div className='bg-slate-100 animate-pulse w-full h-full flex items-center justify-center'>
            <p className='text-2xl font-bold'>Loading Scores...</p>
          </div>
        )
      }
      <div className={`${loading ? 'hidden' : 'visible'}`}>
        <Line data={data} options={options} />
      </div>
    </>
  );
};

export default ScoreGraph;
