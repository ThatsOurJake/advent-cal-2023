'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import type { Wordle, WorldePayload } from "@/app/api/submit-game/calculate-score/wordle";
import logger from "../../../logger";
import api from "../../utils/api";

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
  NEUTRAL: 'bg-slate-200',
  CORRECT: 'bg-lime-200',
  IN_WORD: 'bg-orange-200',
  USED: 'bg-slate-400'
};

const DELAY = 750;

const WordleSquare = ({ data: { letter, state } }: WordleSquareProps) => (<div className={`basis-0 grow shrink aspect-square rounded-md ${states[state]} flex justify-center items-center uppercase font-bold`}><p>{letter}</p></div>);

const KeyboardSquare = ({ data: { letter, state }, onClick }: WordleKeyProps) => (<div onClick={() => onClick(letter)} className={`basis-0 grow shrink aspect-square rounded-md ${states[state]} flex justify-center items-center uppercase font-bold cursor-pointer`}><p>{letter}</p></div>);

const genBlankArray = (wordLength: number): LetterState[] => Array(wordLength).fill({}).map(x => ({ letter: '', state: 'NEUTRAL' }));

const keyboardLetters = [['q', 'w', 'e', 'r', 't', 'y','u', 'i', 'o', 'p'], ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'], ['⏎', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '🔙']];

const Wordle = ({ nonce, wordle }: WordleProps) => {
  const { answer, maxGuesses, wordleId } = wordle;
  const wordLength = answer.length;

  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const [submittingScore, setSubmittingScore] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<number>(0);
  const [wasCorrect, setWasCorrect] = useState<boolean>(false);

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

  const startGame = () => {
    setHasStarted(true);
  };

  if (!hasStarted) {
    return (
      <div className="flex justify-center flex-col w-1/2 mx-auto py-2">
        <p className="text-center text-lg mb-2">Can you guess the {wordLength} letter word in {maxGuesses} guesses or less?</p>
        <p className="text-center text-base mb-2">Unsure how to play Wordle, check <a target="_blank" className="text-blue-500 hover:underline" href="https://mashable.com/article/wordle-word-game-what-is-it-explained">this article.</a></p>
        <p className="text-center text-base mb-2">The word will be related to Christmas - Today&apos;s Wordle will most likely not help</p>
        <button onClick={() => startGame()} className="bg-purple-400 py-1 hover:underline rounded-md">Lets go!</button>
      </div>
    );
  }

  if (gameFinished) {
    return (
      <div className="flex justify-center flex-col w-2/3 mx-auto py-4 mt-2 text-center border rounded-sm drop-shadow-md bg-slate-100">
        <p className="text-2xl mb-2 font-bold">That&apos;s Wordle!</p>
        <div className="mb-2">
          {
            wasCorrect && <p className="text-green-500">Congrats on guessing the word &quot;{answer}&quot;</p>
          }
          {
            !wasCorrect && <p className="text-red-500">Unlucky the word was &quot;{answer};&quot;</p>
          }
          { submittingScore && <p>Calculating Score...</p>}
          { !submittingScore && finalScore >= 0 && <p>You have earned <b>{finalScore}</b> points!</p>}
          { !submittingScore && submitError && <p>There has been an error calculating your score - Refresh the page and try again!</p>}
          { !submittingScore && submitError && <p className="text-sm italic">Tech savvy? Check the console and report the error!</p>}
        </div>
        <a href="/" className="bg-purple-400 py-1 hover:underline rounded-md w-1/2 mx-auto" >Advent Selection!</a>
      </div>
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
        <div className="flex flex-col gap-y-2 mt-4">
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
