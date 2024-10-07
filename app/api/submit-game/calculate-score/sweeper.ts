import { Grid } from "../../../components/games/present-sweeper";

export interface SweeperPayload {
  presentsFound: number;
  gameHash: string;
  triesLeft: number;
};

const SCORE_PER_PRESENT = 25;
const SCORE_PER_TRY = 5;

const calculateSweeperScore = ({ gameHash, presentsFound, triesLeft }: SweeperPayload): number => {
  const [gridHash, selectedCellsHash] = gameHash.split('|');

  const grid = JSON.parse(Buffer.from(gridHash, 'base64').toString('utf-8')) as Grid['presentSpots'];
  const selectedCells = JSON.parse(Buffer.from(selectedCellsHash, 'base64').toString('utf-8')) as { x: number, y: number }[];

  const selectedCellsContainsAllPresents = grid.every(({ x, y }) => selectedCells.some(cell => cell.x === x && cell.y === y));

  if (!selectedCellsContainsAllPresents) {
    return 0;
  }

  return (SCORE_PER_PRESENT * presentsFound) + (SCORE_PER_TRY * triesLeft);
};

export default calculateSweeperScore;
