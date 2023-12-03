export const generateNonce = (day: string, game: string): string => {
  return Buffer.from(`${crypto.randomUUID}|${day}|${game}|${Date.now()}`, 'utf-8').toString('base64');
};

export const parseNonce = (nonce: string): { day: string; game: string; timeStarted: number } | null => {
  const rawString = Buffer.from(nonce, 'base64').toString('utf-8');

  const [_, day, game, timeStarted] = rawString.split('|');

  if (!day || !game || !timeStarted) {
    return null;
  }

  return {
    day,
    game,
    timeStarted: parseInt(timeStarted, 1000),
  }
};

