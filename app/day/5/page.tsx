import { generateNonce } from '@/app/utils/nonce';
import FindSanta from '@/app/components/games/find-santa';

export default function DayFive() {
  const nonce = generateNonce('5', 'find');

  return (
    <div>
      <p className="font-bold text-center text-4xl">5th December 2024</p>
      <FindSanta baseFolder='day5' averages={[128, 185, 97, 192, 108]} nonce={nonce} />
    </div>
  )
};
