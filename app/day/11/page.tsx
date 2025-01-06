import { generateNonce } from '@/app/utils/nonce';
import PresentSweeper, { type Grid } from '../../components/games/present-sweeper';

const presentSpots: Grid['presentSpots'] = [
  {
    x: 0,
    y: 0,
  },
  {
    x: 1,
    y: 4
  },
  {
    x: 5,
    y: 0
  },
  {
    x: 3,
    y: 5,
  },
  {
    x: 5,
    y: 6
  }
];

const grid: Grid = {
  width: 6,
  height: 7,
  presentSpots,
  hash: Buffer.from(JSON.stringify(presentSpots)).toString('base64'),
}

export default function DayEleven() {
  const nonce = generateNonce('11', 'sweeper');

  return (
    <div>
      <p className="font-bold text-center text-4xl">11th December 2024</p>
      <PresentSweeper nonce={nonce} grid={grid} totalTries={12} />
    </div>
  )
};
