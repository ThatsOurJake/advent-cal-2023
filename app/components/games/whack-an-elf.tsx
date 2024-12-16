"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { WhackPayload } from "@/app/api/submit-game/calculate-score/whack";
import api from "@/app/utils/api";
import logger from "@/logger";

import Btn from "../btn";
import Alert from "../alert";

export interface TimelineItem {
  zone: 1 | 2 | 3 | 4 | 5;
  visibleForSecs: number;
  isElf: boolean;
  delay: number;
}

const INITIAL_DELAY = 1000;

const assets = {
  elf: "/whack-an-elf/elf01.png",
  elfSplat: "/whack-an-elf/elf02.png",
  deer: "/whack-an-elf/deer01.png",
  deerSplat: "/whack-an-elf/deer02.png",
};

interface WhackAnElfProps {
  timeline: TimelineItem[];
  nonce: string;
}

const WhackAnElf = ({ timeline, nonce }: WhackAnElfProps) => {
  const zoneOne = useRef<HTMLDivElement>(null);
  const zoneTwo = useRef<HTMLDivElement>(null);
  const zoneThree = useRef<HTMLDivElement>(null);
  const zoneFour = useRef<HTMLDivElement>(null);
  const zoneFive = useRef<HTMLDivElement>(null);

  const [elvesWhacked, setElvesWhacked] = useState(0);
  const [deersWhacked, setDeersWhacked] = useState(0);

  const elvesWhackedRef = useRef(elvesWhacked);
  const deersWhackedRef = useRef(deersWhacked);

  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const [submittingScore, setSubmittingScore] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<number>(0);

  const zones = useMemo(() => [zoneOne, zoneTwo, zoneThree, zoneFour, zoneFive], []);

  const animate = (
    zone: HTMLDivElement,
    visibleForSecs: number,
    isElf: boolean
  ) => {
    if (zone) {
      const image = zone.querySelector("img");
      if (image) {
        if (isElf) {
          image.src = assets.elf;
        } else {
          image.src = assets.deer;
        }

        image.dataset.isElf = isElf.toString();
        image.style.transform = "translateY(0)";

        setTimeout(() => {
          image.style.transform = "translateY(100%)";
        }, visibleForSecs);
      }
    }
  };

  const finishGame = useCallback(() => {
    setSubmittingScore(true);
    setGameFinished(true);

    api.submitGameResult<WhackPayload>(nonce, { elvesWhacked: elvesWhackedRef.current, deersWhacked: deersWhackedRef.current })
      .then((s) => setFinalScore(s))
      .catch((e) => {
        setSubmitError(true);
        logger.error(e);
      })
      .finally(() => setSubmittingScore(false));
  }, [nonce]);

  useEffect(() => {
    if (!hasStarted) {
      return;
    }

    timeline.forEach((item) => {
      const zoneIndex = item.zone - 1;

      if (!zones[zoneIndex] || !zones[zoneIndex].current) {
        return;
      }

      const zone = zones[zoneIndex].current;

      setTimeout(() => {
        animate(zone, item.visibleForSecs, item.isElf);
      }, INITIAL_DELAY + item.delay);
    });

    const uniqueVisibleForSecs = timeline.map((item) => item.visibleForSecs);
    const totalDuration = Math.max(...uniqueVisibleForSecs) + INITIAL_DELAY + timeline[timeline.length - 1].delay;

    setTimeout(() => {
      finishGame();
    }, totalDuration);
  }, [zones, timeline, hasStarted, finishGame]);

  const onImgClick = (e: React.MouseEvent<HTMLImageElement>) => {
    const image = e.target as HTMLImageElement;
    const isElf = image.dataset.isElf === "true";

    if (isElf) {
      image.src = assets.elfSplat;
      setElvesWhacked(elvesWhacked + 1);
      elvesWhackedRef.current = elvesWhacked + 1;
    } else {
      image.src = assets.deerSplat;
      setDeersWhacked(deersWhacked + 1);
      deersWhackedRef.current = deersWhacked + 1;
    }
  };

  const startGame = () => {
    setHasStarted(true);
  };

  if (!hasStarted) {
    return (
      <div className="flex justify-center flex-col w-1/2 mx-auto py-2">
        <p className="text-center text-2xl mb-1">Splat them Elves!</p>
        <p className="text-center mb-1">They really love snowball fights, can you splat all the elves?</p>
        <p className="text-center mb-1"><b>BEWARE</b> the reindeer are passing through and do not like being hit!</p>
        <p className="text-center mb-4">You will gain points for each elf hit and a penalty for each reindeer hit.</p>
        <Btn onClick={startGame}>Start Game ❄️</Btn>
      </div>
    );
  }

  if (gameFinished) {
    return (
      <Alert type="success">
        <p className="text-2xl font-bold">That was fun!</p>
        { submittingScore && <p>Calculating Score...</p>}
        { !submittingScore && !submitError && (
          <>
            <p>Elves Whacked: {elvesWhacked}</p>
            <p>Reindeer Whacked: {deersWhacked}</p>
          </>
        )}
        { !submittingScore && finalScore >= 0 && <p>You have earned <b>{finalScore}</b> points! 🎉</p>}
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
      <p className="text-xl font-bold text-center">Whack an elf!</p>
      <div className="flex justify-center gap-x-2">
        <p className="text-center">Elves Whacked: {elvesWhacked}</p>
        <p>|</p>
        <p className="text-center">Reindeer Whacked: {deersWhacked}</p>
      </div>
      <div className="w-full md:w-3/4 mx-auto my-2 relative aspect-video">
        <img
          src="/whack-an-elf/lay02.png"
          className="absolute z-20 pointer-events-none"
        />
        <div className="absolute z-10 inset-0 ">
          <div
            ref={zoneOne}
            className="absolute cursor-pointer overflow-hidden"
            style={{
              width: "8%",
              left: "16%",
              top: "64%",
            }}
          >
            <img
              src="/whack-an-elf/elf01.png"
              id="image"
              className="w-full h-full translate-y-full transition-transform"
              onClick={onImgClick}
            />
          </div>
          <div
            ref={zoneTwo}
            className="absolute cursor-pointer overflow-hidden"
            style={{
              width: "8%",
              left: "34%",
              top: "42%",
            }}
          >
            <img
              src="/whack-an-elf/elf01.png"
              className="w-full h-full translate-y-full transition-transform"
              onClick={onImgClick}
            />
          </div>
          <div
            ref={zoneThree}
            className="absolute cursor-pointer overflow-hidden"
            style={{
              width: "8%",
              left: "52%",
              top: "65%",
            }}
          >
            <img
              src="/whack-an-elf/elf01.png"
              className="w-full h-full translate-y-full transition-transform"
              onClick={onImgClick}
            />
          </div>
          <div
            ref={zoneFour}
            className="absolute cursor-pointer overflow-hidden"
            style={{
              width: "8%",
              left: "65%",
              top: "59%",
            }}
          >
            <img
              src="/whack-an-elf/elf01.png"
              className="w-full h-full translate-y-full transition-transform"
              onClick={onImgClick}
            />
          </div>
          <div
            ref={zoneFive}
            className="absolute cursor-pointer overflow-hidden"
            style={{
              width: "8%",
              left: "80%",
              top: "66%",
              transform: "rotate(-30deg)",
            }}
          >
            <img
              src="/whack-an-elf/elf01.png"
              className="w-full h-full translate-y-full transition-transform"
              onClick={onImgClick}
            />
          </div>
        </div>
        <img
          src="/whack-an-elf/lay01.png"
          className="absolute pointer-events-none"
        />
      </div>
    </div>
  );
};

export default WhackAnElf;
