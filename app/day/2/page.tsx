import { generateNonce } from '@/app/utils/nonce';
import type { WordAnswer } from '@/app/components/games/guess-word';

const words: WordAnswer[] = [
  {
    answer: 'Y2hyaXN0bWFz',
    missingLetters: [
      [0, 3, 4, 5, 7],
      [1, 4, 6, 8],
    ],
  },
  {
    answer: 'YW5nZWw=',
    missingLetters: [
      [1, 3],
      [0, 3],
    ],
  },
  {
    answer: 'bWlzdGxldG9l',
    missingLetters: [
      [1, 3, 5, 7],
      [0, 2, 4, 6, 8],
    ],
  },
];

import dynamic from 'next/dynamic'
 
const GuessWord = dynamic(() => import('@/app/components/games/guess-word'), { ssr: false })

export default function DayTwo() {
  const nonce = generateNonce('2', 'word');

  return (
    <div>
      <p className="font-bold text-center text-4xl">2nd December 2023</p>
      <p className='text-center italic my-2'>Guess the word from the missing letters</p>
      <GuessWord words={words} nonce={nonce} />
    </div>
  )
};
