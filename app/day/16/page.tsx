import { generateNonce } from '@/app/utils/nonce';
import FindSanta from '@/app/components/games/find-santa';

export default function DayFive() {
  const nonce = generateNonce('16', 'find');

  return (
    <div>
      <p className="font-bold text-center text-4xl">16th December 2024</p>
      <p className='text-center italic my-2'>Can you find all the Santa&apos;s 🎅🏼?</p>
      <FindSanta baseFolder='day16' averages={[88, 71, 101, 222]} nonce={nonce} />
    </div>
  )
};
