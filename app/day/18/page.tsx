import { generateNonce } from '@/app/utils/nonce';
import FindSanta from '@/app/components/games/find-santa';

export default function DayEighteen() {
  const nonce = generateNonce('18', 'find');

  return (
    <div>
      <p className="font-bold text-center text-4xl">18th December 2024</p>
      <FindSanta nonce={nonce} baseFolder='day18' averages={[
        90, 169, 160, 132, 215, 183, 121
      ]} />
    </div>
  );
};
