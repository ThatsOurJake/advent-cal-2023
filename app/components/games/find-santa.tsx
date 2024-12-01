/* eslint-disable @next/next/no-img-element */
'use client';

import { MouseEvent, useCallback, useRef, useState } from "react";
import prettyMilliseconds from "pretty-ms";

import api from "@/app/utils/api";
import logger from "@/logger";
import type { FindPayload } from "@/app/api/submit-game/calculate-score/find";
import Btn from "../btn";
import Alert from "../alert";
import { createPortal } from "react-dom";

interface FindSantaProps {
  baseFolder: string;
  nonce: string;
  averages: number[];
}

const THRESHOLD = 3;
const DELAY = 750;

const FindSanta = ({ baseFolder, nonce, averages }: FindSantaProps) => {
  const [answers, setAnswers] = useState<number[]>([]);
  const [checkmarks, setCheckmarks] = useState<number[][]>([]);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const [submittingScore, setSubmittingScore] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<number>(0);
  const [timeTaken, setTimeTaken] = useState<number>(0);

  const maskRef = useRef<HTMLImageElement>(null);
  const lock = useRef<boolean>(false);
  const startTime = useRef<number>(0);

  const finishGame = useCallback(() => {
    const calculated = Math.ceil((Date.now() - startTime.current) / 1000);

    setSubmittingScore(true);

    api.submitGameResult<FindPayload>(nonce, { timeTaken: calculated, correctGuesses: answers.length })
      .then(s => setFinalScore(s))
      .catch((e) => {
        setSubmitError(true);
        logger.error(e);
      })
      .finally(() => setSubmittingScore(false));

    setTimeTaken(calculated);
    setGameFinished(true);
  }, [nonce, answers]);

  const screenReaderScore = () => {
    lock.current = true;

    setTimeTaken(0);
    setAnswers(averages);

    finishGame();
  };

  const getMousePos = (e: MouseEvent<HTMLImageElement>) => {
    const { clientX, clientY, target } = e;
    const image = target as HTMLImageElement; 
    const { left, top } = image.getBoundingClientRect();
    const scrolledTop = document.documentElement.scrollTop;
    
    return [
      clientX - left,
      clientY - top,
      clientX,
      clientY + scrolledTop,
    ];
  }

  const onLocationClick = useCallback((e: MouseEvent<HTMLImageElement>) => {
    const [ x, y, rawX, rawY ] = getMousePos(e);

    if (!maskRef.current || lock.current) {
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = maskRef.current.clientWidth;
    canvas.height = maskRef.current.clientHeight;

    const ctx = canvas.getContext('2d');

    ctx?.drawImage(maskRef.current, 0, 0, canvas.width, canvas.height);
    const data = ctx?.getImageData(x, y, 1, 1).data!;
    
    const sum = data?.reduce((acc, current) => acc += current, 0);
    const avg = Math.floor(sum / data.length);

    console.log(avg);

    const answer = averages.find(x => {
      const lowerBound = x - THRESHOLD;
      const upperBound = x + THRESHOLD;

      return avg >= lowerBound && avg <= upperBound;
    });

    if (answer && !answers.includes(answer)) {
      const newAnswers = [...answers, answer];
      setAnswers(newAnswers); 
      setCheckmarks([...checkmarks, [rawX - (THRESHOLD * 4), rawY - (THRESHOLD * 4)]]);

      if (newAnswers.length === averages.length) {
        lock.current = true;
        setTimeout(() => finishGame(), DELAY);
      }
    }
  }, [answers, averages, checkmarks, finishGame]);

  const startGame = () => {
    setHasStarted(true);
    startTime.current = Date.now();
  };

  if (!hasStarted) {
    return (
      <div className="flex justify-center flex-col w-1/2 mx-auto py-2">
        <p className="text-center text-2xl mb-1">Santa has gone missing!</p>
        <p className="text-center mb-1">Can you help find them as christmas will be ruined!</p>
        <p className="text-center mb-4">The quicker you find Santa and Santa&apos;s clones the higher your score will be.</p>
        <Btn onClick={startGame}>Show me the image</Btn>
      </div>
    );
  }

  if (gameFinished) {
    return (
      <Alert type="success">
        <p className="text-2xl font-bold">Santa has been found!</p>
        <div className="w-1/3 mx-auto my-1">
          <img className="w-full " src={`/images/${baseFolder}/answers.jpeg`} alt="answers" />
        </div>
        <p>Time taken: {prettyMilliseconds(timeTaken * 1000, { verbose: true })}</p>
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
    <div>
      <div className="sr-only"><button onClick={screenReaderScore}>Click here if you are using a screen reader</button></div>
      <section aria-hidden>
        {createPortal(
          <div className="absolute z-10 inset-0 pointer-events-none">
            {
              checkmarks.map(([x, y]) => <div key={`${x}|${y}`} className="absolute" style={{ top: y, left: x }}><p className="text-2xl">✅</p></div>)
            }
          </div>,
          document.body
        )}
        <div className="relative w-1/2 mx-auto">
          <img onClick={onLocationClick} className="w-full z-10 cursor-pointer" src={`/images/${baseFolder}/guess.jpeg`} />
          <img className="absolute inset-0 opacity-0 pointer-events-none" src={`/images/${baseFolder}/mask.jpeg`} ref={maskRef} />
        </div>
        <hr className="w-2/3 h-1 mx-auto my-6 bg-gray-100 border-0 rounded" />
        <p className="text-center">Found {answers.length} / {averages.length}</p>
        <div className="w-1/3 mx-auto my-2">
          <Btn onClick={() => finishGame()} className="w-full">Give up!</Btn>
        </div>
      </section>
    </div>
  );
};

export default FindSanta;
