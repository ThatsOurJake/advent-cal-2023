export interface DiffPayload {
  timeTaken: number;
  correctGuesses: number;
}

const calculateDiffScore = ({ timeTaken, correctGuesses }: DiffPayload): number => {
  const baseScore = correctGuesses * 25;

  if (timeTaken < 60) {
    return baseScore + 50;
  } else if (timeTaken < 120) {
    return baseScore + 25;
  }

  return baseScore + 10;
};

export default calculateDiffScore;
