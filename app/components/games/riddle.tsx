'use client';

import { useState } from "react";

import api from "@/app/utils/api";
import type { RiddlePayload } from '@/app/api/submit-game/calculate-score/riddle';
import logger from "@/logger";
import Btn from "../btn";
import Alert from "../alert";

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
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const [submittingScore, setSubmittingScore] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<number>(0);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  const startGame = () => {
    setHasStarted(true);
  };

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
        <Btn onClick={startGame}>Show me the riddle 🌀</Btn>
      </div>
    );
  }

  if (gameFinished) {
    return (
      <Alert type="success">
        <p className="text-2xl font-bold">Final Results!</p>
        { isCorrect && <p>Well done on guessing correctly 🚀</p>}
        { !isCorrect && <p>That was not the right answer 😭</p>}
        { submittingScore && <p>Calculating Score...</p> }
        { !submittingScore && finalScore >= 0 && <p>You have earned <b>{finalScore}</b> points!</p>}
        { !submittingScore && submitError && <p>There has been an error calculating your score - Refresh the page and try again!</p>}
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
      <Alert type="info">
        <p className="text-lg font-bold text-center">{riddle.question}</p>
      </Alert>
      <div className="flex flex-wrap my-2">
      {
        riddle.options.map(x => (
          <div key={x} className="p-2 w-full md:w-1/2">
            <Btn onClick={() => onGuess(x)} className="w-full">{x}</Btn>
          </div>
        ))
      }
      </div>
    </div>
  )
};

export default Riddle;
