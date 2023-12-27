import Link from 'next/link';
import React from 'react';

const HomeBanner = () => {
  return (
    <div className='w-full p-4 text-center rounded-md border-indigo-600 bg-indigo-200 my-4'>
      <p>Thank you for playing the 2023 Digital Advent calendar the event is now over - You can still complete the days you have missed but the winners will be announced 5th January</p>
      <p>If you want to see the source code then it can be viewed <a href="https://github.com/ThatsOurJake/advent-cal-2023" className='text-blue-500 hover:underline' target='_blank'>here.</a></p>
      <Link href="/leaderboard" className="text-blue-500 hover:underline">View the leaderboard!</Link>
    </div>
  )
};

export default HomeBanner;
