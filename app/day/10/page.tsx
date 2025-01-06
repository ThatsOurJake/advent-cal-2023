import { generateNonce } from '@/app/utils/nonce';
import GuessWord, { type WordAnswer } from '../../components/games/guess-word';

const answers: WordAnswer[] = [
  {
    answer: 'bWFuZ2Vy',
    missingLetters: [
      [0, 3, 5],
      [1, 3, 5]
    ],
  },
  {
    answer: 'Z29sZA==',
    missingLetters: [
      [1, 3],
    ],
  }
];

export default function DayTen() {
  const nonce = generateNonce('10', 'word');

  return (
    <div>
      <p className="font-bold text-center text-4xl">10th December 2024</p>
      <GuessWord nonce={nonce} words={answers} />
    </div>
  )
};
