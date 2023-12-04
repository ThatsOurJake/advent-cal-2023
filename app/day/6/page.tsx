import shuffleArray from 'shuffle-array';

import { generateNonce } from '@/app/utils/nonce';
import Riddle, { type RiddleDIO } from '@/app/components/games/riddle';

const ridd: RiddleDIO = {
  answer: 'c25vd2dsb2Jl',
  options: shuffleArray(['Wreath', 'Snowglobe', 'Skis', 'Wine']),
  question: 'You can hold me and shake me, but I\'m easy to break. I have lots of snow, even though it\'s all fake! What am I?'
};

export default function DaySix() {
  const nonce = generateNonce('6', 'riddle');

  return (
    <div>
      <p className="font-bold text-center text-4xl">6th December 2023</p>
      <p className='text-center italic my-2'>Can you answer this riddle?</p>
      <Riddle nonce={nonce} riddle={ridd} />
    </div>
  )
};
