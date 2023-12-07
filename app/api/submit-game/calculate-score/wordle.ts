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
    answer: 'santa',
    maxGuesses: 6,
  }
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

  return (answer.length * 10) + (120 - (attemptsTaken * 20))
};

export default calculateWordleScore;
