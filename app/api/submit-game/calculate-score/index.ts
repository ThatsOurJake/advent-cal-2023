import calculateDiffScore from "./diff";
import calculateFindScore from "./find";
import calculateMatchScore from "./match";
import calculateQuizScore from "./quiz";
import calculateRiddleScore from "./riddle";
import calculateSliderScore from "./slider";
import calculateSweeperScore from "./sweeper";
import calculateWheelScore from "./wheel";
import calculateWordScore from "./word";
import calculateWordleScore from "./wordle";
import calculateWhackScore from "./whack";
import calculateCrosswordScore from "./crossword";

const CALCULATOR_MAP = {
  match: calculateMatchScore,
  word: calculateWordScore,
  riddle: calculateRiddleScore,
  diff: calculateDiffScore,
  find: calculateFindScore,
  quiz: calculateQuizScore,
  wheel: calculateWheelScore,
  wordle: calculateWordleScore,
  sweeper: calculateSweeperScore,
  slider: calculateSliderScore,
  whack: calculateWhackScore,
  crossword: calculateCrosswordScore,
} as const;

export type Game = keyof typeof CALCULATOR_MAP;

export default CALCULATOR_MAP;
