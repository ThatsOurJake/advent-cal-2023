import { generateNonce } from '@/app/utils/nonce';
import FindSanta from '@/app/components/games/find-santa';

export default function DayFive() {
  const nonce = generateNonce('5', 'find');

  return (
    <div>
      <p className="font-bold text-center text-4xl">5th December 2023</p>
      <p className='text-center italic my-2'>Can you find all the Santa&apos;s 🎅🏼?</p>
      <FindSanta baseFolder='day5' averages={[127, 165, 141, 174]} nonce={nonce} />
    </div>
  )
};
