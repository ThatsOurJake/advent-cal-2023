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
  ChartData,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import getPositionColour from '../utils/get-position-colour';

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
  pointsToDays?: { day: number; points: number }[];
  averagePointsToDays?: { day: string; points: number }[];
  otherUsers?: { name: string; position: number; points: { day: number; points: number }[] }[];
}

const defaultProps: ScoreGraphProps = {
  pointsToDays: [],
  averagePointsToDays: [],
  otherUsers: [],
};

const ScoreGraph = (props: ScoreGraphProps) => {
  const { averagePointsToDays, pointsToDays, otherUsers } = { ...defaultProps, ...props } as Required<ScoreGraphProps>;
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

  const data: ChartData<"line"> = {
    labels: pointsToDays.map((x) => `Day ${x.day}`),
    datasets: []
  };

  if (pointsToDays.length > 0) {
    data.datasets.push({
      label: 'Your Points',
      data: pointsToDays.map((x) => x.points),
      borderColor: '#f06292',
      backgroundColor: '#f06292',
    });
  };

  if (averagePointsToDays.length > 0) {
    data.datasets.push({
      label: 'Average Points',
      data: averagePointsToDays.map((x) => x.points),
      borderColor: '#b2dfdb',
      backgroundColor: '#b2dfdb',
    });
  };

  if (otherUsers.length > 0) {
    data.datasets.push(...otherUsers.map((x, i) => ({
      label: x.name,
      data: x.points.map((y) => y.points),
      borderColor: getPositionColour(x.position, true),
      backgroundColor: getPositionColour(x.position, true),
    })));
  }

  return (
    <>
      {
        loading && (
          <div className='w-full aspect-video flex justify-center items-center border-2 border-black rounded-base bg-main shadow-light animate-pulse'>
            <p className='text-2xl font-bold text-white'>Loading Scores...</p>
          </div>
        )
      }
      <div className={`${loading ? 'hidden' : 'visible'}`}>
        <div className='w-full aspect-video border-2 border-black rounded-base bg-white px-4 py-2'>
          <Line data={data} options={options} />
        </div>
      </div>
    </>
  );
};

export default ScoreGraph;
