'use server';

import Link from 'next/link';
import getUser from './utils/get-user';
import classNames from 'classnames';

export default async function HomeOpen() {
  const user = await getUser();

  return (
    <main className="relative bg-black min-w-screen min-h-screen">
      <div aria-hidden className="absolute inset-0 h-full w-full bg-cover" style={{ backgroundImage: `url('/background.png')`}} />
      <div className='py-2'>
        <section className='relative w-1/2 mx-auto border-2 rounded-md border-black drop-shadow-lg py-4 px-2 bg-main shadow-light space-y-2'>
          <p className='text-center font-heading text-4xl'>Advent Calendar 2024</p>
          <p className='text-center font-base text-xl'>Welcome, {user.name} from &quot;{user.squad}&quot;!</p>
          <p className='text-center font-base text-lg'>You have {user.points} points.</p>
        </section>
      </div>
      <div className='w-4/5 mx-auto'>
        <div className='grid grid-cols-5 w-2/3 mx-auto'>
          {
            Array(25).fill(() => null).map((_, i) => {
              const day = i + 1;
              const hasUserCompletedDay = user.daysComplete.includes(day);
              const classes = classNames('aspect-square p-4 relative group', {
                'cursor-pointer': !hasUserCompletedDay,
                'greyscale': hasUserCompletedDay,
              });

              return (
                <div className={classes} key={`day-${day}`}>
                  <img className='w-full h-full rounded-md shadow-light border-2 border-black transition-all group-hover:shadow-none group-hover:translate-x-boxShadowX group-hover:translate-y-boxShadowY' src={`/cells/day-${day}.png`} alt={`day ${day} cell`} />
                  <p className='absolute right-8 top-6 z-10 text-4xl font-base transition-all group-hover:translate-x-boxShadowX group-hover:translate-y-boxShadowY'>{day}</p>
                </div>
              );
            })
          }
        </div>
      </div>
    </main>
  )
}
