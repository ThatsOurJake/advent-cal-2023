import MatchPairs, { GameCell } from '@/app/components/games/match-pairs';
import { generateNonce } from '@/app/utils/nonce';

const matchPairsGrid: Pick<GameCell, 'asset' | 'id'>[] = [
  {
    id: '0-0',
    asset: 'santa',
  },
  {
    id: '0-1',
    asset: 'santa',
  },
  {
    id: '0-2',
    asset: 'snowman',
  },
  {
    id: '0-3',
    asset: 'snowman',
  },
  {
    id: '0-4',
    asset: 'bauble',
  },
  {
    id: '0-5',
    asset: 'bauble',
  },
  {
    id: '0-6',
    asset: 'giftbox',
  },
  {
    id: '0-7',
    asset: 'giftbox',
  },
  {
    id: '0-8',
    asset: 'wreath',
  },
  {
    id: '0-9',
    asset: 'wreath',
  },
  {
    id: '0-10',
    asset: 'jumper',
  },
  {
    id: '0-11',
    asset: 'jumper',
  },
];

export default function DayEighteen() {
  const nonce = generateNonce('23', 'match');

  return (
    <div>
      <p className="font-bold text-center text-4xl">18th December 2024</p>
      <p className='text-center italic my-2'>Can you match these pairs?</p>
      <MatchPairs grid={matchPairsGrid.map(x => ({ ...x, isFlipped: false }))} height={3} width={4} nonce={nonce} />
    </div>
  )
};
