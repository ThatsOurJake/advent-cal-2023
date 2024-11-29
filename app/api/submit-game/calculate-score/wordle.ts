export interface WorldePayload {
  attemptsTaken: number;
  wordleId: string;
  wasCorrect: boolean;
}

export interface Wordle {
  wordleId: string;
  answer: string;
  maxGuesses: number;
}

export const wordles: Wordle[] = [
  {
    wordleId: 'wordle-1',
    answer: 'eggnog',
    maxGuesses: 7,
  },
  {
    wordleId: 'wordle-2',
    answer: 'tinsel',
    maxGuesses: 7,
  },
];

const calculateWordleScore = ({ attemptsTaken, wordleId, wasCorrect }: WorldePayload): number => {
  const wordle = wordles.find(x => x.wordleId === wordleId);

  if (!wordle) {
    return 0;
  }

  const { answer, maxGuesses } = wordle;

  if (attemptsTaken > maxGuesses || !wasCorrect) {
    return 0;
  }

  const attemptsMultiplier = 20;
  const wordLengthMultiplier = 10;

  return (answer.length * wordLengthMultiplier) + ((maxGuesses * attemptsMultiplier) - (attemptsTaken * attemptsMultiplier))
};

export default calculateWordleScore;
