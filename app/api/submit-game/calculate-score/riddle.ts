export interface RiddlePayload  {
  wasCorrect: boolean;
}

const calculateRiddleScore = ({ wasCorrect }: RiddlePayload ): number => {
  if (wasCorrect) {
    return 50;
  }

  return 0;
};

export default calculateRiddleScore;
