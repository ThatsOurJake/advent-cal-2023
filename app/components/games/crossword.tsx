"use client";

import React, { useRef, useState } from "react";
import type { CrosswordPayload, Puzzle, Word } from "@/app/api/submit-game/calculate-score/crossword";
import api from "@/app/utils/api";
import logger from "@/logger";

import Alert from "../alert";
import Btn from "../btn";

interface CellProps {
  isInput: false;
  key: string;
}

interface InputCellProps {
  isInput: true;
  key: string;
  onArrowPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  hintNumber?: number;
  gridX: number;
  gridY: number;
  locked: boolean;
}

const Cell = (props: CellProps | InputCellProps) => {
  const { isInput, key } = props;
  const ref = useRef<HTMLInputElement>(null);

  if (isInput) {
    const { onArrowPress, hintNumber, gridX, gridY, locked } = props as InputCellProps;

    return (
      <div
        key={key}
        className={`${locked ? 'bg-green-100' : 'bg-white'} aspect-square border-2 border-black relative`}
      >
        <p className="text-sm absolute left-0 top-0 p-1">{hintNumber}</p>
        <input
          ref={ref}
          type="text"
          className="w-full h-full bg-transparent text-center uppercase"
          maxLength={1}
          onKeyUp={onArrowPress}
          data-grid-x={gridX}
          data-grid-y={gridY}
          disabled={locked}
        />
      </div>
    );
  }

  return <div key={key} className="bg-black aspect-square" />;
};

interface HintRowProps {
  word: Word;
  focusCell: (x: number, y: number) => void;
}

const HintRow = ({ word, focusCell }: HintRowProps) => {
  const prefix = word.isAcross ? "across" : "down";
  return (
    <p
      key={`${prefix}-${word.hintNumber}`}
      className="cursor-pointer hover:underline"
      onClick={() => focusCell(word.x, word.y)}
    >
      [{word.hintNumber}] {word.hint} ({word.answer.length})
    </p>
  );
};

const arrowKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

interface CrosswordProps {
  nonce: string;
  puzzle: Puzzle;
}

