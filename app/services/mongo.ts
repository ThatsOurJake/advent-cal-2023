import { MongoClient, WithId } from "mongodb";
import crypto from "crypto";
import cfenv from 'cfenv';

import logger from "@/logger";
import sumArray from "@/app/utils/sum-arr";

const getUri = (): string => {
  const serviceName = process.env.MONGO_SERVICE_NAME;
  const replicaSet = 'nimbusReplicaSet';

  if (serviceName) {
    const appEnv = cfenv.getAppEnv();
    const serviceCredentials = appEnv.getServiceCreds(serviceName);

    if (serviceCredentials) {
      return `${serviceCredentials.uri}?replicaSet=${replicaSet}`;
    }
  }

  return "mongodb://0.0.0.0:27017/advent";
}

const client = new MongoClient(getUri());
let isConnected = false;

const connect = async () => {
  if (isConnected) {
    return;
  }

  client.on('close', () => (isConnected = false));

  await client.connect();
  isConnected = true;
  logger.info("Connected to mongo");
};

interface CreateUserDIO {
  name: string;
  squad: string;
}

interface CreateUserDTO {
  name: string;
  squad: string;
  uuid: string;
  daysComplete: string[];
  pointsToDays: { day: string; points: number }[];
}

const createUser = async (data: CreateUserDIO): Promise<CreateUserDTO> => {
  await connect();

  const col = client.db().collection<CreateUserDTO>("users");
  const obj: CreateUserDTO = {
    name: data.name,
    squad: data.squad,
    uuid: crypto.randomUUID(),
    daysComplete: [],
    pointsToDays: [],
  };

  await col.insertOne(obj);

  return obj;
};

interface UserWithScore extends CreateUserDTO {
  points: number;
}

const getUser = async (uuid: string): Promise<UserWithScore | null> => {
  await connect();

  const col = client.db().collection<CreateUserDTO>("users");
  const obj = await col.findOne({ uuid });

  if (obj) {
    return {
      ...obj,
      points: sumArray(obj.pointsToDays.map(x => x.points)),
    }
  }

  return null;
};

export type ScoreboardUser = Pick<CreateUserDTO, 'name' | 'squad' | 'uuid'> & { points: number, position?: number };
type ScoreboardDTO = ScoreboardUser[];

const getScoreboard = async (): Promise<ScoreboardDTO> => {
  await connect();

  const col = client.db().collection<CreateUserDTO>("users");
  const users = await col.find({}).toArray();
  let currentPosition = 1;

  return users.map(x => ({
    name: x.name,
    squad: x.squad,
    points: sumArray(x.pointsToDays.map(x => x.points)),
    uuid: x.uuid,
  }))
  .filter(x => !(x.name.toLowerCase() === 'jake king' && x.squad.toLowerCase() === 'jp'))
  .sort((a, b) => b.points - a.points)
  .reduce((acc: ScoreboardDTO, current) => {
    const prev = [...acc].pop();

    if (prev && prev.points !== current.points) {
      currentPosition++;
    }

    return [...acc, {
      ...current,
      position: currentPosition
    }];
  }, []);
};

const addPoints = async (uuid: string, points: number, dayNumber: string) => {
  await connect();

  logger.info(`[addPoints] - Executing ${points}`);
  const col = client.db().collection<CreateUserDTO>("users");
  const user = await getUser(uuid);

  if (user?.daysComplete.includes(dayNumber)) {
    logger.warn({uuid}, 'Ignoring Score - Already played');
    return;
  }

  await col.findOneAndUpdate({ uuid }, { $push: { daysComplete: dayNumber, pointsToDays: { day: dayNumber, points} } });
}

const mongo = {
  createUser,
  getUser,
  getScoreboard,
  addPoints,
};

export default mongo;
