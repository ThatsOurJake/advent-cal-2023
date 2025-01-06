'use server';

import getUser from '@/app/utils/get-user';
import mongo from '@/app/services/mongo';
import averagePointsCalculation from '@/app/utils/average-points-calculation';
import LeaderboardRow from '@/app/components/leaderboard-row';
import ScoreGraph from '@/app/components/score-graph';
import HomeBanner from '@/app/components/home-banner';
import suffixOrdinalString from '@/app/utils/ordinal-str';

export default async function HomeClosed() {
  const user = await getUser();
  const scoreboard = await mongo.getScoreboard();
  const position = scoreboard.find(x => x.uuid === user.uuid)?.position || 0;
  
  const topThree = scoreboard.filter(x => x.position && x.position <= 3).sort((a, b) => a.position! - b.position!);
  const averagePointsToDays = averagePointsCalculation(scoreboard);
  const topThreePoints = topThree.map((x) => ({ name: x.name, position: x.position!, points: x.pointsToDays }));

  const positionStr = suffixOrdinalString(position);

  return (
    <div className='mb-12'>
      <div className='flex flex-row gap-x-2 justify-center'>
        <div>
          <p className='font-bold text-lg'>{user.name} - {user.squad}</p>
        </div>
        <span>•</span>
        <div>
          <p className='font-bold text-lg'>{user.points} Points ✨</p>
        </div>
        <span>•</span>
        <div>
          {
            position > 0 && (
              <p className='font-bold text-lg'>{positionStr} Place</p>
            )
          }
          {
            position === 0 && (
              <p className='font-bold text-lg'>Not Ranked</p>
            )
          }
        </div>
      </div>
      <div className='my-4 w-4/5 mx-auto'>
        <HomeBanner />
      </div>
      <div className='w-4/5 mx-auto my-4'>
        <div className='w-4/5 mx-auto'>
          <ScoreGraph averagePointsToDays={averagePointsToDays} otherUsers={topThreePoints} pointsToDays={user.pointsToDays} />
        </div>
        <div>
          <p className='text-lg font-bold text-center my-4'>-- Top 3 Winners 🎉 --</p>
          <div className='space-y-2'>
          {
            topThree.map((x) => (
              <LeaderboardRow key={x.uuid} currentUserId={user.uuid} user={x} position={x.position || 0} />
            ))
          }
          </div>
        </div>
      </div>
    </div>
  )
}
