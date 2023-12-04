import { generateNonce } from '@/app/utils/nonce';
import SpotTheDiff from '@/app/components/games/spot-the-diff';

export default function DayFour() {
  const nonce = generateNonce('4', 'diff');

  return (
    <div>
      <p className="font-bold text-center text-4xl">4th December 2023</p>
      <p className='text-center italic my-2'>Can you spot the differences?</p>
      <SpotTheDiff baseFolder="day4" nonce={nonce} averages={[127, 191, 160, 185]} />
    </div>
  )
};
