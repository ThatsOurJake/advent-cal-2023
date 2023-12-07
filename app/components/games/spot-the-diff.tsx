/* eslint-disable @next/next/no-img-element */
'use client';

import { MouseEvent, useCallback, useRef, useState } from "react";
import prettyMilliseconds from "pretty-ms";

import api from "@/app/utils/api";
import type { DiffPayload } from "@/app/api/submit-game/calculate-score/diff";
import logger from "@/logger";

interface SpotTheDiffProps {
  baseFolder: string;
  nonce: string;
  averages: number[];
}

const THRESHOLD = 3;
const DELAY = 750;

const SpotTheDiff = ({ baseFolder, nonce, averages }: SpotTheDiffProps) => {
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

  const finishGame = useCallback((correctGuesses: number ) => {
    if (lock.current) {
      return;
    }

    lock.current = true;

    const calculated = Math.ceil((Date.now() - startTime.current) / 1000);

    setSubmittingScore(true);

    api.submitGameResult<DiffPayload>(nonce, { timeTaken: calculated, correctGuesses })
      .then(s => setFinalScore(s))
      .catch((e) => {
        setSubmitError(true);
        logger.error(e);
      })
      .finally(() => setSubmittingScore(false));

    setTimeTaken(calculated);
    setGameFinished(true);
  }, [nonce]);

  const screenReaderScore = () => {
    setTimeTaken(0);
    setAnswers(averages);

    finishGame(averages.length);
  };

  const getMousePos = (e: MouseEvent<HTMLImageElement>) => {
    const { clientX, clientY, target } = e;
    const image = target as HTMLImageElement; 
    const { left, top } = image.getBoundingClientRect();
    
    return [
      clientX - left,
      clientY - top,
      clientX,
      clientY
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
        setTimeout(() => finishGame(newAnswers.length), DELAY);
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
        <p className="text-center text-lg mb-2">Can you spot the differences between the left and right image?</p>
        <button onClick={() => startGame()} className="bg-purple-400 py-1 hover:underline rounded-md">Show me the images</button>
      </div>
    );
  }

  if (gameFinished) {
    return (
      <div className="flex justify-center flex-col w-2/3 mx-auto py-4 mt-2 text-center border rounded-sm drop-shadow-md bg-slate-100">
        <p className="text-2xl mb-2 font-bold">An Inspector never forgets their magnifying glass!</p>
        <div className="w-1/2 mx-auto mb-2">
          <img className="w-full p-2" src={`/images/${baseFolder}/answers.jpeg`} onClick={onLocationClick} alt="answers" />
        </div>
        <div className="mb-2">
          <p>Time taken: {prettyMilliseconds(timeTaken * 1000, { verbose: true })}</p>
          { submittingScore && <p>Calculating Score...</p>}
          { !submittingScore && finalScore > 0 && <p>You have earned <b>{finalScore}</b> points! 🎉</p>}
          { !submittingScore && submitError && <p>There has been an error calculating your score - Refresh the page and try again!</p>}
          { !submittingScore && submitError && <p className="text-sm italic">Tech savvy? Check the console and report the error!</p>}
        </div>
        <a href="/" className="bg-purple-400 py-1 hover:underline rounded-md w-1/2 mx-auto" >Advent Selection!</a>
      </div>
    );
  }

  return (
    <div>
      <div className="sr-only"><button onClick={screenReaderScore}>Click here if you are using a screen reader</button></div>
      <section aria-hidden>
        <div className="fixed z-10 inset-0 pointer-events-none">
          {
            checkmarks.map(([x, y]) => <div key={`${x}|${y}`} className="absolute" style={{ top: y, left: x }}><p className="text-2xl">✅</p></div>)
          }
        </div>
        <div className="grid grid-cols-1 grid-rows-2 md:grid-rows-1 md:grid-cols-2">
          <div className="w-full relative cursor-not-allowed">
            <img className="p-2 absolute inset-0 z-10" src={`/images/${baseFolder}/original.jpeg`} alt="original"/>
            <img className="p-2 absolute inset-0" src={`/images/${baseFolder}/mask.jpeg`} alt="mask" ref={maskRef} />
          </div>
          <div className="cursor-pointer">
            <img className="w-full p-2" src={`/images/${baseFolder}/hidden.jpeg`} onClick={onLocationClick} alt="guess" />
            <p className="text-sm text-center italic">Guess Image</p>
          </div>
        </div>
        <hr className="w-2/3 h-1 mx-auto my-6 bg-gray-100 border-0 rounded dark:bg-gray-700" />
        <p className="italic text-center text-sm">Pinch and zoom on a macbook should zoom in!</p>
        <p className="text-center">Found {answers.length} / {averages.length}</p>
        <button onClick={() => finishGame(answers.length)} className="bg-purple-400 py-1 px-4 my-2 hover:underline rounded-md mx-auto block">Give up!</button>
      </section>
    </div>
  );
};

export default SpotTheDiff;
