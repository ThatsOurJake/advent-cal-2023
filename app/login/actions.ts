'use server';

import { cookies } from 'next/headers'

import logger from "@/logger";
import mongo from "@/app/services/mongo";

export interface LoginUserResponse {
  error?: boolean;
  notFound?: boolean;
  signedIn?: boolean;
};

export const signIn = async (_prevState: unknown, formData: FormData): Promise<LoginUserResponse> => {
  try {
    const uuid = formData.get('uuid')! as string;

    const user = await mongo.getUser(uuid.trim());

    if (!user) {
      return {
        notFound: true,
      }
    }

    cookies().set('x-user-id', user.uuid, {
      expires: Date.now() + 30 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    return {
      signedIn: true,
    };
  } catch (error) {
    logger.error(error);
    return {
      error: true,
    };
  }
};
