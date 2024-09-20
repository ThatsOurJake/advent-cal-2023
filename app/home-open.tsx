'use server';

import Link from 'next/link';
import getUser from './utils/get-user';
import HomeBanner from './components/home-banner';

export default async function HomeOpen() {
  const user = await getUser();

  return (
    <main className="relative bg-black min-w-screen min-h-screen">
      <div className='w-4/5 mx-auto'>
        <div className="grid grid-cols-10">
          <div className='bg-white w-full aspect-square'>
            <img src="/images/board-tiles/Road_01_Tile_05.png" className='w-full h-full' />
          </div>
          <div className='bg-white w-full aspect-square'>
            <img src="/images/board-tiles/Road_01_Tile_03.png" className='w-full h-full' />
          </div>
          <div className='bg-white w-full aspect-square'>
            <img src="/images/board-tiles/Road_01_Tile_03.png" className='w-full h-full' />
          </div>
          <div className='bg-white w-full aspect-square'>
            <img src="/images/board-tiles/Road_01_Tile_03.png" className='w-full h-full' />
          </div>
          <div className='bg-white w-full aspect-square'>
            <img src="/images/board-tiles/Road_01_Tile_07.png" className='w-full h-full' />
          </div>
          <div className='bg-white w-full aspect-square' />
          <div className='bg-white w-full aspect-square' />
          <div className='bg-white w-full aspect-square' />
          <div className='bg-white w-full aspect-square' />
          <div className='bg-white w-full aspect-square' />
          <div className='bg-white w-full aspect-square' />
          <div className='bg-white w-full aspect-square' />
          <div className='bg-white w-full aspect-square' />
          <div className='bg-white w-full aspect-square' />
          <div className='bg-white w-full aspect-square'>
            <img src="/images/board-tiles/Road_01_Tile_06.png" className='w-full h-full' />
          </div>
          <div className='bg-white w-full aspect-square' />
          <div className='bg-white w-full aspect-square' />
          <div className='bg-white w-full aspect-square' />
          <div className='bg-white w-full aspect-square' />
          <div className='bg-white w-full aspect-square' />
          <div className='bg-white w-full aspect-square' />
          <div className='bg-white w-full aspect-square' />
          <div className='bg-white w-full aspect-square' />
          <div className='bg-white w-full aspect-square' />
          <div className='bg-white w-full aspect-square'>
            <img src="/images/board-tiles/Road_01_Tile_06.png" className='w-full h-full' />
          </div>
          <div className='bg-white w-full aspect-square' />
          <div className='bg-white w-full aspect-square' />
          <div className='bg-white w-full aspect-square' />
          <div className='bg-white w-full aspect-square' />
          <div className='bg-white w-full aspect-square' />
          <div className='bg-white w-full aspect-square' />
          <div className='bg-white w-full aspect-square' />
          <div className='bg-white w-full aspect-square' />
          <div className='bg-white w-full aspect-square' />
          <div className='bg-white w-full aspect-square'>
            <img src="/images/board-tiles/Road_01_Tile_01.png" className='w-full h-full' />
          </div>
          <div className='bg-white w-full aspect-square'>
            <img src="/images/board-tiles/Road_01_Tile_03.png" className='w-full h-full' />
          </div>
          <div className='bg-white w-full aspect-square'>
            <img src="/images/board-tiles/Road_01_Tile_08.png" className='w-full h-full' />
          </div>
          <div className='bg-white w-full aspect-square' />
          <div className='bg-white w-full aspect-square' />
          <div className='bg-white w-full aspect-square' />
          <div className='bg-white w-full aspect-square' />
          <div className='bg-white w-full aspect-square' />
          <div className='bg-white w-full aspect-square' />
          <div className='bg-white w-full aspect-square' />
          <div className='bg-white w-full aspect-square' />
          <div className='bg-white w-full aspect-square' />
          <div className='bg-white w-full aspect-square' />
          <div className='bg-white w-full aspect-square' />
          <div className='bg-white w-full aspect-square' />
          <div className='bg-white w-full aspect-square' />
          <div className='bg-white w-full aspect-square' />
          <div className='bg-white w-full aspect-square' />
          <div className='bg-white w-full aspect-square' />
          <div className='bg-white w-full aspect-square' />
          <div className='bg-white w-full aspect-square' />
          <div className='bg-white w-full aspect-square' />
          <div className='bg-white w-full aspect-square' />
          <div className='bg-white w-full aspect-square' />
          <div className='bg-white w-full aspect-square' />
          <div className='bg-white w-full aspect-square' />
        </div>
      </div>
    </main>
  )
}
