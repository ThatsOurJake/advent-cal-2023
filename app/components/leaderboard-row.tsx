import React from 'react';

import { ScoreboardUser } from '../services/mongo';
import getPositionColour from '../utils/get-position-colour';
import classNames from 'classnames';

interface LeaderboardRowProps {
  user: ScoreboardUser;
  position: number;
  currentUserId: string;
}

const toBase64 = (str: string) => Buffer.from(str, 'utf-8').toString('base64');

const LeaderboardRow = ({ currentUserId, position, user }: LeaderboardRowProps) => {
  const isCurrentUser = currentUserId === user.uuid;
  const positionColour = getPositionColour(position);

  const classes = classNames('w-full px-4 py-3 border-2 border-black rounded-base shadow-light flex text-black', {
    'bg-indigo-100': isCurrentUser,
    'bg-white': !isCurrentUser,
  });

  return (
    <div className={classes}>
      <img src={`https://api.dicebear.com/9.x/fun-emoji/png?seed=${toBase64(user.uuid)}`} width={64} height={64} style={{ width: '64px', height: '64px' }} alt="profile picture" aria-hidden className="rounded-base border-2 border-black shadow-dark" />
      <div className="flex flex-col ml-4 flex-grow flex-shrink py-1 min-w-0 justify-between">
        <p className="text-lg truncate">{user.name} | {user.squad}</p>
        <p className='font-bold'>{user.points} Points ✨</p>
      </div>
      <p className={`font-bold text-lg ${positionColour}`}>#{position}</p>
    </div>
  )
};

export default LeaderboardRow;
