'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Btn from '../btn';
import api from '../../utils/api';
import Alert from '../alert';
import shuffleArray from 'shuffle-array';
import { SliderPayload } from '../../api/submit-game/calculate-score/slider';
import logger from '../../../logger';

type images = 'snowman';
type directions =  'ArrowDown' | 'ArrowUp' | 'ArrowLeft' | 'ArrowRight';

interface ImageGridProps {
  nonce: string;
  gridImage: images;
  size: number;
}

interface ImageData {
  width: number;
  height: number;
}

const SliderGrid = (props: ImageGridProps) => {
  const { gridImage, size, nonce } = props;
  const imageUrl = `/image-grid/${gridImage}/final.jpeg`;

  const lock = useRef<boolean>(false);
  const [imageGrid, setImageGrid] = useState<number[]>([]);
  const [solution, setSolution] = useState<string>('');
  const [numberOfMoves, setNumberOfMoves] = useState<number>(0);

  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const [submittingScore, setSubmittingScore] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<number>(0);

  const isGridSolvable = useCallback((shuffled: number[]) => {
    const inversions = shuffled.reduce((acc, curr, index) => {
      if (curr === -1) {
        return acc;
      }

      return acc + shuffled.slice(index).filter((x) => x != -1 && x < curr).length;
    }, 0);

    const isGridEven = (size * size) % 2 === 0;
    const emptyTileIndex = shuffled.indexOf(-1);
    const emptyTileRow = Math.floor(emptyTileIndex / size) + 1;

    const isSolvable = isGridEven
      ? (inversions + emptyTileRow) % 2 === 0
      : inversions % 2 === 0;

    return isSolvable;
  }, [size]);

  const initGrid = useCallback(() => {
    const grid = Array.from({ length: size * size }).map((_, index) => index);
    grid[grid.length - 1] = -1; // Empty cell
    const shuffled = shuffleArray(grid);

    if (shuffled[shuffled.length - 1] !== -1) {
      const index = shuffled.indexOf(-1);
      const temp = shuffled[shuffled.length - 1];
      shuffled[shuffled.length - 1] = shuffled[index];
      shuffled[index] = temp;
    }

    const isSolvable = isGridSolvable(shuffled);

    if (!isSolvable) {
      if (shuffled[0] !== -1 && shuffled[1] !== -1) {
        const temp = shuffled[0];
        shuffled[0] = shuffled[1];
        shuffled[1] = temp;
      } else {
        const temp = shuffled[shuffled.length - 1];
        shuffled[shuffled.length - 1] = shuffled[shuffled.length - 2];
        shuffled[shuffled.length - 2] = temp;
      }
    }

    setImageGrid(grid);
    setSolution(grid.join(''));
  }, [size, isGridSolvable]);

  const checkForWin = (grid: number[]) => {
    return grid.join('') === solution;
  };

  const finishGame = useCallback(() => {
    setSubmittingScore(true);

    api.submitGameResult<SliderPayload>(nonce, { size, numberOfMoves })
      .then(s => setFinalScore(s))
      .catch((e) => {
        setSubmitError(true);
        logger.error(e);
      })
      .finally(() => setSubmittingScore(false));

    setGameFinished(true);
  }, []);

  const giveUp = () => {
    lock.current = true;
    setNumberOfMoves(-1);
    finishGame();
  };

  const screenReaderScore = () => {
    lock.current = true;
    setNumberOfMoves(size * size);
    finishGame();
  };

  const moveEmptyCell = useCallback((direction: directions) => {
    if (lock.current) {
      return;
    }

    const emptyIndex = imageGrid.indexOf(-1);
    const emptyY = Math.floor(emptyIndex / size);
    const emptyX = emptyIndex % size;

    let targetX = emptyX;
    let targetY = emptyY;

    if (direction === 'ArrowDown' && emptyY - 1 >= 0) {
      targetY = emptyY - 1;
    } else if (direction === 'ArrowUp' && emptyY + 1 < size) {
      targetY = emptyY + 1;
    } else if (direction === 'ArrowLeft' && emptyX + 1 < size) {
      targetX = emptyX + 1;
    } else if (direction === 'ArrowRight' && emptyX - 1 >= 0) {
      targetX = emptyX - 1;
    } else {
      return;
    }

    const targetIndex = targetY * size + targetX;
    const newGrid = [...imageGrid];
    newGrid[emptyIndex] = newGrid[targetIndex];
    newGrid[targetIndex] = -1;

    setImageGrid(newGrid);
    setNumberOfMoves(numberOfMoves + 1);

    if (checkForWin(newGrid)) {
      lock.current = true;
      setTimeout(() => {
        finishGame();
      }, 250);
    }
  }, [imageGrid, numberOfMoves, finishGame, size]);

  useEffect(() => {
    initGrid();
  }, [imageUrl, initGrid]);

  useEffect(() => {
    const keys: directions[] = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];

    const disableArrowKeys = (e: KeyboardEvent) => {
      const k = e.key as directions;
      if (keys.includes(k)) {
        e.preventDefault();
        moveEmptyCell(k);
      }
    }

    document.addEventListener('keydown', disableArrowKeys);

    return () => {
      document.removeEventListener('keydown', disableArrowKeys);
    };
  }, [moveEmptyCell]);

  useEffect(() => {
    const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];

    const disableArrowKeys = (e: KeyboardEvent) => {
      if (keys.includes(e.key)) {
        e.preventDefault();
        moveEmptyCell(e.key as 'ArrowDown' | 'ArrowUp' | 'ArrowLeft' | 'ArrowRight');
      }
    }

    document.addEventListener('keydown', disableArrowKeys);

    return () => {
      document.removeEventListener('keydown', disableArrowKeys);
    };
  }, [moveEmptyCell]);

  if (!hasStarted) {
    return (
      <div className="flex justify-center flex-col w-1/2 mx-auto py-2">
        <p className="text-center text-lg mb-2">Slide puzzle</p>
        <Btn onClick={() => setHasStarted(true)}>Show me the puzzle</Btn>
      </div>
    )
  }

  if (gameFinished) {
    return (
      <Alert type='success'>
        {
          numberOfMoves <= 0 && (
            <p className="text-2xl font-bold">Better luck next time</p>
          )
        }
        {
          numberOfMoves > 0 && (
            <p className="text-2xl font-bold">🎉 Congratulations! You have solved the puzzle! 🎉</p>
          )
        }
        <div className='w-1/2 my-2 mx-auto'>
          <img src={`/image-grid/${gridImage}/final.jpeg`} alt='' />
        </div>
        {
          numberOfMoves > 0 && (
            <p>Total number of moves: {numberOfMoves}</p>
          )
        }
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
    )
  }

  return (
    <div>
      <div className="sr-only"><button onClick={screenReaderScore}>Click here if you are using a screen reader</button></div>
      <div className='w-1/2 mx-auto'>
        <div className='w-full'>
          <h1 className='text-center text-2xl font-bold my-2'>Moves: {numberOfMoves}</h1>
          <div className={`grid grid-cols-${size} grid-rows-${size} aspect-square`}>
            {
              imageGrid.map((tileNumber) => {
                if (tileNumber === -1) {
                  return <div key={tileNumber} className='border-2 border-black' />;
                }

                const y = Math.floor(tileNumber / size);
                const x = (tileNumber % size);

                const xPos = (100 / (size - 1)) * x;
                const yPos = (100 / (size - 1)) * y;

                return (
                  <div key={tileNumber}
                    style={{
                      backgroundImage: `url(${imageUrl})`,
                      backgroundPositionX: `${xPos}%`,
                      backgroundPositionY: `${yPos}%`,
                      backgroundSize: `${size * 100}%`,
                  }}
                    className='border-2 border-black'
                  />
                );
              })
            }
          </div>
          <Btn className='w-full my-4' onClick={giveUp}>Give up!</Btn>
        </div>
      </div>
    </div>
  )
};

export default SliderGrid;
