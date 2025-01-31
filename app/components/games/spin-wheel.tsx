'use client';

import { useCallback, useRef, useState } from "react";

import rng from "@/app/utils/rng";
import api from "@/app/utils/api";
import type { Wheel, WheelPayload } from "@/app/api/submit-game/calculate-score/wheel";
import logger from "../../../logger";
import Btn from "../btn";
import Alert from "../alert";

interface SpinWheelProps {
  wheel: Wheel;
  winningIndex: number;
  nonce: string;
}

const SpinWheel = ({ nonce, wheel, winningIndex }: SpinWheelProps) => {
  const { id, options } = wheel;
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const [submittingScore, setSubmittingScore] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<number>(0);

  const wheelEle = useRef<HTMLDivElement>(null);
  const lock = useRef<boolean>(false);

  const breakpoint = Math.floor(360 / options.length);

  const gradientStr = options.map((x, index) => {
    const deg = (index * breakpoint) + breakpoint;
    return `${x.color} 0 ${deg}deg`;
  }).join(', ');

  const multiplier = options.length % 4 ? 1 : 1.5;
  const rotation =  breakpoint * multiplier;
  
  const finishGame = useCallback(() => {
    setGameFinished(true);
    setSubmittingScore(true);

    api.submitGameResult<WheelPayload>(nonce, {
      wheelId: id,
      wheelOption: winningIndex,
    })
    .then(s => setFinalScore(s))
    .catch((e) => {
      setSubmitError(true);
      logger.error(e);
    })
    .finally(() => setSubmittingScore(false));
  }, [nonce, id, winningIndex]);

  const spinTheWheel = () => {
    if (!wheelEle.current || lock.current) {
      return;
    }

    lock.current = true;

    const { current: wheelElement } = wheelEle;

    setTimeout(() => {
      wheelElement.style.transition = 'all ease-out 5s';

      const padding = 4;
      const minRotation = (breakpoint * winningIndex) + padding;
      const maxRotation =  (breakpoint * (winningIndex + 1)) - padding;
      const fullRotation = rng(3, 5);

      const rotations = (fullRotation * 360) + Math.floor(rng(minRotation, maxRotation));

      wheelElement.style.transform = `rotate(-${rotations}deg)`;

      setTimeout(() => {
        wheelElement.style.transition = 'none';
        finishGame();
      }, 6000);
    }, 0);
  };

  const startGame = () => {
    setHasStarted(true);
  };

  if (!hasStarted) {
    return (
      <div className="flex justify-center flex-col w-1/2 mx-auto py-2">
        <p className="text-center text-lg mb-2">How many points will the wheel give you?</p>
        <Btn onClick={startGame}>Show me the wheel!</Btn>
      </div>
    );
  }

  if (gameFinished) {
    return (
      <Alert type="success">
        <p className="text-2xl font-bold">The wheel has decided!</p>
        { submittingScore && <p>Calculating Score...</p>}
        { !submittingScore && finalScore > 0 && <p>You have earned <b>{finalScore}</b> points! 🎉</p>}
        { !submittingScore && submitError && <p className='text-red-500'>There has been an error calculating your score - Refresh the page and try again!</p>}
        { !submittingScore && submitError && <p className="text-sm italic">Tech savvy? Check the console and report the error!</p>}
        <div className="py-2">
          <a href="/">
            <Btn className="w-full">Advent Selection!</Btn>
          </a>
        </div>
      </Alert>
    );
  }

  return (
    <div className="my-4">
      <div className="relative">
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-10 border-t-black border-l-transparent border-r-transparent" style={{ borderLeftWidth: 12, borderRightWidth: 12, borderTopWidth: 16 }} />
        <div className="relative w-full md:w-1/2 mx-auto overflow-hidden" ref={wheelEle}>
          <div className="w-full rounded-full aspect-square bg-orange-50" style={{ backgroundImage: `conic-gradient(${gradientStr})`}} />
          <div className="absolute inset-0" style={{ transform: `rotate(${rotation}deg)`}}>
          {
            options.map((x, index) => {
              const rawDeg = (index * breakpoint) + breakpoint;
              return (<p className="absolute top-1/2 w-1/2 origin-top-right text-base" style={{ transform: `rotate(${rawDeg}deg) translate(10%, -50%)` }} key={`option-${index}`}>{x.desc}</p>);
            })
          }
          </div>
        </div>
      </div>
      <hr className="w-2/3 h-1 mx-auto my-6 bg-gray-100 border-0 rounded" />
      <div className="w-1/2 mx-auto">
        <Btn onClick={spinTheWheel} className="w-full">Spin the wheel!</Btn>
      </div>
    </div>
  )
};

export default SpinWheel;
