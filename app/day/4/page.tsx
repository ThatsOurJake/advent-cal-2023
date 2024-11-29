import { generateNonce } from '@/app/utils/nonce';
import Wordle from '../../components/games/wordle';
import { wordles } from '../../api/submit-game/calculate-score/wordle';

export default function DayFour() {
  const nonce = generateNonce('4', 'wordle');

  return (
    <div>
      <p className="font-bold text-center text-4xl">4th December 2024</p>
      <Wordle nonce={nonce} wordle={wordles[0]} />
    </div>
  )
};
