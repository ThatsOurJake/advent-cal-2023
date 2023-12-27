import sumArray from "@/app/utils/sum-arr";

export interface Answer {
  wasCorrect: boolean;
  timeTaken: number
}

export interface QuizPayload {
  answers: Answer[];
}

const calculateQuizScore = ({ answers }: QuizPayload): number => {
  return sumArray(answers.map(x => {
    const { timeTaken, wasCorrect } = x;

    if (!wasCorrect) {
      return 0;
    }

    if (timeTaken < 10) {
      return 50;
    } else if (timeTaken < 20) {
      return 25;
    }

    return 10;
  }));
};

export default calculateQuizScore;
