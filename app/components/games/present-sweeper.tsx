'use client';

import { useCallback, useEffect, useRef, useState } from "react";

import logger from "@/logger";

import type { SweeperPayload } from "@/app/api/submit-game/calculate-score/sweeper";
import Alert from "@/app/components/alert";
import Btn from "@/app/components/btn";
import api from "@/app/utils/api";

export interface Grid {
  width: number;
  height: number;
  presentSpots: { x: number, y: number }[];
  hash: string;
}

interface PresentSweeperProps {
  nonce: string;
  grid: Grid;
  totalTries: number;
}

const cellBaseClasses = [
  'aspect-square',
  'w-full',
  'rounded-base',
  'border-2',
  'border-black',
  'flex',
  'justify-center',
  'items-center',
  'select-none'
];

const nonSelectedClasses = [
  'bg-gray-50',
  'shadow-dark',
  'cursor-pointer',
  'transition-all',
  'hover:shadow-none',
  'hover:translate-x-boxShadowX',
  'hover:translate-y-boxShadowY'
];

const selectedClasses = [
  'bg-gray-500',
  'translate-x-boxShadowX',
  'translate-y-boxShadowY'
];

interface CoOrds {
  x: number;
  y: number;
}

interface CellMetadata {
  isPresent: boolean;
  neighbourCount: number;
  beenSelected: boolean;
  isHighlighted: boolean;
}

interface Cell {
  x: number;
  y: number;
  metadata?: CellMetadata;
}

interface CellProps extends Cell {
  onClick: (x: number, y: number, highlight?: boolean) => void;
}

const colourMap: Record<number, string> = {
  1: 'text-green-500',
  2: 'text-yellow-500',
  3: 'text-orange-500'
};

const revealNeighbours = (
  coords: CoOrds,
  presentSpots: CoOrds[],
  gridSize: { width: number, height: number },
  checked: CoOrds[] = [],
  cells: Cell[] = [],
) => {
  const { x, y } = coords;

  const neighbours: { x: number, y: number }[] = [
    { x: x, y: y - 1 },     // top
    { x: x - 1, y: y },     // left
    { x: x + 1, y: y },     // right
    { x: x, y: y + 1 },     // bottom
  ];

  if (checked.some(cell => cell.x === x && cell.y === y)) {
    return cells;
  }

  checked.push({ x, y });

  const isPresentSpot = presentSpots.some(presentSpot => presentSpot.x === x && presentSpot.y === y);

  if (isPresentSpot) {
    cells.push({ x, y, metadata: { isPresent: true, neighbourCount: 0, beenSelected: true, isHighlighted: false } });
    return cells;
  }

  const presentCountInNeighbours = presentSpots.filter(presentSpot => {
    return neighbours.some(neighbour => neighbour.x === presentSpot.x && neighbour.y === presentSpot.y);
  }).length;

  if (presentCountInNeighbours > 0) {
    cells.push({ x, y, metadata: { isPresent: false, neighbourCount: presentCountInNeighbours, beenSelected: true, isHighlighted: false } });
    return cells;
  }

  cells.push({ x, y, metadata: { isPresent : false, neighbourCount: 0, beenSelected: true, isHighlighted: false } });

  neighbours.forEach(neighbour => {
    if (neighbour.x < 0 || neighbour.x >= gridSize.width || neighbour.y < 0 || neighbour.y >= gridSize.height) {
      return;
    }

    revealNeighbours({
      x: neighbour.x,
      y: neighbour.y
    }, presentSpots, gridSize, checked, cells);
  });

  return cells;
};

const Cell = ({ x, y, onClick, metadata }: CellProps) => {
  const { beenSelected = false, isPresent = false, neighbourCount = 0, isHighlighted } = metadata || {};

  const classes = [
    ...cellBaseClasses,
    ...(!beenSelected ? nonSelectedClasses : selectedClasses),
    colourMap[neighbourCount] || 'text-white'
  ];

  const onClickHandler = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    
    if (event.button === 2) {
      onClick(x, y, true);
      return;
    }

    onClick(x, y);
  }, [x, y, onClick]);

  return (
    <div className={classes.join(' ')} onClick={onClickHandler} onContextMenu={onClickHandler}>
      {
        beenSelected && isPresent ? (
          <img src="/icons/giftbox.png" className="w-1/2" />
        ) : null
      }
      {
        beenSelected && !isPresent && neighbourCount > 0 ? (
          <p className="font-bold text-4xl">{neighbourCount}</p>
        ) : null
      }
      {
        !beenSelected && isHighlighted ? (
          <img src="/remove.png" className="w-1/2" />
        ) : null
      }
    </div>
  )
};

