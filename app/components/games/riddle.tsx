'use client';

import { useRef, useState } from "react";
import prettyMilliseconds from "pretty-ms";

import rng from "@/app/utils/rng";
import api from "@/app/utils/api";
import type { RiddlePayload } from '@/app/api/submit-game/calculate-score/riddle';
import logger from "@/logger";

export interface RiddleDIO {
  question: string;
  options: string[];
  answer: string;
}

interface RiddleWordProps {
  riddle: RiddleDIO;
  nonce: string;
}

const Riddle = ({ riddle, nonce }: RiddleWordProps) => {
  const [hasStarted, setHasStarted] = useState<boolean>(true);
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const [submittingScore, setSubmittingScore] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<number>(0);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  const startGame = () => {
    setHasStarted(true);
  }

  const onGuess = (guess: string) => {
    const correct = btoa(guess.toLowerCase()) === riddle.answer;
    setIsCorrect(correct);
    setGameFinished(true);

    setSubmittingScore(true);

    api.submitGameResult<RiddlePayload>(nonce, {
      wasCorrect: correct,
    })
    .then(s => setFinalScore(s))
    .catch((e) => {
      setSubmitError(true);
      logger.error(e);
    })
    .finally(() => setSubmittingScore(false));
  };

  if (!hasStarted) {
    return (
      <div className="flex justify-center flex-col w-1/2 mx-auto py-2">
        <p className="text-center text-lg mb-2">Wrapped in words, a mystery unfurls, A riddle&apos;s charm, a twist of mind it swirls.</p>
        <button onClick={() => startGame()} className="bg-purple-400 py-1 hover:underline rounded-md">Show me the riddle 🌀</button>
      </div>
    );
  }

  if (gameFinished) {
    return (
      <div className="flex justify-center flex-col w-2/3 mx-auto py-4 mt-2 text-center border rounded-sm drop-shadow-md bg-slate-100">
        <p className="text-2xl mb-2 font-bold">Final Results!</p>
        <div className="mb-2">
          { isCorrect && <p>Well done on guessing correctly 🚀</p>}
          { !isCorrect && <p>That was not the right answer 😭</p>}
          { submittingScore && <p>Calculating Score...</p> }
          { !submittingScore && finalScore >= 0 && <p>You have earned <b>{finalScore}</b> points!</p>}
          { !submittingScore && submitError && <p>There has been an error calculating your score - Refresh the page and try again!</p>}
          { !submittingScore && submitError && <p className="text-sm italic">Tech savvy? Check the console and report the error!</p>}
        </div>
        <a href="/" className="bg-purple-400 py-1 hover:underline rounded-md w-1/2 mx-auto" >Advent Selection!</a>
      </div>
    );
  }

  return (
    <div className="my-4">
      <p className="text-lg font-bold text-center">{riddle.question}</p>
      <div className="flex flex-wrap my-2">
      {
        riddle.options.map(x => (
          <div key={x} className="p-2 w-full md:w-1/2">
            <button onClick={() => onGuess(x)} className="w-full px-2 py-4 bg-fuchsia-300 border-fuchsia-100 border rounded-md drop-shadow-sm hover:underline">{x}</button>
          </div>
        ))
      }
      </div>
    </div>
  )
};

export default Riddle;
