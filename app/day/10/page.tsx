import { generateNonce } from '@/app/utils/nonce';
import SpotTheDiff from '@/app/components/games/spot-the-diff';

export default function DayTen() {
  const nonce = generateNonce('10', 'diff');

  return (
    <div>
      <p className="font-bold text-center text-4xl">10th December 2023</p>
      <p className='text-center italic my-2'>Can you spot the differences?</p>
      <SpotTheDiff baseFolder="day10" nonce={nonce} averages={[121, 204, 155, 178, 221, 99]} />
    </div>
  )
};
