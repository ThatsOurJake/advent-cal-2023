import { generateNonce } from '@/app/utils/nonce';
import SliderGrid from '@/app/components/games/slider-grid';

export default function DayNineteen() {
  const nonce = generateNonce('19', 'slider');

  return (
    <div>
      <p className="font-bold text-center text-4xl">19th December 2024</p>
      <SliderGrid nonce={nonce} size={3} gridImage='santa' />
    </div>
  )
};
