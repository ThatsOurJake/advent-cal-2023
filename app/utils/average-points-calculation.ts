import type { ScoreboardUser } from "../services/mongo";

const averagePointsCalculation = (scoreboard: ScoreboardUser[]) => {
  return scoreboard.reduce((acc: { day: string; points: number, count: number }[], current) => {
    const { pointsToDays } = current;
    const copy = [...acc];

    pointsToDays.forEach((x) => {
      const index = copy.findIndex(y => y.day === x.day);

      if (index === -1) {
        copy.push({ day: x.day, points: x.points, count: 1 });
        return;
      }

      copy[index].points += x.points;
      copy[index].count += 1;
    });

    return copy;
  }, []).map(x => ({
    ...x,
    points: Math.ceil(x.points / x.count),
  }));
};

export default averagePointsCalculation;
