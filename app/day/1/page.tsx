import MatchPairs, { GameCell } from '@/app/components/games/match-pairs';
import { generateNonce } from '@/app/utils/nonce';

const matchPairsGrid: Pick<GameCell, 'asset' | 'id'>[] = [
  {
    id: '0-0',
    asset: 'bauble',
  },
  {
    id: '0-1',
    asset: 'bauble',
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
    id: '1-0',
    asset: 'sleigh',
  },
  {
    id: '1-1',
    asset: 'sleigh',
  },
  {
    id: '1-2',
    asset: 'wreath',
  },
  {
    id: '1-3',
    asset: 'wreath',
  },
];

export default function DayOne() {
  const nonce = generateNonce('1', 'match');

  return (
    <div>
      <p className="font-bold text-center text-4xl">1st December 2023</p>
      <p className='text-center italic my-2'>Match the pairs the quickest to score points!</p>
      <MatchPairs grid={matchPairsGrid.map(x => ({ ...x, isFlipped: false }))} height={2} width={4} nonce={nonce} />
    </div>
  )
};
