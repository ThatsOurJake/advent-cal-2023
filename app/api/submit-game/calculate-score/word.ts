export interface WordPayload {
  timeTaken: number;
  numberCorrect: number;
}

const calculateWordScore = ({ timeTaken, numberCorrect }: WordPayload): number => {
  const baseScore = numberCorrect * 25;

  if (timeTaken < 60) {
    return baseScore + 75;
  } else if (timeTaken < 90) {
    return baseScore + 35;
  }

  return baseScore + 25;
};

export default calculateWordScore;
