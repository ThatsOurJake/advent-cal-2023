import mongo from "@/app/services/mongo";
import getUser from "@/app/utils/get-user";
import ScoreGraph from "@/app/components/score-graph";
import averagePointsCalculation from "@/app/utils/average-points-calculation";
import LeaderboardRow from "@/app/components/leaderboard-row";

const Leaderboard = async () => {
  const user = await getUser();
  const scoreboard = await mongo.getScoreboard();

  const currentPosition = scoreboard.find(x => x.uuid === user.uuid)?.position || 0;
  const averagePointsToDays = averagePointsCalculation(scoreboard);

  return (
    <>
      <p className="text-center text-2xl font-bold">Leaderboard!</p>
      <div className="md:w-2/3 mx-auto my-2">
        <LeaderboardRow currentUserId={user.uuid} position={currentPosition} user={user} daysCompleted={user.daysComplete.length} />
        <div className="w-3/4 aspect-video mt-4 mx-auto">
          <ScoreGraph pointsToDays={user.pointsToDays} averagePointsToDays={averagePointsToDays} />
        </div>
        <hr className="w-2/3 h-1 mx-auto my-6 bg-gray-100 border-0 rounded" />
        <section>
          {
            scoreboard.map((x) => (
              <LeaderboardRow key={x.uuid} currentUserId={user.uuid} user={x} position={x.position || 0} daysCompleted={Object.keys(x.pointsToDays).length} />
            ))
          }
        </section>
      </div>
    </>
  );
}

export default Leaderboard;
