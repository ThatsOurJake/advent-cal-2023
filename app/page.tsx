'use server';

import Link from 'next/link';
import Cell, { type CellProps } from '@/app/components/cell';
import getUser from './utils/get-user';

const calendar: Pick<CellProps, 'color' | 'value'>[] = [
  { color: 'blue', value: '2' },
  { color: 'red', value: '6' },
  { color: 'orange', value: '4' },
  { color: 'green', value: '13' },
  { color: 'blue', value: '21' },
  { color: 'red', value: '19' },
  { color: 'orange', value: '7' },
  { color: 'green', value: '10' },
  { color: 'blue', value: '5' },
  { color: 'orange', value: '3' },
  { color: 'blue', value: '15' },
  { color: 'red', value: '20' },
  { color: 'blue', value: '1' },
  { color: 'green', value: '11' },
  { color: 'blue', value: '18' },
  { color: 'red', value: '8' },
  { color: 'blue', value: '24' },
  { color: 'orange', value: '12' },
  { color: 'red', value: '17' },
  { color: 'blue', value: '14' },
  { color: 'orange', value: '9' },
  { color: 'red', value: '16' },
  { color: 'blue', value: '22' },
  { color: 'green', value: '25' },
  { color: 'orange', value: '23' },
];

export default async function Home() {
  const user = await getUser();

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
          <p className='text-center'>✨ Current Points: <b>{user.points || '0'}</b> ✨</p>
        </section>
        <div className="relative w-full md:w-2/3 z-10 mx-auto grid grid-cols-5 grid-rows-5 my-2">
          {
            calendar.map((x) => {
              const hasBeenCompleted = user.daysComplete.includes(x.value);
              return (<Cell key={`cell-${x.value}`} color={x.color} hasBeenCompleted={hasBeenCompleted} value={x.value} />)
            })
          }
        </div>
        <section className="relative w-full md:w-1/2  mx-auto z-10 p-4 bg-white rounded-md text-center">
          <Link href="/leaderboard" className="text-blue-500 hover:underline">View the leaderboard!</Link>
        </section>
        <div className='hidden bg-red-200 bg-green-200 bg-blue-200 bg-orange-200 grid-cols-4 grid-rows-2 text-orange-500 text-gray-500 text-yellow-500 bg-red-50 bg-green-50 bg-blue-50 bg-orange-50 bg-lime-500' />
      </div>
    </main>
  )
}
