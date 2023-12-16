import shuffleArray from 'shuffle-array';

import { generateNonce } from '@/app/utils/nonce';
import Riddle, { type RiddleDIO } from '@/app/components/games/riddle';

const ridd: RiddleDIO = {
  answer: 'Y2hyaXN0bWFzIGNhbmRsZQ==',
  options: shuffleArray(['Christmas Yule Log', 'Christmas Stocking', 'Christmas Candle', 'Candy-Cane']),
  question: 'I am tall when I am young, and I am short when I am old. What am I?'
};

export default function DayThirteen() {
  const nonce = generateNonce('13', 'riddle');

  return (
    <div>
      <p className="font-bold text-center text-4xl">13th December 2023</p>
      <p className='text-center italic my-2'>Can you answer this riddle?</p>
      <Riddle nonce={nonce} riddle={ridd} />
    </div>
  )
};
