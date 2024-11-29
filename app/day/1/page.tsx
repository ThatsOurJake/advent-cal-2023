import { generateNonce } from '@/app/utils/nonce';
import SpotTheDiff from '../../components/games/spot-the-diff';


export default function DayOne() {
  const nonce = generateNonce('1', 'diff');

  return (
    <div>
      <p className="font-bold text-center text-2xl">1st December 2024</p>
      <SpotTheDiff nonce={nonce} averages={[128, 183, 93, 192]} baseFolder='day1' />
    </div>
  )
};
