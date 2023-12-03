export interface MatchPayload {
  timeTaken: number;
}

const calculateMatchScore = ({ timeTaken }: MatchPayload): number => {
  if (timeTaken <= 20) {
    return 100;
  } else if (timeTaken <= 30) {
    return 50;
  }

  return 25;
};

export default calculateMatchScore;
