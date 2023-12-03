'use server';

import Link from 'next/link';
import Cell from './components/cell';
import getUser from './utils/get-user';

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
            <span className="text-green-500">J</span>
            <span className="text-red-500">i</span>
            <span className="text-green-500">g</span>
            <span className="text-red-500">g</span>
            <span className="text-green-500">l</span>
            <span className="text-red-500">y</span>
            <span className="text-green-500">d</span>
            <span className="text-red-500">u</span>
            <span className="text-green-500">c</span>
            <span className="text-red-500">k</span>
            <span className="text-green-500">s</span>
            <span className="text-red-500"> </span>
            <span className="text-green-500">A</span>
            <span className="text-red-500">d</span>
            <span className="text-green-500">v</span>
            <span className="text-red-500">e</span>
            <span className="text-green-500">n</span>
            <span className="text-red-500">t</span>
          </p>
          <p className="mt-4 text-center">Welcome {user.name} from {user.squad}!</p>
          <p className='text-center'>✨ Current Points: <b>{user.points || '0'}</b> ✨</p>
        </section>
        <div className="relative w-full md:w-2/3 z-10 mx-auto grid grid-cols-5 grid-rows-5 my-2">
          <Cell color="blue" value="2" />
          <Cell color="red" value="6" />
          <Cell color="orange" value="4" />
          <Cell color="green" value="13" />
          <Cell color="blue" value="21" />
          <Cell color="red" value="19" />
          <Cell color="orange" value="7" />
          <Cell color="green" value="10" />
          <Cell color="blue" value="5" />
          <Cell color="orange" value="3" />
          <Cell color="blue" value="15" />
          <Cell color="red" value="20" />
          <Cell color="blue" value="1" />
          <Cell color="green" value="11" />
          <Cell color="blue" value="18" />
          <Cell color="red" value="8" />
          <Cell color="blue" value="24" />
          <Cell color="orange" value="12" />
          <Cell color="red" value="17" />
          <Cell color="blue" value="14" />
          <Cell color="orange" value="9" />
          <Cell color="red" value="16" />
          <Cell color="blue" value="22" />
          <Cell color="green" value="25" />
          <Cell color="orange" value="23" />
        </div>
        <section className="relative w-full md:w-1/2  mx-auto z-10 p-4 bg-white rounded-md text-center">
          <Link href="/leaderboard" className="text-blue-500 hover:underline">View the leaderboard!</Link>
        </section>
        <div className='hidden bg-red-200 bg-green-200 bg-blue-200 bg-orange-200 grid-cols-4 grid-rows-2 text-orange-500 text-gray-500 text-yellow-500' />
      </div>
    </main>
  )
}
