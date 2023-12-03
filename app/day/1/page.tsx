import MatchPairs, { GameCell } from '@/app/components/games/match-pairs';
import { generateNonce } from '@/app/utils/nonce';

const matchPairsGrid: GameCell[] = [
  {
    id: '0-0',
    asset: 'bauble',
    isFlipped: false,
  },
  {
    id: '0-1',
    asset: 'bauble',
    isFlipped: false,
  },
  {
    id: '0-2',
    asset: 'gingerbread',
    isFlipped: false,
  },
  {
    id: '0-3',
    asset: 'gingerbread',
    isFlipped: false,
  },
  {
    id: '1-0',
    asset: 'sleigh',
    isFlipped: false,
  },
  {
    id: '1-1',
    asset: 'sleigh',
    isFlipped: false,
  },
  {
    id: '1-2',
    asset: 'wreath',
    isFlipped: false,
  },
  {
    id: '1-3',
    asset: 'wreath',
    isFlipped: false,
  },
];

export default function DayOne() {
  const nonce = generateNonce('1', 'match');

  return (
    <div data-nonce={nonce}>
      <p className="font-bold text-center text-4xl">1st December 2023</p>
      <p className='text-center italic my-2'>Match the pairs the quickest to score points!</p>
      <MatchPairs grid={matchPairsGrid} height={2} width={4} nonce={nonce} />
    </div>
  )
};
