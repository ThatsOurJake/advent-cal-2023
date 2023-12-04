import shuffleArray from 'shuffle-array';

import { generateNonce } from '@/app/utils/nonce';
import Riddle, { type RiddleDIO } from '@/app/components/games/riddle';

const ridd: RiddleDIO = {
  answer: 'd3JlYXRo',
  options: shuffleArray(['Wreath', 'Mistletoe', 'Christmas Tree', 'Ornament']),
  question: 'I can be made from evergreens, pine cones, or berries, and I am round. On the front door of someone\'s house, at Christmastime I am found. What am I?'
};

export default function DayThree() {
  const nonce = generateNonce('3', 'riddle');

  return (
    <div>
      <p className="font-bold text-center text-4xl">3rd December 2023</p>
      <p className='text-center italic my-2'>Can you answer this riddle?</p>
      <Riddle nonce={nonce} riddle={ridd} />
    </div>
  )
};
