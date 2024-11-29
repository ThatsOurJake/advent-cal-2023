import MatchPairs, { type NonFlippedGameCell } from '@/app/components/games/match-pairs';
import { generateNonce } from '@/app/utils/nonce';

const matchPairsGrid: NonFlippedGameCell[] = [
  {
    id: '0-0',
    asset: 'jumper',
  },
  {
    id: '0-1',
    asset: 'jumper',
  },
  {
    id: '0-2',
    asset: 'gingerbread',
  },
  {
    id: '0-3',
    asset: 'gingerbread',
  },
  {
    id: '0-4',
    asset: 'snowman',
  },
  {
    id: '1-0',
    asset: 'snowman',
  },
  {
    id: '1-1',
    asset: 'tree',
  },
  {
    id: '1-2',
    asset: 'tree',
  },
  {
    id: '1-3',
    asset: 'giftbox',
  },
  {
    id: '1-4',
    asset: 'giftbox',
  },
];

export default function DayEight() {
  const nonce = generateNonce('8', 'match');

  return (
    <div>
      <p className="font-bold text-center text-4xl">8th December 2023</p>
      <p className='text-center italic my-2'>Match the pairs the quickest to score points!</p>
      <MatchPairs grid={matchPairsGrid.map(x => ({ ...x, isFlipped: false }))} height={2} width={5} nonce={nonce} />
    </div>
  )
};
