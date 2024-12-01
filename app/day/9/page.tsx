import { generateNonce } from '@/app/utils/nonce';
import SpotTheDiff from '@/app/components/games/spot-the-diff';

export default function DayNight() {
  const nonce = generateNonce('9', 'diff');
  return (
    <div>
      <p className="font-bold text-center text-4xl">9th December 2024</p>
      <SpotTheDiff nonce={nonce} baseFolder="day9" averages={[92, 183, 227, 97, 107, 160]} />
    </div>
  )
};
