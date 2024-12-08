import { generateNonce } from '@/app/utils/nonce';

import Quiz, { Question } from '@/app/components/games/quiz';

const questions: Question[] = [
  {
    question: 'What is the name of the red-nosed reindeer?',
    answers: [
      'Dasher',
      'Prancer',
      'Rudolph',
      'Vixen',
    ],
    answer: 'cnVkb2xwaA=='
  },
  {
    question: 'What was the other gift given to Jesus, Gold, Myrrh and...?',
    answers: [
      'Silver',
      'Frankincense',
      'Bronze',
      'Copper',
    ],
    answer: 'ZnJhbmtpbmNlbnNl'
  },
  {
    question: 'What is the name of the Grinch\'s dog?',
    answers: [
      'Max',
      'Rex',
      'Buddy',
      'Rufus',
    ],
    answer: 'bWF4'
  }
];

export default function DaySixteen() {
  const nonce = generateNonce('16', 'quiz');

  return (
    <div>
      <p className="font-bold text-center text-4xl">16th December 2024</p>
      <Quiz nonce={nonce} questions={questions} />
    </div>
  )
};
