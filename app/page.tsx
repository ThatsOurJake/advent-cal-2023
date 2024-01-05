'use server';

import Link from 'next/link';
import getUser from './utils/get-user';
import mongo from './services/mongo';
import averagePointsCalculation from './utils/average-points-calculation';
import LeaderboardRow from './components/leaderboard-row';
import ScoreGraph from './components/score-graph';
import HomeBanner from './components/home-banner';

export default async function Home() {
  const user = await getUser();
  const scoreboard = await mongo.getScoreboard();
  const averagePointsToDays = averagePointsCalculation(scoreboard);
  const currentPosition = scoreboard.find(x => x.uuid === user.uuid)?.position || 0;

  const topThree = scoreboard.filter(x => x.position && x.position <= 3).sort((a, b) => a.position! - b.position!);
  const topThreePoints = topThree.map((x) => ({ name: x.name, position: x.position!, points: x.pointsToDays }));
  
  return (
    <main className="relative bg-black min-w-screen min-h-screen">
      <div aria-hidden className="absolute inset-0 h-full w-full bg-cover blur-sm" style={{ backgroundImage: `url('/background.jpg')`}} />
      <div className="py-2">
        <section className="relative w-full md:w-1/2  mx-auto z-10 p-4 bg-white rounded-md">
          <p className="text-4xl font-bold text-center drop-shadow-md">
            <span className="text-red-500">2</span>
            <span className="text-green-500">0</span>
            <span className="text-red-500">2</span>
            <span className="text-green-500">3</span>
            <span className="text-red-500"> - </span>
            <span className="text-green-500">D</span>
            <span className="text-red-500">i</span>
            <span className="text-green-500">g</span>
            <span className="text-red-500">i</span>
            <span className="text-green-500">t</span>
            <span className="text-red-500">a</span>
            <span className="text-green-500">l</span>
            <span> </span>
            <span className="text-red-500">A</span>
            <span className="text-green-500">d</span>
            <span className="text-red-500">v</span>
            <span className="text-green-500">e</span>
            <span className="text-red-500">n</span>
            <span className="text-green-500">t</span>
          </p>
          <p className="mt-4 text-center">Welcome {user.name} from {user.squad}!</p>
          <p className='text-center'>✨ Your final points: <b>{user.points || '0'}</b> | Position: <b>{currentPosition}</b> ✨</p>
        </section>
        <section className='md:w-2/3 mx-auto bg-white relative my-4 py-4 px-6 rounded-md'>
          <div className='w-1/2 aspect-video mx-auto'>
            <ScoreGraph averagePointsToDays={averagePointsToDays} otherUsers={topThreePoints} pointsToDays={user.pointsToDays} />
          </div>
          <p className='text-lg font-bold mb-2'>Top 3 Winners 🎉</p>
          {
            topThree.map((x) => (
              <LeaderboardRow key={x.uuid} currentUserId={user.uuid} user={x} position={x.position || 0} />
            ))
          }
        </section>
        <div className='relative w-full md:w-2/3 mx-auto z-10'>
          <HomeBanner />
        </div>
        <div className='hidden bg-red-200 bg-green-200 bg-blue-200 bg-orange-200 grid-cols-4 grid-rows-2 text-orange-500 text-gray-500 text-yellow-500 bg-red-50 bg-green-50 bg-blue-50 bg-orange-50 bg-lime-500' />
      </div>
    </main>
  )
}
