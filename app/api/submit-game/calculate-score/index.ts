import calculateMatchScore from "./match";
import calculateRiddleScore from "./riddle";
import calculateWordScore from "./word";

const CALCULATOR_MAP: { [game: string]: Function } = {
  match: calculateMatchScore,
  word: calculateWordScore,
  riddle: calculateRiddleScore,
};

export default CALCULATOR_MAP;
