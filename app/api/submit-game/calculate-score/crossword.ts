export interface CrosswordPayload {
  puzzleId: string;
  timeStarted: number;
}

export interface Word {
  hint: string;
  answer: string;
  x: number;
  y: number;
  isAcross?: boolean; // true if the answer is across, false if the answer is down
  hintNumber: number;
}

export interface Puzzle {
  puzzleId: string;
  words: Word[];
  width: number;
  height: number;
}

export const puzzles: Puzzle[] = [
  {
    puzzleId: "xxx-yyy-1111",
    width: 15,
    height: 11,
    words: [
      {
        hint: "Spiced cookie often shaped like people",
        answer: "gingerbread",
        x: 5,
        y: 0,
        isAcross: false,
        hintNumber: 1,
      },
      {
        hint: 'Creamy holiday drink',
        answer: 'eggnog',
        x: 5,
        y: 8,
        isAcross: true,
        hintNumber: 2,
      },
      {
        hint: 'Light source often used in Advent',
        answer: 'candle',
        x: 0,
        y: 4,
        isAcross: true,
        hintNumber: 3,
      },
      {
        hint: 'A toy soldier that cracks nuts',
        answer: 'nutcracker',
        x: 5,
        y: 2,
        isAcross: true,
        hintNumber: 4,
      },
      {
        hint: 'Jolly man in a red suit who brings gifts',
        answer: 'santa',
        x: 1,
        y: 3,
        isAcross: false,
        hintNumber: 5,
      },
      {
        hint: 'Circular decoration made of evergreens',
        answer: 'wreath',
        x: 13,
        y: 0,
        isAcross: false,
        hintNumber: 6,
      },
      {
        hint: 'Santa’s preferred mode of transportation',
        answer: 'sleigh',
        x: 10,
        y: 4,
        isAcross: false,
        hintNumber: 7,
      }
    ],
  }
];

const minTimeLength = 5 * 1000; // 5 seconds

const letterMultiplier = 5;
const wordMultiplier = 10;

const calculateCrosswordScore = ({ puzzleId, timeStarted }: CrosswordPayload): number => {
  const timeTaken = Date.now() - timeStarted;
  const puzzle = puzzles.find((x) => x.puzzleId === puzzleId);

  if (!puzzle) {
    return 0;
  }

  const { words } = puzzle;

  const minTimeTaken = words.length * minTimeLength;

  if (timeTaken < minTimeTaken) {
    return 0;
  }

  let score = 0;

  words.forEach((word) => {
    const { answer } = word;

    score += answer.length * letterMultiplier;
  });

  score += words.length * wordMultiplier;

  return score;
};

export default calculateCrosswordScore;
