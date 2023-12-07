import calculateDiffScore from "./diff";
import calculateFindScore from "./find";
import calculateMatchScore from "./match";
import calculateQuizScore from "./quiz";
import calculateRiddleScore from "./riddle";
import calculateWheelScore from "./wheel";
import calculateWordScore from "./word";

const CALCULATOR_MAP: { [game: string]: Function } = {
  match: calculateMatchScore,
  word: calculateWordScore,
  riddle: calculateRiddleScore,
  diff: calculateDiffScore,
  find: calculateFindScore,
  quiz: calculateQuizScore,
  wheel: calculateWheelScore,
};

export default CALCULATOR_MAP;
