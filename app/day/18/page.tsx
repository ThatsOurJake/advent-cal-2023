import MatchPairs, { GameCell } from '@/app/components/games/match-pairs';
import { generateNonce } from '@/app/utils/nonce';

const matchPairsGrid: Pick<GameCell, 'asset' | 'id'>[] = [
  {
    id: '0-0',
    asset: 'reindeer',
  },
  {
    id: '0-1',
    asset: 'reindeer',
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
    asset: 'sleigh',
  },
  {
    id: '1-0',
    asset: 'sleigh',
  },
  {
    id: '1-1',
    asset: 'wreath',
  },
  {
    id: '1-2',
    asset: 'wreath',
  },
  {
    id: '1-3',
    asset: 'cane',
  },
  {
    id: '1-4',
    asset: 'cane',
  },
];

export default function DayEighteen() {
  const nonce = generateNonce('18', 'match');

  return (
    <div>
      <p className="font-bold text-center text-4xl">18th December 2024</p>
      <p className='text-center italic my-2'>Can you match these pairs?</p>
      <MatchPairs grid={matchPairsGrid.map(x => ({ ...x, isFlipped: false }))} height={2} width={5} nonce={nonce} />
    </div>
  )
};
