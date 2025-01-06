export interface SliderPayload  {
  size: number;
  numberOfMoves: number;
}

const calculateSliderScore = ({ numberOfMoves, size }: SliderPayload ): number => {
  const calculatedNumberOfMoves = Math.pow((size * size), 2) * 2;

  if (numberOfMoves == -1) {
    // Given up score
    return 50;
  }

  if (numberOfMoves <= calculatedNumberOfMoves) {
    return 150;
  }

  return 75;
};

export default calculateSliderScore;
