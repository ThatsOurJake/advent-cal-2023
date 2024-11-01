'use client';

import { useCallback, useRef, useState } from "react";
import prettyMilliseconds from "pretty-ms";

import type { Answer, QuizPayload } from "@/app/api/submit-game/calculate-score/quiz";
import api from "@/app/utils/api";
import logger from "@/logger";
import Btn from "../btn";
import Alert from "../alert";

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
        <Btn onClick={() => startGame()}>I will give it a go!</Btn>
      </div>
    );
  }

  if (gameFinished) {
    return (
      <Alert type="success">
        <p className="text-2xl mb-1 font-bold">Quiz Results!</p>
        <p>Results:</p>
        <ul>
          {
            guesses.map((x, index) => (
              <li key={`guess-${index}`} className="my-1">
                <p className={`${x.wasCorrect ? 'text-green-700' : 'text-red-700'}`}>Question: {questions[index].question}</p>
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
    <div className="my-4">
      <Alert type="info">
        <p className="text-lg font-bold text-center">{currentQuestion.question}</p>
      </Alert>
      <div className="flex flex-wrap my-2">
      {
        currentQuestion.answers.map(x => (
          <div key={x} className="p-2 w-full md:w-1/2">
            <Btn onClick={() => onGuess(x)} className="w-full">{x}</Btn>
          </div>
        ))
      }
      </div>
    </div>
  )
};

export default Quiz;
