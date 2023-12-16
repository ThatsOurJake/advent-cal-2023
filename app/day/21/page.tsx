import shuffleArray from 'shuffle-array';

import { generateNonce } from '@/app/utils/nonce';
import Riddle, { type RiddleDIO } from '@/app/components/games/riddle';

const ridd: RiddleDIO = {
  answer: 'Y2hyaXN0bWFzIGxpZ2h0cw==',
  options: shuffleArray(['Christmas Ornaments', 'Christmas Stocking', 'Christmas Bells', 'Christmas Lights']),
  question: 'Shiny and bright, these colourful objects illuminate up the night. What are they?'
};

export default function DayTwentyOne() {
  const nonce = generateNonce('21', 'riddle');

  return (
    <div>
      <p className="font-bold text-center text-4xl">21st December 2023</p>
      <p className='text-center italic my-2'>Can you answer this riddle?</p>
      <Riddle nonce={nonce} riddle={ridd} />
    </div>
  )
};
