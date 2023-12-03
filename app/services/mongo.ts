import { MongoClient, WithId } from "mongodb";
import crypto from "crypto";

import logger from "@/logger";

const uri = "mongodb://0.0.0.0:27017/advent";
const client = new MongoClient(uri);
let isConnected = false;

const connect = async () => {
  if (isConnected) {
    return;
  }

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
  points: number;
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
    points: 0,
    daysComplete: [],
    pointsToDays: [],
  };

  await col.insertOne(obj);

  return obj;
};

const getUser = async (uuid: string): Promise<WithId<CreateUserDTO> | null> => {
  await connect();

  const col = client.db().collection<CreateUserDTO>("users");
  const obj = await col.findOne({ uuid });

  return obj;
};

export type ScoreboardUser = Pick<CreateUserDTO, 'name' | 'squad' | 'points' | 'uuid'>;
type ScoreboardDTO = ScoreboardUser[];

const getScoreboard = async (): Promise<ScoreboardDTO> => {
  await connect();

  const col = client.db().collection<CreateUserDTO>("users");
  const users = await col.find({}).toArray();

  return users.map(x => ({
    name: x.name,
    squad: x.squad,
    points: x.points,
    uuid: x.uuid,
  })).sort((a, b) => a.points - b.points);
};

const addPoints = async (uuid: string, points: number, dayNumber: string) => {
  await connect();

  logger.info('[addPoints] - Executing', __filename);
  const col = client.db().collection<CreateUserDTO>("users");
  const user = await getUser(uuid);

  if (user?.daysComplete.includes(dayNumber)) {
    logger.warn({uuid}, 'Ignoring Score - Already played');
    return;
  }

  await col.findOneAndUpdate({ uuid }, { $inc: { points }, $push: { daysComplete: dayNumber, pointsToDays: { day: dayNumber, points} } });
}

const mongo = {
  createUser,
  getUser,
  getScoreboard,
  addPoints,
};

export default mongo;
