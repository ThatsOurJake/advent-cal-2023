import shuffleArray from 'shuffle-array';

import { generateNonce } from '@/app/utils/nonce';
import type { Question } from '@/app/components/games/quiz';
import Quiz from '@/app/components/games/quiz';

const questions: Question[] = [
  {
    question: 'How many ghosts show up in A Christmas Carol?',
    answer: 'Zm91cg==',
    answers: ['One', 'Three', 'Four', 'Two']
  },
  {
    question: 'Elvis isn\'t going to have a white Christmas he\'s going to have a _',
    answer: 'Ymx1ZSBjaHJpc3RtYXM=',
    answers: ['Blue Christmas', 'Bad Christmas', 'Happy Christmas', 'Meh Christmas']
  },
  {
    question: 'Which country did eggnog come from?',
    answer: 'ZW5nbGFuZA==',
    answers: ['Germany', 'Ireland', 'Spain', 'England']
  },
  {
    question: 'According to the song, what did my true love give to me on the eighth day of Christmas?',
    answer: 'bWFpZHMgbWlsa2luZw==',
    answers: ['Maids Milking', 'Lords Leaping', 'Geese Laying', 'Pipers Piping']
  }
];

export default function DaySeven() {
  const nonce = generateNonce('7', 'quiz');

  return (
    <div>
      <p className="font-bold text-center text-4xl">7th December 2023</p>
      <p className='text-center italic my-2'>Lets gets quizzy!</p>
      <Quiz nonce={nonce} questions={shuffleArray(questions)} />
    </div>
  )
};
