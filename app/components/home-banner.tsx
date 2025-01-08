import Link from 'next/link';
import React from 'react';

const HomeBanner = () => {
  return (
    <div className='w-full px-4 py-2 text-center rounded-base bg-main border-2 border-black shadow-light'>
      <p>Thank you for playing the 2024 Digital Advent calendar the event is now over - You can still complete the days you have missed but the winners will be announced 5th January</p>
      <p>If you want to see the source code then it can be viewed <a href="https://github.com/ThatsOurJake/advent-cal-2023" className='text-black hover:underline' target='_blank'>here.</a></p>
      <Link href="/leaderboard" className="text-black hover:underline">View the leaderboard!</Link>
    </div>
  )
};

export default HomeBanner;
