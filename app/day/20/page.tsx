import { generateNonce } from '@/app/utils/nonce';
import Sweeper, { type Grid } from '@/app/components/games/present-sweeper'

const presentSpots: Grid['presentSpots'] = [
  {
    x: 1,
    y: 0,
  },
  {
    x: 0,
    y: 1,
  },
  {
    x: 4,
    y: 3,
  },
  {
    x: 3,
    y: 4,
  },
  {
    x: 2,
    y: 2,
  },
]

const grid: Grid = {
  presentSpots,
  height: 5,
  width: 5,
  hash: Buffer.from(JSON.stringify(presentSpots)).toString('base64'),
}

export default function DayTwenty() {
  const nonce = generateNonce('20', 'sweeper');

  return (
    <div>
      <p className="font-bold text-center text-4xl">20th December 2024</p>
      <p className='text-center italic my-2'>Welcome to the Wordle!</p>
      <Sweeper nonce={nonce} grid={grid} totalTries={12} />
    </div>
  )
};
