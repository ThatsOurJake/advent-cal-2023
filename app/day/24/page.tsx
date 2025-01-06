import { generateNonce } from '@/app/utils/nonce';
import WhackAnElf, { type TimelineItem } from '../../components/games/whack-an-elf';

const ANIMATION_DURATION = 3750;

const timeline: TimelineItem[] = [
  {
    zone: 1,
    delay: 100,
    isElf: true,
    visibleForSecs: 1500,
  },
  {
    zone: 2,
    delay: 500,
    isElf: false,
    visibleForSecs: 1500,
  },
  {
    zone: 3,
    delay: 750,
    isElf: true,
    visibleForSecs: 1500,
  },
  {
    zone: 4,
    delay: 1000,
    isElf: false,
    visibleForSecs: 1500,
  },
  {
    zone: 5,
    delay: 1500,
    isElf: true,
    visibleForSecs: 1500,
  },
  //
  {
    zone: 5,
    delay: ANIMATION_DURATION + 1000,
    isElf: true,
    visibleForSecs: 1500,
  },
  {
    zone: 4,
    delay: ANIMATION_DURATION + 1500,
    isElf: false,
    visibleForSecs: 1500,
  },
  {
    zone: 3,
    delay: ANIMATION_DURATION + 1750,
    isElf: true,
    visibleForSecs: 1500,
  },
  {
    zone: 2,
    delay: ANIMATION_DURATION + 2000,
    isElf: false,
    visibleForSecs: 1500,
  },
  {
    zone: 1,
    delay: ANIMATION_DURATION + 2500,
    isElf: true,
    visibleForSecs: 1500,
  },
  //
  {
    zone: 2,
    delay: ANIMATION_DURATION + 4000,
    isElf: true,
    visibleForSecs: 1500,
  },
  {
    zone: 3,
    delay: ANIMATION_DURATION + 4000,
    isElf: false,
    visibleForSecs: 1500,
  },
  {
    zone: 4,
    delay: ANIMATION_DURATION + 4000,
    isElf: true,
    visibleForSecs: 1500,
  },
  //
  {
    zone: 1,
    delay: ANIMATION_DURATION + 6000,
    isElf: true,
    visibleForSecs: 750,
  },
  {
    zone: 2,
    delay: ANIMATION_DURATION + 6500,
    isElf: true,
    visibleForSecs: 750,
  },
  {
    zone: 3,
    delay: ANIMATION_DURATION + 7000,
    isElf: false,
    visibleForSecs: 750,
  },
  {
    zone: 4,
    delay: ANIMATION_DURATION + 7500,
    isElf: true,
    visibleForSecs: 750,
  },
  {
    zone: 5,
    delay: ANIMATION_DURATION + 8000,
    isElf: true,
    visibleForSecs: 750,
  },
  //
  {
    zone: 1,
    delay: ANIMATION_DURATION + 9000,
    isElf: true,
    visibleForSecs: 1500,
  },
  {
    zone: 3,
    delay: ANIMATION_DURATION + 9000,
    isElf: false,
    visibleForSecs: 1500,
  },
  //
  {
    zone: 5,
    delay: ANIMATION_DURATION + 9000,
    isElf: true,
    visibleForSecs: 1500,
  },
  //
  {
    zone: 1,
    delay: ANIMATION_DURATION + 12000,
    isElf: true,
    visibleForSecs: 1500,
  },
  {
    zone: 2,
    delay: ANIMATION_DURATION + 12000,
    isElf: true,
    visibleForSecs: 1500,
  },
  {
    zone: 3,
    delay: ANIMATION_DURATION + 12000,
    isElf: false,
    visibleForSecs: 1500,
  },
  {
    zone: 4,
    delay: ANIMATION_DURATION + 12000,
    isElf: true,
    visibleForSecs: 1500,
  },
  {
    zone: 5,
    delay: ANIMATION_DURATION + 12000,
    isElf: false,
    visibleForSecs: 1500,
  },
];

export default function DayTwentyFour() {
  const nonce = generateNonce('24', 'whack');

  return (
    <div>
      <p className="font-bold text-center text-4xl">24th December 2024</p>
      <p className='text-center italic my-2'>Christmas Eve ✨</p>
      <WhackAnElf nonce={nonce} timeline={timeline} />
    </div>
  )
};