const PresentSweeper = (props: PresentSweeperProps) => {
  const { grid, nonce, totalTries } = props;
  const { width, height, presentSpots } = grid;
  const [selectedCells, setSelectedCells] = useState<Cell[]>([]);
  const [presentsFound, setPresentsFound] = useState<number>(0);
  const [triesLeft, setTriesLeft] = useState<number>(totalTries);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [gameFinished, setGameFinished] = useState<boolean>(false);

  const [submittingScore, setSubmittingScore] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<number>(0);
  const lock = useRef(false);

  const onCellClick = useCallback((x: number, y: number, highlight = false) => {
    if (lock.current) {
      return;
    }

    const currentCell = selectedCells.find(cell => cell.x === x && cell.y === y);

    if (currentCell?.metadata?.beenSelected) {
      return;
    }

    const copy = [...selectedCells];

    if (highlight) {
      const index = copy.findIndex(cell => cell.x === x && cell.y === y);
      
      if (index > -1) {
        copy.splice(index, 1);
      }

      const isHighlighted = !currentCell?.metadata?.isHighlighted;

      setSelectedCells([...copy, { x, y, metadata: { isPresent: false, neighbourCount: 0, beenSelected: false, isHighlighted } }]);
      return;
    }

    if (currentCell?.metadata?.isHighlighted) {
      const index = copy.findIndex(cell => cell.x === x && cell.y === y);
      copy.splice(index, 1);
    } 

    const cells = revealNeighbours({ x, y }, presentSpots, { width, height });

    cells.forEach(cell => {
      const existingCell = copy.find(c => c.x === cell.x && c.y === cell.y);

      if (existingCell) {
        const index = copy.findIndex(c => c.x === cell.x && c.y === cell.y);
        copy[index] = cell;
      } else {
        copy.push(cell);
      }
    });

    if (!cells) {
      return;
    }

    const presentCount = cells.filter(cell => cell.metadata?.isPresent).length;
    
    setTriesLeft(triesLeft - 1);
    setPresentsFound(presentsFound + presentCount);
    setSelectedCells([...copy, ...cells]);
  }, [height, presentSpots, presentsFound, selectedCells, triesLeft, width]);

  const startGame = useCallback(() => {
    setHasStarted(true);
  }, []);

  useEffect(() => {
    if (presentSpots.length === presentsFound || triesLeft === 0) {
      lock.current = true;
      setTimeout(() => {
        setGameFinished(true);
        setSubmittingScore(true);
        const selectedCellsHash = window.btoa(JSON.stringify(selectedCells.map((cell) => ({
          x: cell.x,
          y: cell.y,
        }))));

        api.submitGameResult<SweeperPayload>(nonce, {
          gameHash: `${grid.hash}|${selectedCellsHash}`,
          presentsFound,
          triesLeft,
        })
        .then(s => setFinalScore(s))
        .catch(e => {
          setSubmitError(true);
          logger.error(e);
        })
        .finally(() => setSubmittingScore(false));
      }, 750);
    }
  }, [triesLeft, presentsFound, presentSpots, nonce, grid, selectedCells]);

  const screenReaderScore = () => {
    setSelectedCells(presentSpots.map(({ x, y }) => ({ x, y, metadata: { isPresent: true, neighbourCount: 0, beenSelected: true, isHighlighted: false } })));
    setPresentsFound(presentSpots.length);
  };

  if (!hasStarted) {
    return (
      <div className="flex justify-center flex-col w-1/2 mx-auto py-2">
        <p className="text-center text-lg mb-2">Present Sweeper - Find <b>{presentSpots.length}</b> in <b>{totalTries}</b> guesses.</p>
        <div className="space-y-1 my-2">
          <p>How to play!</p>
          <ul>
            <li className="list-disc list-inside">The gameplay is similar to Minesweeper but without the fear of blowing up!</li>
            <li className="list-disc list-inside">Clicking a cell will return either blank or a number, the number is how many presents are in the region.</li>
            <li className="list-disc list-inside">A region is either above, below or to the sides. NOT diagonal!</li>
            <li className="list-disc list-inside">Left click to select a cell and right click to visually mark it if you feel that cell is safe.</li>
          </ul>
        </div>
        <Btn onClick={() => startGame()}>Play!</Btn>
      </div>
    ); 
  }

  if (gameFinished) {
    return (
      <Alert type="success">
        <p className="text-2xl font-bold">You found {presentsFound} present(s)</p>
        { submittingScore && <p>Calculating Score...</p>}
        { !submittingScore && finalScore > 0 && <p>You have earned <b>{finalScore}</b> points! 🎉</p>}
        { !submittingScore && finalScore === 0 && <p>You did not find any presents and therefore score <b>0</b> points</p>}
        { !submittingScore && submitError && <p className='text-red-500'>There has been an error calculating your score - Refresh the page and try again!</p>}
        { !submittingScore && submitError && <p className="text-sm italic">Tech savvy? Check the console and report the error!</p>}
        <div className="my-2">
          <a href="/">
            <Btn className="w-1/3">Advent Selection!</Btn>
          </a>
        </div>
      </Alert>
    );
  };

  return (
    <div className="my-4">
      <div className="sr-only"><button onClick={screenReaderScore}>Click here if you are using a screen reader</button></div>
      <div className="text-center my-2">
        <p>Presents found: <b>{presentsFound}/{presentSpots.length}</b></p>
        <p>Guesses left: <b>{triesLeft}</b></p>
      </div>
      <div className={`grid grid-cols-${grid.width} gap-4 w-1/3 mx-auto`}>
      {
        Array.from({ length: width * height }).map((_, i) => {
          const x = i % width;
          const y = Math.floor(i / width);
          const cell = selectedCells.find(cell => cell.x === x && cell.y === y);
          const metadata = {
            beenSelected: cell?.metadata?.beenSelected || false,
            isPresent: cell?.metadata?.isPresent || false,
            neighbourCount: cell?.metadata?.neighbourCount || 0,
            isHighlighted: cell?.metadata?.isHighlighted || false
          };

          return (
            <Cell key={i} x={x} y={y} metadata={metadata} onClick={onCellClick} />
          );
        })
      }
      </div>
    </div>
  )
};

export default PresentSweeper;
