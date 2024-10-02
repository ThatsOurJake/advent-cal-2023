'use server';

import classNames from 'classnames';

import getUser from './utils/get-user';
import mongo from './services/mongo';
import suffixOrdinalString from './utils/ordinal-str';

export default async function HomeOpen() {
  const user = await getUser();
  const position = await mongo.getUserScoreboardPosition(user.uuid);

  const positionStr = suffixOrdinalString(position);

  return (
    <>
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
      <div className='w-4/5 mx-auto my-2'>
        <div className='grid grid-cols-5 w-full'>
          {
            Array(25).fill(() => null).map((_, i) => {
              const day = i + 1;
              const hasUserCompletedDay = user.daysComplete.includes(day);
              const classes = classNames('aspect-square p-4 relative group', {
                'cursor-pointer': !hasUserCompletedDay,
                'greyscale': hasUserCompletedDay,
              });

              return (
                <a key={`day-${day}`} href={`/day/${day}`}>
                  <div className={classes}>
                    <img className='w-full h-full rounded-md shadow-light border-2 border-black transition-all group-hover:shadow-none group-hover:translate-x-boxShadowX group-hover:translate-y-boxShadowY' src={`/cells/day-${day}.png`} alt={`day ${day} cell`} />
                    <p className='absolute right-8 top-6 z-10 text-4xl font-base transition-all group-hover:translate-x-boxShadowX group-hover:translate-y-boxShadowY'>{day}</p>
                  </div>
                </a>
              );
            })
          }
        </div>
      </div>
    </>
  )
}
