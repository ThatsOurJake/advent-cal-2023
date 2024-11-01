'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import shuffle from 'shuffle-array';
import prettyMilliseconds from "pretty-ms";

import api from "@/app/utils/api";
import type { MatchPayload } from "@/app/api/submit-game/calculate-score/match";
import logger from "@/logger";
import Btn from "../btn";
import Alert from "../alert";

interface CardProps {
  isFlipped?: boolean;
  id: string;
  asset: string;
  onClick: (id: string) => void;
}

const Card = ({ isFlipped = false, id, onClick, asset }: CardProps) => {
  return (
    <div className="w-full p-2 aspect-card" id="match-card" data-state={`${isFlipped && 'active'}`} onClick={() => onClick(id)}>
      <div className="match-card-content">
        <div className="match-card-front">
          <div className="bg-main rounded-md cursor-pointer border-4 border-black flex items-center justify-center flex-col h-full">
            <img src="/header.png" className="w-2/3" />
          </div>
        </div>
        <div className="match-card-back">
          <div className="bg-main rounded-md border-4 border-black h-full flex justify-center items-center">
            <img src={`/icons/${asset}.png`} className="w-1/2" />
          </div>
        </div>
      </div>
    </div>
  );
}

export interface GameCell {
  id: string,
  asset: 'bauble' | 'cane' | 'giftbox' | 'gingerbread' | 'jumper' | 'reindeer' | 'santa' | 'sleigh' | 'snowman' | 'tree' | 'wreath',
  isFlipped: boolean,
}

interface MatchPairsProps {
  grid: GameCell[];
  width: number;
  height: number;
  nonce: string;
}

const RESET_TIMEOUT = 650;

const MatchPairs = ({ grid, width, height, nonce }: MatchPairsProps) => {
  const [gameGrid, setGameGrid] = useState<GameCell[]>(shuffle(grid));
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const [timeTaken, setTimeTaken] = useState<number>(0);
  const [submittingScore, setSubmittingScore] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<number>(0);
  
  const startTime = useRef<number>(0);

  if (width*height !== grid.length) {
    logger.warn('Grid Size does not match height and width');
  }

  const currentClicked = useRef<GameCell[]>([]);
  const correctCount = useRef<number>(0);
  const lock = useRef<boolean>(false);

  const resetClickedItems = useCallback(() => {
    const oldGrid = [...gameGrid];
    currentClicked.current.forEach(x => {
      oldGrid.find(y => y.id === x.id)!.isFlipped = false;
    });
    setGameGrid(oldGrid);
    currentClicked.current = [];
  }, [gameGrid]);

  useEffect(() => {
    if (finalScore === 0 && gameGrid.filter(x => x.isFlipped).length === gameGrid.length) {
      window.location.reload();
    }
  }, []);

  const onClick = useCallback((id: string)  => {
    if (lock.current) {
      return;
    }

    lock.current = true;

    let newGrid = [...gameGrid];
    const item = newGrid.find(x => x.id === id)!;

    if (item.isFlipped) {
      return;
    }

    item.isFlipped = true;

    setGameGrid(newGrid);

    const currentClickedRef = currentClicked.current;
    currentClickedRef.push({...item});

    if (currentClickedRef.length === 2) {
      if (currentClickedRef[0].asset != currentClickedRef[1].asset) {
        setTimeout(() => {
          resetClickedItems();
          lock.current = false;
        }, RESET_TIMEOUT);
        return;
      }

      correctCount.current++;
      currentClicked.current = [];

      if (correctCount.current === gameGrid.length / 2) {
        const calculated = Math.ceil((Date.now() - startTime.current) / 1000);
        
        setSubmittingScore(true);

        api.submitGameResult<MatchPayload>(nonce, { timeTaken: calculated })
          .then(s => setFinalScore(s))
          .catch((e) => {
            setSubmitError(true);
            logger.error(e);
          })
          .finally(() => setSubmittingScore(false));

        setTimeout(() => {
          setTimeTaken(calculated);
          setGameFinished(true);
        }, RESET_TIMEOUT);
      }
    }

    lock.current = false;
  }, [gameGrid, resetClickedItems, nonce]);

  const startGame = () => {
    setHasStarted(true);
    startTime.current = Date.now();
  }

  if (!hasStarted) {
    return (
      <div className="flex justify-center flex-col w-1/2 mx-auto py-2">
        <p className="text-center text-lg mb-2">Match <b>{grid.length / 2}</b> Pairs</p>
        <Btn onClick={() => startGame()}>Play!</Btn>
      </div>
    );
  }

  if (gameFinished) {
    return (
      <Alert type="success">
        <p className="text-2xl font-bold">Winner!</p>
        <p>Time taken: {prettyMilliseconds(timeTaken * 1000, { verbose: true })}</p>
        { submittingScore && <p>Calculating Score...</p>}
        { !submittingScore && finalScore > 0 && <p>You have earned <b>{finalScore}</b> points! 🎉</p>}
        { !submittingScore && submitError && <p className='text-red-500'>There has been an error calculating your score - Refresh the page and try again!</p>}
        { !submittingScore && submitError && <p className="text-sm italic">Tech savvy? Check the console and report the error!</p>}
        <div className="my-2">
          <a href="/">
            <Btn className="w-1/3">Advent Selection!</Btn>
          </a>
        </div>
      </Alert>
    );
  }

  if (hasStarted) {
    return (
      <div className={`grid grid-cols-${width} grid-rows-${height}`}>
        {
          gameGrid.map(x => <Card isFlipped={x.isFlipped} id={x.id} key={x.id} onClick={onClick} asset={x.asset} />)
        }
      </div>
    );
  }
};

export default MatchPairs;
