import { generateNonce } from '@/app/utils/nonce';
import Wordle from '@/app/components/games/wordle';
import { wordles } from '@/app/api/submit-game/calculate-score/wordle';

export default function DayTwentyTwo() {
  const nonce = generateNonce('22', 'wordle');

  return (
    <div>
      <p className="font-bold text-center text-4xl">22nd December 2024</p>
      <Wordle nonce={nonce} wordle={wordles[3]} />
    </div>
  )
};
