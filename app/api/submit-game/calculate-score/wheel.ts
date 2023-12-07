export interface WheelPayload {
  wheelId: string;
  wheelOption: number;
}

const wheelSegmentColours = {
  red: '#ef9a9a',
  purple: '#ce93d8',
  lime: '#e6ee9c',
  orange: '#ffcc80',
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
  }
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
