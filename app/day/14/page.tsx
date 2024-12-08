import { generateNonce } from '@/app/utils/nonce';
import Wordle from '@/app/components/games/wordle';
import { wordles } from '@/app/api/submit-game/calculate-score/wordle';

export default function DayFourteen() {
  const nonce = generateNonce('14', 'wordle');

  return (
    <div>
      <p className="font-bold text-center text-4xl">14th December 2024</p>
      <Wordle nonce={nonce} wordle={wordles[2]} />
    </div>
  )
};
