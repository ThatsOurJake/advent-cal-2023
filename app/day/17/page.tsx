import { generateNonce } from '@/app/utils/nonce';
import Wordle from '@/app/components/games/wordle';
import { wordles } from '@/app/api/submit-game/calculate-score/wordle';

export default function DaySeventeen() {
  const nonce = generateNonce('17', 'wordle');

  return (
    <div>
      <p className="font-bold text-center text-4xl">17th December 2024</p>
      <p className='text-center italic my-2'>Christmas Wordle!</p>
      <Wordle nonce={nonce} wordle={wordles[1]} />
    </div>
  )
};
