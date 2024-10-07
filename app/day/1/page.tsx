import { generateNonce } from '@/app/utils/nonce';
import PresentSweeper, { Grid } from '@/app/components/games/present-sweeper';

const presentSpots: Grid['presentSpots'] = [{
  x: 1,
  y: 1,
}, {
  x: 2,
  y: 2,
}, {
  x: 3,
  y: 3,
}];

const grid: Grid = {
  width: 5,
  height: 7,
  presentSpots,
  hash: Buffer.from(JSON.stringify(presentSpots)).toString('base64'),
}

export default function DayOne() {
  const nonce = generateNonce('1', 'sweeper');
  const totalTries = grid.presentSpots.length * 3;

  return (
    <div>
      <p className="font-bold text-center text-2xl">1st December 2024</p>
      <PresentSweeper nonce={nonce} grid={grid} totalTries={totalTries}/>
    </div>
  )
};
