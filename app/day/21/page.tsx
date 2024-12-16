import { generateNonce } from '@/app/utils/nonce';
import Crossword from '@/app/components/games/crossword';
import { puzzles } from '@/app/api/submit-game/calculate-score/crossword';

export default function DayTwentyOne() {
  const nonce = generateNonce('21', 'crossword');

  return (
    <div>
      <p className="font-bold text-center text-4xl">21st December 2024</p>
      <Crossword nonce={nonce} puzzle={puzzles[0]} />
    </div>
  )
};
