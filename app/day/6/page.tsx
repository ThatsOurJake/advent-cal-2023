import { generateNonce } from '@/app/utils/nonce';
import PresentSweeper, { type Grid } from '@/app/components/games/present-sweeper';

const presentSpots: Grid['presentSpots'] = [
  {
    x: 1,
    y: 0,
  },
  {
    x: 4,
    y: 0,
  },
  {
    x: 3,
    y: 3,
  },
  {
    x: 1,
    y: 3,
  }
];

const grid: Grid = {
  width: 5,
  height: 5,
  presentSpots,
  hash: Buffer.from(JSON.stringify(presentSpots)).toString('base64'),
};

export default function DaySix() {
  const nonce = generateNonce('6', 'sweeper');

  return (
    <div>
      <p className="font-bold text-center text-4xl">6th December 2024</p>
      <PresentSweeper nonce={nonce} grid={grid} totalTries={8} />
    </div>
  )
};
