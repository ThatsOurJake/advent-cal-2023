import mongo, { ScoreboardUser } from "@/app/services/mongo";
import getUser from "@/app/utils/get-user";

interface LeaderboardRowProps {
  user: ScoreboardUser;
  position: number;
  currentUserId: string;
}

const toBase64 = (str: string) => Buffer.from(str, 'utf-8').toString('base64');

const LeaderboardRow = ({ currentUserId, position, user }: LeaderboardRowProps) => {
  const isCurrentUser = currentUserId === user.uuid;
  
  let positionColour = '';

  if (position === 1) {
    positionColour = 'text-yellow-500';
  } else if (position === 2) {
    positionColour = 'text-gray-500'
  } else if (position === 3) {
    positionColour = 'text-orange-500'
  }

  return (
    <div className={`w-full px-4 py-3 border drop-shadow-md flex ${isCurrentUser && 'bg-slate-100'}`}>
      <img src={`https://api.dicebear.com/7.x/thumbs/png?seed=${toBase64(user.uuid)}`} width={64} height={64} style={{ width: '64px', height: '64px' }} alt="profile picture" aria-hidden className="rounded-md" />
      <div className="flex flex-col ml-4 flex-grow flex-shrink py-1 min-w-0 justify-between">
        <p className="text-lg truncate">{user.name} | {user.squad}</p>
        <p>✨ Points: <b>{user.points}</b> ✨</p>
      </div>
      <p className={`font-bold text-lg ${positionColour}`}>#{position}</p>
    </div>
  )
};

const Leaderboard = async () => {
  const user = await getUser();
  const scoreboard = await mongo.getScoreboard();

  const currentPosition = scoreboard.findIndex(x => x.uuid === user.uuid) + 1;

  return (
    <main className="relative bg-black min-w-screen min-h-screen">
      <div aria-hidden className="absolute inset-0 h-full w-full bg-cover blur-sm" style={{ backgroundImage: `url('/background.jpg')`}} />
      <div className="py-2 z-10 relative w-full md:w-1/2 mx-auto bg-white p-4 min-h-screen">
        <p className="text-4xl text-center mb-4">Leaderboard!</p>
        <div className="md:w-2/3 mx-auto">
          <LeaderboardRow currentUserId={user.uuid} position={currentPosition} user={user} />
          <hr className="w-2/3 h-1 mx-auto my-6 bg-gray-100 border-0 rounded dark:bg-gray-700" />
          <section>
            {
              scoreboard.map((x, index) => (
                <LeaderboardRow key={x.uuid} currentUserId={user.uuid} user={x} position={index + 1} />
              ))
            }
          </section>
        </div>
      </div>
    </main>
  );
}

export default Leaderboard;
