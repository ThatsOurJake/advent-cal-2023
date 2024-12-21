import MatchPairs from '@/app/components/games/match-pairs';
import { generateNonce } from '@/app/utils/nonce';
import generateMatchCells from '@/app/utils/generate-match-cells';

const grid = generateMatchCells(3, 4, ['bauble', 'sleigh', 'giftbox', 'reindeer', 'jumper', 'tree']);

export default function DayTwentyThree() {
  const nonce = generateNonce('23', 'match');

  return (
    <div>
      <p className="font-bold text-center text-4xl">23rd December 2024</p>
      <MatchPairs grid={grid} height={3} width={4} nonce={nonce} />
    </div>
  )
};
