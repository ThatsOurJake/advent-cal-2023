import { generateNonce } from '@/app/utils/nonce';
import type { WordAnswer } from '@/app/components/games/guess-word';

const words: WordAnswer[] = [
  {
    answer: 'YmF1Ymxl',
    missingLetters: [
      [0, 2, 5],
      [1, 3],
    ],
  },
  {
    answer: 'c25vd2ZsYWtl',
    missingLetters: [
      [0, 3, 5, 7],
      [1, 4, 6, 7],
    ],
  },
  {
    answer: 'cnVkb2xwaA==',
    missingLetters: [
      [0, 2, 4, 7],
      [1, 4, 6],
    ],
  },
];

import dynamic from 'next/dynamic'
 
const GuessWord = dynamic(() => import('@/app/components/games/guess-word'), { ssr: false })

export default function DayTwelve() {
  const nonce = generateNonce('12', 'word');

  return (
    <div>
      <p className="font-bold text-center text-4xl">12th December 2024</p>
      <p className='text-center italic my-2'>Guess the word from the missing letters</p>
      <GuessWord words={words} nonce={nonce} />
    </div>
  )
};
