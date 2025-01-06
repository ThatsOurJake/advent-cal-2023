import { generateNonce } from '@/app/utils/nonce';

import SliderGrid from '@/app/components/games/slider-grid';

export default function DayThirteen() {
  const nonce = generateNonce('13', 'slider');

  return (
    <div>
      <p className="font-bold text-center text-4xl">13th December 2024</p>
      <SliderGrid nonce={nonce} gridImage="snowman" size={4} />
    </div>
  )
};
