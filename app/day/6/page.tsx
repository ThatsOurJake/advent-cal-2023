import { generateNonce } from '@/app/utils/nonce';
import SliderGrid from '../../components/games/slider-grid';

export default function DaySix() {
  const nonce = generateNonce('6', 'slider');

  return (
    <div>
      <p className="font-bold text-center text-4xl">6th December 2023</p>
      <SliderGrid gridImage='snowman' size={4} nonce={nonce} />
    </div>
  )
};
