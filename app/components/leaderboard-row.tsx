import React from 'react';

import { ScoreboardUser } from '../services/mongo';
import getPositionColour from '../utils/get-position-colour';

interface LeaderboardRowProps {
  user: ScoreboardUser;
  position: number;
  currentUserId: string;
}

const toBase64 = (str: string) => Buffer.from(str, 'utf-8').toString('base64');

const LeaderboardRow = ({ currentUserId, position, user }: LeaderboardRowProps) => {
  const isCurrentUser = currentUserId === user.uuid;
  
  let positionColour = getPositionColour(position);

  return (
    <div className={`w-full px-4 py-3 my-2 border drop-shadow-md rounded-md flex ${isCurrentUser && 'bg-slate-100'}`}>
      <img src={`https://api.dicebear.com/7.x/thumbs/png?seed=${toBase64(user.uuid)}`} width={64} height={64} style={{ width: '64px', height: '64px' }} alt="profile picture" aria-hidden className="rounded-md" />
      <div className="flex flex-col ml-4 flex-grow flex-shrink py-1 min-w-0 justify-between">
        <p className="text-lg truncate">{user.name} | {user.squad}</p>
        <p>✨ Points: <b>{user.points}</b> ✨</p>
      </div>
      <p className={`font-bold text-lg ${positionColour}`}>#{position}</p>
    </div>
  )
};

export default LeaderboardRow;