const Crossword = (props: CrosswordProps) => {
  const loadTime = new Date().getTime();
  const { puzzle: { puzzleId, words, height, width }, nonce } = props;

  const [submittingScore, setSubmittingScore] = useState(false);
  const [finalScore, setFinalScore] = useState<number>(0);
  const [submitError, setSubmitError] = useState<boolean>(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [lock, setLock] = useState(false);

  const baseGrid = Array.from({ length: width * height }, (_, i) =>
    Cell({
      isInput: false,
      key: `blank-${i}`,
    })
  );

  const onArrowPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { key, target } = e;
    const { dataset, value, selectionStart } = target as HTMLInputElement;
    const { gridX, gridY, prevSelectionStart } = dataset;

    if (!arrowKeys.includes(key)) {
      return;
    }

    const parsedGridX = parseInt(gridX!);
    const parsedGridY = parseInt(gridY!);

    const nextX =
      key === "ArrowRight"
        ? parsedGridX + 1
        : key === "ArrowLeft"
        ? parsedGridX - 1
        : parsedGridX;
    const nextY =
      key === "ArrowDown"
        ? parsedGridY + 1
        : key === "ArrowUp"
        ? parsedGridY - 1
        : parsedGridY;

    if (nextX < 0 || nextX >= width || nextY < 0 || nextY >= height) {
      return;
    }

    const nextCell = baseGrid[nextY * width + nextX];
    const parsedPrevSelectionStart = parseInt(prevSelectionStart || "1", 10);

    if (nextCell && nextCell.props?.children?.length === 2) {
      const input = nextCell.props.children[1].ref.current;

      if (value.length > 0 && parsedPrevSelectionStart !== selectionStart) {
        dataset.prevSelectionStart = selectionStart?.toString();
        return;
      }

      input?.focus();
    }
  };

  const checkForCompletion = () => {
    let numberOfCorrectAnswers = 0;

    words.forEach((word) => {
      const { answer, x, y, isAcross } = word;
      const start = y * width + x;
      const length = answer.length;

      let correct = true;

      for (let i = 0; i < length; i++) {
        const cellIndex = isAcross ? start + i : start + i * width;
        const cell = baseGrid[cellIndex];
        const cellLetter = cell.props.children[1].ref.current?.value;

        if (cellLetter.toUpperCase() !== answer[i].toUpperCase()) {
          correct = false;
          break;
        }
      }

      if (correct) {
        numberOfCorrectAnswers++;
      }
    });

    if (numberOfCorrectAnswers !== words.length) {
      alert("Not all answers are correct, keep trying!");
      return;
    }

    setSubmittingScore(true);
    setGameFinished(true);
    setLock(true);

    api.submitGameResult<CrosswordPayload>(nonce, { puzzleId, timeStarted: loadTime })
      .then(s => setFinalScore(s))
      .catch((e) => {
        setSubmitError(true);
        logger.error(e);
      })
      .finally(() => setSubmittingScore(false));
  };

  const focusCell = (x: number, y: number) => {
    const cell = baseGrid[y * width + x];
    const input = cell.props.children[1].ref.current;

    input?.focus();
  };

  words.forEach((word) => {
    const { answer, x, y, isAcross, hintNumber } = word;
    const start = y * width + x;
    const length = answer.length;

    for (let i = 0; i < length; i++) {
      const isStart = i === 0;
      const cellIndex = isAcross ? start + i : start + i * width;
      const prefixKey = isAcross ? "across" : "down";

      baseGrid[cellIndex] = Cell({
        isInput: true,
        key: `${prefixKey}-${hintNumber}-${i}`,
        onArrowPress,
        hintNumber: isStart ? hintNumber : undefined,
        gridX: isAcross ? x + i : x,
        gridY: isAcross ? y : y + i,
        locked: lock,
      });
    }
  });

  return (
    <div className="w-full">
      <div className="my-2">
        <Alert type="info">
          <p className="font-bold">Christmas Crossword!</p>
          <p>
            Use the arrow keys to navigate the crossword puzzle and fill in the
            answers.
          </p>
          <p>
            Once you are happy with your answers click &quot;Check
            Answers!&quot;
          </p>
          <p>This puzzle has no time pressure 😊</p>
        </Alert>
      </div>
      <div className="w-2/3 mx-auto my-2">
        <div
          className={`grid grid-cols-${width} grid-rows-${height} text-black`}
        >
          {baseGrid}
        </div>
      </div>
      {
        gameFinished && (
          <Alert type="success">
            { submittingScore && <p>Calculating Score...</p>}
            { !submittingScore && finalScore >= 0 && <p>You have earned <b>{finalScore}</b> points! 🎉</p>}
            { !submittingScore && submitError && <p className='text-red-500'>There has been an error calculating your score - Refresh the page and try again!</p>}
            { !submittingScore && submitError && <p className="text-sm italic">Tech savvy? Check the console and report the error!</p>}
            <div className="py-2">
              <a href="/">
                <Btn className="w-full">Advent Selection!</Btn>
              </a>
            </div>
          </Alert>
        )
      }
      <div className="flex w-3/4 mx-auto my-6 p-2 bg-violet-300 rounded-base shadow-light border-2 border-black text-black">
        <div className="w-1/2 px-2">
          <p className="text-center font-bold">Across</p>
          {words
            .filter((word) => word.isAcross)
            .map((word) => {
              return (<HintRow key={`across-${word.hintNumber}`} word={word} focusCell={focusCell} />);
            })}
        </div>
        <div className="w-1/2 px-2">
          <p className="text-center font-bold">Down</p>
          {words
            .filter((word) => !word.isAcross)
            .map((word) => {
              return (<HintRow key={`across-${word.hintNumber}`} word={word} focusCell={focusCell} />);
            })}
        </div>
      </div>
      {
        !gameFinished && (
          <Btn onClick={checkForCompletion} className="w-1/3 block mx-auto my-2">
            Check answers!
          </Btn>
        )
      }
    </div>
  );
};

export default Crossword;
