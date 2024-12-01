import { generateNonce } from '@/app/utils/nonce';
import { wheels } from '@/app/api/submit-game/calculate-score/wheel';
import rng from '@/app/utils/rng';
import SpinWheel from '@/app/components/games/spin-wheel';

export default function DayNight() {
  const nonce = generateNonce('15', 'wheel');
  const wheel = wheels[1];
  const winningIndex = rng(1, wheel.options.length) - 1;

  return (
    <div>
      <p className="font-bold text-center text-4xl">15th December 2024</p>
      <p className='text-center italic my-2'>How many points will you gain today?</p>
      <SpinWheel nonce={nonce} wheel={wheel} winningIndex={winningIndex} />
    </div>
  )
};
