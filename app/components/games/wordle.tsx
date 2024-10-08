'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import { get, set } from 'idb-keyval';

import type { Wordle, WorldePayload } from "@/app/api/submit-game/calculate-score/wordle";

import logger from "../../../logger";
import api from "../../utils/api";
import Btn from "../btn";
import Alert from "../alert";

interface WordleProps {
  nonce: string;
  wordle: Wordle;
}

interface LetterState {
  letter: string;
  state: 'NEUTRAL' | 'CORRECT' | 'IN_WORD' | 'USED';
}

interface WordleSquareProps {
  data: LetterState;
}

interface WordleKeyProps extends WordleSquareProps {
  onClick: (key: string) => void;
}

const states = {
  NEUTRAL: 'bg-main',
  CORRECT: 'bg-green-400',
  IN_WORD: 'bg-orange-400',
  USED: 'bg-mainAccent'
};

const DELAY = 750;

const baseClasses = [
  'basis-0',
  'grow',
  'shrink',
  'aspect-square',
  'flex',
  'justify-center',
  'items-center',
  'uppercase',
  'font-bold',
  'rounded-base',
  'select-none',
  'shadow-light',
  'border-2',
  'border-black',
]

const createClasses = (classes: string[]) => [...baseClasses, ...classes].join(' ');

const WordleSquare = ({ data: { letter, state } }: WordleSquareProps) => (<div className={createClasses([
  states[state],
  'text-2xl',
])}><p>{letter}</p></div>);

const KeyboardSquare = ({ data: { letter, state }, onClick }: WordleKeyProps) => (<div onClick={() => onClick(letter)} className={createClasses([
  states[state],
  'cursor-pointer',
  'transition-all',
  'hover:shadow-none',
  'hover:translate-x-boxShadowX',
  'hover:translate-y-boxShadowY'
])}><p>{letter}</p></div>);

const genBlankArray = (wordLength: number): LetterState[] => Array(wordLength).fill({}).map(x => ({ letter: '', state: 'NEUTRAL' }));

