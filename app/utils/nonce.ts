import type { Game } from "@/app/api/submit-game/calculate-score";

export const generateNonce = (day: string, game: Game): string => {
  return Buffer.from(`${crypto.randomUUID}|${day}|${game}|${Date.now()}`, 'utf-8').toString('base64');
};

export const parseNonce = (nonce: string): { day: number; game: Game; timeStarted: number } | null => {
  const rawString = Buffer.from(nonce, 'base64').toString('utf-8');

  const [_, day, game, timeStarted] = rawString.split('|') as [string, string, Game, string];

  if (!day || !game || !timeStarted) {
    return null;
  }

  const parsedDay = parseInt(day, 10);

  if (isNaN(parsedDay) || parsedDay < 1 || parsedDay > 25) {
    return null;
  }

  return {
    day: parsedDay,
    game,
    timeStarted: parseInt(timeStarted, 1000),
  }
};

