export interface WheelPayload {
  wheelId: string;
  wheelOption: number;
}

const wheelSegmentColours = {
  red: '#e66767',
  purple: '#574b90',
  lime: '#26de81',
  orange: '#e15f41',
  blue: '#546de5',
};

export interface Wheel {
  id: string;
  options: { points: number, desc: string, color: string }[];
}

export const wheels: Wheel[] = [
  {
    id: 'wheel-1',
    options: [
      {
        desc: 'Gain 50 points',
        points: 50,
        color: wheelSegmentColours.purple,
      },
      {
        desc: 'Gain 100 points',
        points: 100,
        color: wheelSegmentColours.lime,
      },
      {
        desc: 'Gain 50 points',
        points: 50,
        color: wheelSegmentColours.purple,
      },
      {
        desc: 'Gain 100 points',
        points: 100,
        color: wheelSegmentColours.lime,
      },
      {
        desc: 'Gain 50 points',
        points: 50,
        color: wheelSegmentColours.purple,
      },
      {
        desc: 'Gain 100 points',
        points: 100,
        color: wheelSegmentColours.lime,
      },
      {
        desc: 'Gain 50 points',
        points: 50,
        color: wheelSegmentColours.purple,
      },
      {
        desc: 'Gain 150 points',
        points: 150,
        color: wheelSegmentColours.orange,
      },
    ]
  },
  {
    id: 'wheel-2',
    options: [
      {
        desc: 'Gain 25 points',
        points: 25,
        color: wheelSegmentColours.red,
      },
      {
        desc: 'Gain 150 points',
        points: 150,
        color: wheelSegmentColours.orange,
      },
      {
        desc: 'Gain 25 points',
        points: 25,
        color: wheelSegmentColours.red,
      },
      {
        desc: 'Gain 50 points',
        points: 50,
        color: wheelSegmentColours.purple,
      },
      {
        desc: 'Gain 25 points',
        points: 25,
        color: wheelSegmentColours.red,
      },
      {
        desc: 'Gain 100 points',
        points: 100,
        color: wheelSegmentColours.lime,
      },
      {
        desc: 'Gain 25 points',
        points: 25,
        color: wheelSegmentColours.red,
      },
      {
        desc: 'Gain 100 points',
        points: 100,
        color: wheelSegmentColours.lime,
      },
    ]
  },
  {
    id: 'wheel-3',
    options: [
      {
        desc: 'Gain 25 points',
        points: 25,
        color: wheelSegmentColours.red,
      },
      {
        desc: 'Gain 50 points',
        points: 50,
        color: wheelSegmentColours.purple,
      },
      {
        desc: 'Gain 100 points',
        points: 100,
        color: wheelSegmentColours.lime,
      },
      {
        desc: 'Gain 50 points',
        points: 50,
        color: wheelSegmentColours.purple,
      },
      {
        desc: 'Gain 25 points',
        points: 25,
        color: wheelSegmentColours.red,
      },
      {
        desc: 'Gain 150 points',
        points: 150,
        color: wheelSegmentColours.blue,
      },
    ]
  },
  {
    id: 'wheel-4',
    options: [
      {
        points: 200,
        desc: 'Gain 200 points',
        color: wheelSegmentColours.lime,
      },
      {
        points: 500,
        desc: 'Gain 500 points (Jackpot)',
        color: wheelSegmentColours.orange,
      },
      {
        points: 250,
        desc: 'Gain 250 points',
        color: wheelSegmentColours.purple,
      },
      {
        points: 300,
        desc: 'Gain 300 points',
        color: wheelSegmentColours.blue,
      },
      {
        points: 500,
        desc: 'Gain 500 points (Jackpot)',
        color: wheelSegmentColours.orange,
      },
      {
        points: 250,
        desc: 'Gain 250 points',
        color: wheelSegmentColours.purple,
      },
    ]
  },
];

const calculateWheelScore = ({ wheelId, wheelOption }: WheelPayload): number => {
  const wheel = wheels.find(x => x.id === wheelId);

  if (!wheel) {
    return 0;
  }

  const option = wheel.options[wheelOption];

  if (!option) {
    return 0;
  }

  return option.points;
};

export default calculateWheelScore;
