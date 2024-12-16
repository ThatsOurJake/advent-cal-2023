export interface WhackPayload {
  elvesWhacked: number;
  deersWhacked: number;
}

const DEER_PENALTY = 50;
const ELF_REWARD = 75;

const calculateWhackScore = ({ deersWhacked, elvesWhacked }: WhackPayload): number => {
  const score = elvesWhacked * ELF_REWARD - deersWhacked * DEER_PENALTY;

  if (score < 0) {
    return 0;
  }

  return score;
};

export default calculateWhackScore;
