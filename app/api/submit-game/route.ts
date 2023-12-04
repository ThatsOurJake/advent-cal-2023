import { parseNonce } from "@/app/utils/nonce";
import dayGameMap from "@/app/api/day-game-map";
import { cookies } from "next/headers";
import mongo from "@/app/services/mongo";

import CALCULATOR_MAP from "./calculate-score";
import { MatchPayload } from "./calculate-score/match";

interface BasePayload {
  nonce: string;
  payload: object;
}

const TIMEFRAME = 0.5 * 60 * 60 * 1000;

export async function POST(req: Request) {
  const data: BasePayload = await req.json();
  const userId = cookies().get('x-user-id')?.value;

  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorised'}), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }

  if (!data.nonce) {
    return new Response(JSON.stringify({ error: 'Body must have a nonce and game'}), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }

  const nonce = parseNonce(data.nonce);

  if (!nonce) {
    return new Response(JSON.stringify({ error: 'Nonce is invalid'}), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }

  const { day, game, timeStarted } = nonce;

  const gameMapping = dayGameMap[day];

  if (!gameMapping || gameMapping !== game) {
    return new Response(JSON.stringify({ error: 'Invalid Mapping'}), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }

  if (timeStarted + TIMEFRAME > Date.now()) {
    return new Response(JSON.stringify({ error: 'Nonce expired'}), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }

  const calculator = CALCULATOR_MAP[game];
  let points = 0;

  if (calculator) {
    points = calculator(data.payload);
  }

  if (points > 0) {
    await mongo.addPoints(userId, points, day);

    return Response.json({
      result: points,
    });
  }

  return new Response(JSON.stringify({ error: 'An Error has occurred'}), {
    status: 400,
    headers: {
      'Content-Type': 'application/json',
    }
  });
};
