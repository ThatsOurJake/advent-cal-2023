'use client';

import { useRef, useState } from "react";
import prettyMilliseconds from "pretty-ms";

import rng from "@/app/utils/rng";
import api from "@/app/utils/api";
import type { WordPayload } from "@/app/api/submit-game/calculate-score/word";
import logger from "@/logger";

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
}

const WordBox = ({ word }: WordBoxProps) => {
  const unhashed = atob(word.answer);
  const missingLetters = word.missingLetters[rng(1, word.missingLetters.length + 1) - 1];
  const display = unhashed.split('').map((x, index) => missingLetters.includes(index) ? '_' : x);

  return (
    <div className="flex flex-col items-center my-4">
      <p className="font-bold text-3xl text-center">{display}</p>
      <input type="text" placeholder="Guess Here!" className="w-2/3 border border-indigo-100 px-2 py-1 rounded-md" data-id-hash={word.answer} />
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
        <button onClick={() => startGame()} className="bg-purple-400 py-1 hover:underline rounded-md">Play!</button>
      </div>
    );
  }

  if (gameFinished) {
    return (
      <div className="flex justify-center flex-col w-2/3 mx-auto py-4 mt-2 text-center border rounded-sm drop-shadow-md bg-slate-100">
        <p className="text-2xl mb-2 font-bold">Final Results:</p>
        <div className="mb-2">
          <p>It took {prettyMilliseconds(timeTaken * 1000, { verbose: true })} to guess {correctGuesses.current} / {words.length} correct!</p>
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
    <div className="my-4">
      {
        words.map(x => (<WordBox word={x} key={x.answer} />))
      }
      <button onClick={() => checkGuesses()} className="bg-purple-400 py-1 px-3 hover:underline rounded-md block mx-auto">Submit Guesses!</button>
    </div>
  )
};

export default GuessWord;
