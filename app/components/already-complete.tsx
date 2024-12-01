import Link from "next/link";
import Alert from "./alert";

interface AlreadyCompletedProps {
  daysToPoints: {
    day: number;
    points: number;
  }[];
  day: number;
}

const AlreadyCompleted = ({ daysToPoints, day }: AlreadyCompletedProps) => {
  const points = daysToPoints.find(x => x.day === day)!.points;

  return (
    <Alert type="success">
      <p className="text-2xl font-bold">You have already completed this game!</p>
      {
        points > 0 && (
          <p className="text-base">You gained <b>{points}</b> points 👏🏻</p>
        )
      }
      {
        points === 0 && (
          <p className="text-base">You gained no points for this game 🤷🏻‍♂️</p>
        )
      }
      <Link href="/" className="text-blue-500 hover:underline">Take me home!</Link>
    </Alert>
  )
};

export default AlreadyCompleted;
