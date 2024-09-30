import Link from "next/link";

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
    <div className="text-center">
      <p className="text-2xl py-2 font-bold">You have already completed this game!</p>
      <p className="py-2">You gained <b>{points}</b> points 👏🏻</p>
      <Link href="/" className="text-blue-500 hover:underline">Take me home!</Link>
    </div>
  )
};

export default AlreadyCompleted;