const keyboardLetters = [['q', 'w', 'e', 'r', 't', 'y','u', 'i', 'o', 'p'], ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'], ['⏎', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '🔙']];

const Wordle = ({ nonce, wordle }: WordleProps) => {
  const { answer, maxGuesses, wordleId } = wordle;
  const wordLength = answer.length;

  const dictionary = useRef<string[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const [submittingScore, setSubmittingScore] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<number>(0);
  const [wasCorrect, setWasCorrect] = useState<boolean>(false);
  const [invalidWord, setInvalidWord] = useState<boolean>(false);

  const [guesses, setGuesses] = useState<LetterState[][]>([genBlankArray(wordLength)]);
  const [keyboard, setKeyboard] = useState<LetterState[][]>(keyboardLetters.map((row) => row.map(l => ({ letter: l, state: 'NEUTRAL' }))));

  const currentGuess = useRef<number>(0);
  const currentLetter = useRef<number>(0);
  const lock = useRef<boolean>(false);

  const finishGame = useCallback((correct: boolean) => {
    setSubmittingScore(true);

    api.submitGameResult<WorldePayload>(nonce, { attemptsTaken: currentGuess.current, wordleId: wordleId, wasCorrect: correct })
      .then(s => setFinalScore(s))
      .catch((e) => {
        setSubmitError(true);
        logger.error(e);
      })
      .finally(() => setSubmittingScore(false));

    setGameFinished(true);
  }, [nonce, wordleId]);

  const updateGuess = useCallback((key: string) => {
    if (currentLetter.current + 1 > wordLength || lock.current) {
      return
    }

    const copy = [...guesses];
    const guess = copy[currentGuess.current];

    guess[currentLetter.current].letter = key;

    currentLetter.current++;
    setGuesses(copy);
  }, [guesses, currentLetter, currentGuess, wordLength]);

  const removeLastLetter = useCallback(() => {
    if (lock.current || currentLetter.current - 1 < 0) {
      return;
    }

    const copy = [...guesses];
    const guess = copy[currentGuess.current];
    guess[currentLetter.current - 1].letter = '';
    currentLetter.current--;
    setGuesses(copy);
  }, [guesses, currentLetter, currentGuess]);

  const checkGuess = useCallback(() => {
    if (currentLetter.current !== wordLength || lock.current) {
      return;
    }

    lock.current = true;

    const copy = [...guesses];
    const guess = copy[currentGuess.current];
    const copyKeyboard = [...keyboard];

    const guessWord = guess.map(x => x.letter).join('');

    if (dictionary.current.length > 0 && !dictionary.current.find(x => x === guessWord)) {
      console.error('Invalid word');
      lock.current = false;
      setInvalidWord(true);
      return;
    }

    const parts = answer.split('');
    let correctCount = 0;

    guess.forEach((x, index) => {
      const letter = parts[index];

      const keyLetter = copyKeyboard.reduce((acc, current, currentIndex) => {
        const i = current.findIndex(y => y.letter === x.letter);

        if (i >= 0) {
          return [currentIndex, i];
        }

        return acc;
      }, [0, 0]);

      if (x.letter === letter) {
        x.state = 'CORRECT';
        copyKeyboard[keyLetter[0]][keyLetter[1]].state = 'CORRECT';
        correctCount++;
      } else if (parts.includes(x.letter)) {
        copyKeyboard[keyLetter[0]][keyLetter[1]].state = 'IN_WORD';
        x.state = 'IN_WORD';
      } else {
        x.state = 'USED';
        copyKeyboard[keyLetter[0]][keyLetter[1]].state = 'USED';
      }
    });

    guess.forEach((x, index) => {
      const instancesOfLetterInAnswer = parts.filter(y => y === x.letter).length;
      const correctPlacements = guess.filter(y => y.letter === x.letter && y.state === 'CORRECT').length;
      const letterInPreviousIndexes = guess.slice(0, index).filter(y => y.letter === x.letter).length;

      if ((correctPlacements >= instancesOfLetterInAnswer || letterInPreviousIndexes >= instancesOfLetterInAnswer) && x.state === 'IN_WORD') {
        x.state = 'USED';
      }
    });

    if (correctCount === wordLength || currentGuess.current + 1 === maxGuesses) {
      const isCorrect = correctCount === wordLength;
      setWasCorrect(isCorrect);
      setGuesses(copy);
      setTimeout(() => { finishGame(isCorrect) }, DELAY);
      return;
    }
    
    setGuesses([...copy, genBlankArray(wordLength)]);
    setKeyboard(copyKeyboard);
    currentGuess.current++
    currentLetter.current = 0;
    lock.current = false;
  }, [wordLength, answer, currentGuess, guesses, keyboard, maxGuesses, finishGame]);

  const processKey = useCallback((key: string) => {
    setInvalidWord(false);

    if (key === 'Backspace' || key === '🔙') {
      removeLastLetter();
      return;
    }

    if (key === 'Enter' || key === '⏎') {
      checkGuess();
      return;
    }

    if (/^[A-Za-z]$/.test(key)) {
      updateGuess(key.toLowerCase());
    }
  }, [removeLastLetter, checkGuess, updateGuess]);

  useEffect(() => {
    const onKeyUp = ({ key }: KeyboardEvent) => processKey(key);

    document.addEventListener('keyup', onKeyUp);

    return () => {
      document.removeEventListener('keyup', onKeyUp);
    }
  }, [processKey]);

  useEffect(() => {
    setLoading(true);

    const request = async () => {
      try {
        const existingDictionary = await get('dictionary');

        if (existingDictionary) {
          dictionary.current = existingDictionary;
        } else {
          const response = await fetch('/words_alpha.txt');
          const text = await response.text();
          dictionary.current = text.split('\n');
          await set('dictionary', dictionary.current);
        }
      } catch (e) {
        logger.error(e);
      }

      setLoading(false);
    };

    request();
  }, []);

  const startGame = () => {
    setHasStarted(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center gap-y-2">
        <div role="status">
          <svg aria-hidden="true" className="w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-red-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
          </svg>
      </div>
        <p>Preparing the game - please wait...</p>
        <p className="text-sm italic">This may take a few seconds</p>
      </div>
    )
  }

  if (!hasStarted) {
    return (
      <div className="flex justify-center flex-col w-1/2 mx-auto py-2">
        <p className="text-center text-lg mb-2">Can you guess the {wordLength} letter word in {maxGuesses} guesses or less?</p>
        <p className="text-center text-base mb-2">Unsure how to play Wordle, check <a target="_blank" className="text-blue-500 hover:underline" href="https://mashable.com/article/wordle-word-game-what-is-it-explained">this article.</a></p>
        <p className="text-center text-base mb-2">The word will be related to Christmas - Today&apos;s Wordle will most likely not help</p>
        <Btn onClick={() => startGame()}>Lets go!</Btn>
      </div>
    );
  }

  if (gameFinished) {
    return (
      <Alert type="success">
        <p className="text-2xl font-bold">Wordle Result!</p>
        {
          wasCorrect && <p className="text-green-700">Congrats on guessing the word <b>&quot;{answer}&quot;</b></p>
        }
        {
          !wasCorrect && <p className="text-red-700">Unlucky the word was <b>&quot;{answer}&quot;</b></p>
        }
        { submittingScore && <p>Calculating Score...</p>}
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

  const width = answer.length <= 5 ? 'w-1/2' : 'w-full';

  return (
    <div className="flex justify-center my-4">
      <section className={`w-full md:${width}`}>
        <div className="flex flex-col gap-y-2">
          {
            guesses.map((guess, guessIndex) => {
              return (
                <div key={`guess-${guessIndex}`} className="flex flex-row gap-x-4">
                  {
                    guess.map((x, letterIndex) => (<WordleSquare key={`guess-${guessIndex}-${letterIndex}`} data={x} />))
                  }
                </div>
              )
            })
          }
        </div>
        <div className="my-4 text-center">
          {
            invalidWord && (<p>Invalid word - try another one!</p>)
          }
        </div>
        <div className="flex flex-col gap-y-2">
          {
            keyboard.map((row, rowIndex) => {
              return (
                <div key={`row-${rowIndex}`} className="flex flex-row gap-x-2">
                  {
                    row.map((l, index) => (<KeyboardSquare key={`row-${rowIndex}-${index}`} data={l} onClick={processKey} />))
                  }
                </div>
              )
            })
          }
        </div>
      </section>
    </div>
  )
};

export default Wordle;
