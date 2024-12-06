'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import { get, set } from 'idb-keyval';

import type { Wordle, WorldePayload } from "@/app/api/submit-game/calculate-score/wordle";

import logger from "@/logger";
import api from "@/app/utils/api";
import Btn from "@/app/components/btn";
import Alert from "@/app/components/alert";
import Loading from "@/app/components/loading";

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
    return (<Loading />);
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
        { submittingScore && <p>Calculating Score...</p>}
        { !submittingScore && finalScore >= 0 && <p>You have earned <b>{finalScore}</b> points!</p>}
        { !submittingScore && !submitError && !wasCorrect && <p className="text-red-700">Unlucky the word was <b>&quot;{answer}&quot;</b></p> }
        { !submittingScore && submitError && <p className='text-red-500'>There has been an error calculating your score - Refresh the page and try again! (and ensure you are on the VPN 😉)</p>}
        { !submittingScore && submitError && <p className="text-sm italic">Tech savvy? Check the console and report the error!</p>}
        <div className="py-2">
          <a href="/">
            <Btn className="w-full">Advent Selection!</Btn>
          </a>
        </div>
      </Alert>
    );
  }

  const width = answer.length <= 6 ? 'w-1/2' : 'w-full';

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
