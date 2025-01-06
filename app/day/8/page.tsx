import { generateNonce } from '@/app/utils/nonce';
import SpinWheel from '@/app/components/games/spin-wheel';
import { wheels } from '@/app/api/submit-game/calculate-score/wheel';
import rng from '@/app/utils/rng';

export default function DayEight() {
  const nonce = generateNonce('8', 'wheel');
  const wheel = wheels[0];
  const winningIndex = rng(1, wheel.options.length) - 1;

  return (
    <div>
      <p className="font-bold text-center text-4xl">8th December 2024</p>
      <SpinWheel nonce={nonce} wheel={wheel} winningIndex={winningIndex} />
    </div>
  )
};
