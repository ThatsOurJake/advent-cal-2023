import { generateNonce } from '@/app/utils/nonce';
import Wordle from '@/app/components/games/wordle';
import { wordles } from '@/app/api/submit-game/calculate-score/wordle';

export default function DayTwenty() {
  const nonce = generateNonce('20', 'wordle');

  return (
    <div>
      <p className="font-bold text-center text-4xl">20th December 2024</p>
      <p className='text-center italic my-2'>Welcome to the Wordle!</p>
      <Wordle nonce={nonce} wordle={wordles[2]} />
    </div>
  )
};
