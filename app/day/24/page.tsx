import { generateNonce } from '@/app/utils/nonce';
import type { WordAnswer } from '@/app/components/games/guess-word';

const words: WordAnswer[] = [
  {
    answer: 'c3RvY2tpbmc=',
    missingLetters: [
      [0, 3, 6],
      [1, 4, 6],
    ],
  },
  {
    answer: 'Y2FuZHktY2FuZQ==',
    missingLetters: [
      [0, 3, 7, 9],
    ],
  },
  {
    answer: 'c25vd21hbg==',
    missingLetters: [
      [1, 4, 5],
      [0, 3, 5, 6],
    ],
  },
];

import dynamic from 'next/dynamic'
 
const GuessWord = dynamic(() => import('@/app/components/games/guess-word'), { ssr: false })

export default function DayTwelve() {
  const nonce = generateNonce('24', 'word');

  return (
    <div>
      <p className="font-bold text-center text-4xl">24th December 2024</p>
      <p className='text-center italic my-2'>Christmas Eve ✨</p>
      <GuessWord words={words} nonce={nonce} />
    </div>
  )
};
