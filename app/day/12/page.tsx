import { generateNonce } from '@/app/utils/nonce';
import MatchPairs, { GameCell } from '../../components/games/match-pairs';
import generateMatchCells from '../../utils/generate-match-cells';

const WIDTH = 4;
const HEIGHT = 3;

const grid = generateMatchCells(WIDTH, HEIGHT, [
  'bauble',
  'giftbox',
  'snowman',
  'gingerbread',
  'tree',
  'reindeer'
]);

export default function DayTwelve() {
  const nonce = generateNonce('12', 'match');


  return (
    <div>
      <p className="font-bold text-center text-4xl">12th December 2024</p>
      <MatchPairs nonce={nonce} grid={grid} height={HEIGHT} width={WIDTH} />
    </div>
  )
};
