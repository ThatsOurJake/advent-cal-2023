import { generateNonce } from '@/app/utils/nonce';
import Wordle from '@/app/components/games/wordle';
import { wordles } from '@/app/api/submit-game/calculate-score/wordle';

export default function DayEleven() {
  const nonce = generateNonce('11', 'wordle');

  return (
    <div>
      <p className="font-bold text-center text-4xl">11th December 2023</p>
      <p className='text-center italic my-2'>Christmas Wordle!</p>
      <Wordle nonce={nonce} wordle={wordles[0]} />
    </div>
  )
};
