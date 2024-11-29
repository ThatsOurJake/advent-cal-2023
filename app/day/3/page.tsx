import shuffleArray from 'shuffle-array';

import { generateNonce } from '@/app/utils/nonce';
import Riddle, { type RiddleDIO } from '@/app/components/games/riddle';

const ridd: RiddleDIO = {
  answer: 'YWR2ZW50IGNhbGVuZGFy',
  options: shuffleArray(['Advent Calendar', 'Postbox', 'Christmas Cracker', 'Wreath']),
  question: 'Open me every day for something that can\'t be beat. Behind each of the doors, you will discover a tasty treat. What am I?'
};

export default function DayThree() {
  const nonce = generateNonce('3', 'riddle');

  return (
    <div>
      <p className="font-bold text-center text-4xl">3rd December 2024</p>
      <Riddle nonce={nonce} riddle={ridd} />
    </div>
  )
};
