import calculateMatchScore from "./match";

const CALCULATOR_MAP: { [game: string]: Function } = {
  match: calculateMatchScore,
};

export default CALCULATOR_MAP;
