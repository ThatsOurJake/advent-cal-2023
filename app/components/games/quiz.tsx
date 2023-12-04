'use client';

import { useCallback, useRef, useState } from "react";
import prettyMilliseconds from "pretty-ms";

import type { Answer, QuizPayload } from "@/app/api/submit-game/calculate-score/quiz";
import api from "@/app/utils/api";
import logger from "@/logger";

export interface Question {
  question: string;
  answer: string;
  answers: string[];
}

interface QuizProps {
  questions: Question[];
  nonce: string;
}

const Quiz = ({ nonce, questions }: QuizProps) => {
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const [submittingScore, setSubmittingScore] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<number>(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [guesses, setGuesses] = useState<Answer[]>([]);
  
  const startTime = useRef<number>(0);

  const currentQuestion = questions[currentQuestionIndex];

  const finishGame = useCallback((payload: Answer[]) => {
    setGameFinished(true);
    setSubmittingScore(true);

    api.submitGameResult<QuizPayload>(nonce, {
      answers: payload,
    })
    .then(s => setFinalScore(s))
    .catch((e) => {
      setSubmitError(true);
      logger.error(e);
    })
    .finally(() => setSubmittingScore(false));
  }, [nonce]);

  const onGuess = useCallback((guess: string) => {
    const correct = btoa(guess.toLowerCase()) === currentQuestion.answer;
    const calculated = Math.ceil((Date.now() - startTime.current) / 1000);
    const newGuesses = [...guesses, { wasCorrect: correct, timeTaken: calculated }];

    setGuesses(newGuesses);
    startTime.current = Date.now();

    const next = currentQuestionIndex + 1;

    if (next === questions.length) {
      finishGame(newGuesses);
    } else {
      setCurrentQuestionIndex(next);
    }

  }, [guesses, currentQuestionIndex, currentQuestion.answer, questions.length, finishGame]);

  const startGame = () => {
    setHasStarted(true);
    startTime.current = Date.now();
  };

  if (!hasStarted) {
    return (
      <div className="flex justify-center flex-col w-1/2 mx-auto py-2">
        <p className="text-center text-lg mb-2">Can you answer the following <b>{questions.length}</b> questions correctly?</p>
        <button onClick={() => startGame()} className="bg-purple-400 py-1 hover:underline rounded-md">I will give it a go!</button>
      </div>
    );
  }

  if (gameFinished) {
    return (
      <div className="flex justify-center flex-col w-2/3 mx-auto py-4 mt-2 text-center border rounded-sm drop-shadow-md bg-slate-100">
        <p className="text-2xl mb-2 font-bold">Quiz Master Flash!</p>
        <div className="mb-2">
          <p>Results:</p>
          <ul>
            {
              guesses.map((x, index) => (
                <li key={`guess-${index}`} className="py-2 px-3">
                  <p className={`${x.wasCorrect ? 'text-green-500' : 'text-red-500'}`}>{questions[index].question}</p>
                  {
                    x.wasCorrect && <p>Answered correctly in {prettyMilliseconds(x.timeTaken * 1000, { verbose: true })}</p>
                  }
                  {
                    !x.wasCorrect && <p>Correct answer: {atob(questions[index].answer)}</p>
                  }
                </li>
              ))
            }
          </ul>
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
      <p className="text-center text-lg font-bold">{currentQuestion.question}</p>
      <div className="flex flex-wrap my-2">
      {
        currentQuestion.answers.map(x => (
          <div key={x} className="p-2 w-full md:w-1/2">
            <button onClick={() => onGuess(x)} className="w-full px-2 py-4 bg-fuchsia-300 border-fuchsia-100 border rounded-md drop-shadow-sm hover:underline">{x}</button>
          </div>
        ))
      }
      </div>
    </div>
  )
};

export default Quiz;
