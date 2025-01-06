import { generateNonce } from '@/app/utils/nonce';
import MatchPairs from '@/app/components/games/match-pairs';
import generateMatchCells from '@/app/utils/generate-match-cells';

const WIDTH = 4;
const HEIGHT = 2;
const grid = generateMatchCells(WIDTH, HEIGHT, [
  'sleigh',
  'gingerbread',
  'snowman',
  'tree'
]);

export default function DayTwo() {
  const nonce = generateNonce('2', 'match');

  return (
    <div>
      <p className="font-bold text-center text-4xl">2nd December 2024</p>
      <MatchPairs nonce={nonce} grid={grid} height={HEIGHT} width={WIDTH} />
    </div>
  )
};
