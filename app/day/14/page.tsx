import shuffleArray from 'shuffle-array';

import { generateNonce } from '@/app/utils/nonce';
import type { Question } from '@/app/components/games/quiz';
import Quiz from '@/app/components/games/quiz';

const questions: Question[] = [
  {
    question: 'Which Christmas song contains the lyric "Everyone dancing merrily in the new old-fashioned way?"',
    answer: 'cm9ja2luZyBhcm91bmQgdGhlIGNocmlzdG1hcyB0cmVl',
    answers: ['Ding Dong Merrily on High', 'Rocking Around The Christmas Tree', 'Last Christmas', 'Deck the halls']
  },
  {
    question: 'What was the highest-grossing Christmas movie of all time?',
    answer: 'aG9tZSBhbG9uZQ==',
    answers: ['Die Hard', 'Polar Express', 'Home Alone', 'Arthur Christmas']
  },
  {
    question: 'What is the name of the last ghost that visits Scrooge in A Christmas Carol?',
    answer: 'Z2hvc3Qgb2YgY2hyaXN0bWFzIHlldCB0byBjb21l',
    answers: ['Ghost of Christmas Future', 'Ghost of Christmas the pure heart', 'Dave', 'Ghost of Christmas Yet To Come']
  },
  {
    question: 'What was Frosty the Snowman\'s nose made out?',
    answer: 'YSBidXR0b24=',
    answers: ['A Button', 'Lump of Coal', 'A Stone', 'A Carrot']
  }
];

export default function DayFourteen() {
  const nonce = generateNonce('14', 'quiz');

  return (
    <div>
      <p className="font-bold text-center text-4xl">14th December 2024</p>
      <p className='text-center italic my-2'>Wizzy Quizzy!</p>
      <Quiz nonce={nonce} questions={shuffleArray(questions)} />
    </div>
  )
};
