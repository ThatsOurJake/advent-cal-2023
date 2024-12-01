import { generateNonce } from '@/app/utils/nonce';
import SpotTheDiff from '@/app/components/games/spot-the-diff';

export default function DayNineteen() {
  const nonce = generateNonce('19', 'diff');

  return (
    <div>
      <p className="font-bold text-center text-4xl">19th December 2024</p>
      <p className='text-center italic my-2'>There are some differences, can you spot them?</p>
      <SpotTheDiff baseFolder="day19" nonce={nonce} averages={[83, 152, 146, 140, 108]} />
    </div>
  )
};
