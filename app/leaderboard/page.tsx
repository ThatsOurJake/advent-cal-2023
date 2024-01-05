import mongo from "@/app/services/mongo";
import getUser from "@/app/utils/get-user";
import ScoreGraph from "../components/score-graph";
import averagePointsCalculation from "../utils/average-points-calculation";
import LeaderboardRow from "../components/leaderboard-row";

const Leaderboard = async () => {
  const user = await getUser();
  const scoreboard = await mongo.getScoreboard();

  const currentPosition = scoreboard.find(x => x.uuid === user.uuid)?.position || 0;

  const averagePointsToDays = averagePointsCalculation(scoreboard);

  return (
    <main className="relative bg-black min-w-screen min-h-screen">
      <div aria-hidden className="absolute inset-0 h-full w-full bg-cover blur-sm" style={{ backgroundImage: `url('/background.jpg')`}} />
      <div className="py-2 z-10 relative w-full md:w-1/2 mx-auto bg-white p-4 min-h-screen">
        <p className="text-4xl text-center mb-4">Leaderboard!</p>
        <div className="md:w-2/3 mx-auto">
          <LeaderboardRow currentUserId={user.uuid} position={currentPosition} user={user} />
          <div className="w-full aspect-video mt-4">
            <ScoreGraph pointsToDays={user.pointsToDays} averagePointsToDays={averagePointsToDays} />
          </div>
          <hr className="w-2/3 h-1 mx-auto my-6 bg-gray-100 border-0 rounded dark:bg-gray-700" />
          <section>
            {
              scoreboard.map((x) => (
                <LeaderboardRow key={x.uuid} currentUserId={user.uuid} user={x} position={x.position || 0} />
              ))
            }
          </section>
        </div>
      </div>
    </main>
  );
}

export default Leaderboard;
