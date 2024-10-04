'use client';

import { useRef, useState } from "react";
import prettyMilliseconds from "pretty-ms";

import rng from "@/app/utils/rng";
import api from "@/app/utils/api";
import type { WordPayload } from "@/app/api/submit-game/calculate-score/word";
import logger from "@/logger";
import Btn from "../btn";
import TextInput from "../text-input";
import Alert from "../alert";

export interface WordAnswer {
  answer: string;
  missingLetters: number[][];
}

interface GuessWordProps {
  words: WordAnswer[];
  nonce: string;
}

interface WordBoxProps {
  word: WordAnswer;
  lock: boolean;
}

const WordBox = ({ word, lock }: WordBoxProps) => {
  const unhashed = atob(word.answer);
  const missingLetters = word.missingLetters[rng(1, word.missingLetters.length + 1) - 1];
  const display = lock ? unhashed : unhashed.split('').map((x, index) => missingLetters.includes(index) ? '_' : x);

  return (
    <div className="flex flex-col items-center my-4">
      <p className="font-bold text-3xl text-center">{display}</p>
      <TextInput placeholder="Guess Here!" className="w-2/3" data-id-hash={word.answer} />
    </div>
  )
};

const ANIMATION_DELAY = 750;

const GuessWord = ({ words, nonce }: GuessWordProps) => {
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const [timeTaken, setTimeTaken] = useState<number>(0);
  const [submittingScore, setSubmittingScore] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<number>(0);

  const lock = useRef<boolean>(false);
  const correctGuesses = useRef<number>(0);
  const startTime = useRef<number>(0);

  const startGame = () => {
    setHasStarted(true);
    startTime.current = Date.now();
  }

  const checkGuesses = () => {
    if (lock.current) {
      return;
    }

    lock.current = true;

    const inputs = document.querySelectorAll('input');

    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      input.setAttribute('disabled', 'true');
      const isCorrect = atob(input.getAttribute('data-id-hash')!) === input.value.toLowerCase().trim();
      const classes = isCorrect ? ['border-lime-500', 'bg-lime-100'] : ['border-red-500', 'bg-red-100']  
      const isLast = i === inputs.length - 1;

      if (isCorrect) {
        correctGuesses.current++;
      }

      setTimeout(() => {
        input.classList.add(...classes);

        if (isLast) {
          const calculated = Math.ceil((Date.now() - startTime.current) / 1000);
          setTimeTaken(calculated);

          setTimeout(() => {
            setSubmittingScore(true);
            setGameFinished(true);

            api.submitGameResult<WordPayload>(nonce, {
              numberCorrect: correctGuesses.current,
              timeTaken: calculated
            })
            .then(s => setFinalScore(s))
            .catch((e) => {
              setSubmitError(true);
              logger.error(e);
            })
            .finally(() => setSubmittingScore(false));

          }, ANIMATION_DELAY);
        }
      }, ANIMATION_DELAY * (i + 1));
    }
  };

  if (!hasStarted) {
    return (
      <div className="flex justify-center flex-col w-1/2 mx-auto py-2">
        <p className="text-center text-lg mb-2">Guess the words from the missing letters.</p>
        <p className="text-center text-lg mb-2">For example E__no_ = Eggnog.</p>
        <Btn onClick={() => startGame()}>Start Game!</Btn>
      </div>
    );
  }

  if (gameFinished) {
    return (
      <Alert type="info">
        <p className="text-2xl font-bold">Final Results:</p>
        <ul>
          {
            words.map((x, index) => (<li className="list-decimal list-inside" key={`word-${index}`}>{atob(x.answer)}</li>))
          }
        </ul>
        <p>It took {prettyMilliseconds(timeTaken * 1000, { verbose: true })} to guess {correctGuesses.current} / {words.length} correct!</p>
        { submittingScore && <p>Calculating Score...</p>}
        { !submittingScore && finalScore > 0 && <p>You have earned <b>{finalScore}</b> points! 🎉</p>}
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
      {
        words.map(x => (<WordBox word={x} key={x.answer} lock={lock.current} />))
      }
      <div className="w-1/2 mx-auto">
        <Btn onClick={() => checkGuesses()} className="w-full">Submit Guesses!</Btn>
      </div>
    </div>
  )
};

export default GuessWord;
