import { generateNonce } from '@/app/utils/nonce';
import { wheels } from '@/app/api/submit-game/calculate-score/wheel';
import rng from '@/app/utils/rng';
import SpinWheel from '@/app/components/games/spin-wheel';

export default function DayNight() {
  const nonce = generateNonce('9', 'wheel');
  const wheel = wheels[0];
  const winningIndex = rng(1, wheel.options.length) - 1;

  return (
    <div>
      <p className="font-bold text-center text-4xl">9th December 2023</p>
      <p className='text-center italic my-2'>Spin the wheel and hope you&apos;ve been good!</p>
      <SpinWheel nonce={nonce} wheel={wheel} winningIndex={winningIndex} />
    </div>
  )
};
