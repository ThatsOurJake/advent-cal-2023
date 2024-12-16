import { generateNonce } from '@/app/utils/nonce';
import WhackAnElf, { type TimelineItem } from '@/app/components/games/whack-an-elf';

const ANIMATION_DURATION = 2000;

const timeline: TimelineItem[] = [
  {
    zone: 1,
    visibleForSecs: 2000,
    isElf: false,
    delay: 0,
  },
  {
    zone: 2,
    visibleForSecs: 2100,
    isElf: true,
    delay: 0,
  },
  {
    zone: 3,
    visibleForSecs: 1500,
    isElf: true,
    delay: ANIMATION_DURATION + 500,
  },
  {
    zone: 1,
    visibleForSecs: 1500,
    isElf: false,
    delay: ANIMATION_DURATION + 500,
  },
  {
    zone: 5,
    visibleForSecs: 1500,
    isElf: false,
    delay: ANIMATION_DURATION + 500,
  },
  {
    zone: 2,
    visibleForSecs: 1500,
    isElf: true,
    delay: ANIMATION_DURATION + 2500,
  },
  {
    zone: 4,
    visibleForSecs: 1500,
    isElf: false,
    delay: ANIMATION_DURATION + 2500,
  },
  {
    zone: 1,
    visibleForSecs: 1500,
    isElf: false,
    delay: ANIMATION_DURATION + 4500,
  },
  {
    zone: 2,
    visibleForSecs: 1500,
    isElf: false,
    delay: ANIMATION_DURATION + 4500,
  },
  {
    zone: 3,
    visibleForSecs: 1500,
    isElf: true,
    delay: ANIMATION_DURATION + 4500,
  },
  {
    zone: 4,
    visibleForSecs: 1500,
    isElf: false,
    delay: ANIMATION_DURATION + 4500,
  },
  {
    zone: 5,
    visibleForSecs: 1500,
    isElf: true,
    delay: ANIMATION_DURATION + 4500,
  },
  {
    zone: 3,
    visibleForSecs: 750,
    isElf: true,
    delay: ANIMATION_DURATION + 6500,
  },
  {
    zone: 4,
    visibleForSecs: 1500,
    isElf: false,
    delay: ANIMATION_DURATION + 7500,
  },
  {
    zone: 2,
    visibleForSecs: 1500,
    isElf: true,
    delay: ANIMATION_DURATION + 7500,
  },
  {
    zone: 5,
    visibleForSecs: 1500,
    isElf: false,
    delay: ANIMATION_DURATION + 7500,
  },
];

export default function DaySeventeen() {
  const nonce = generateNonce('17', 'whack');

  return (
    <div>
      <p className="font-bold text-center text-4xl">17th December 2024</p>
      <WhackAnElf nonce={nonce} timeline={timeline} />
    </div>
  )
};
