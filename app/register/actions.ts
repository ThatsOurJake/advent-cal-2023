'use server';

import { cookies } from 'next/headers'

import mongo from "@/app/services/mongo";
import logger from '@/logger';

export interface RegisterUserResponse {
  uuid?: string;
  error?: boolean;
};

export const registerUser = async (_prevState: unknown, formData: FormData): Promise<RegisterUserResponse> => {
  try {
    const name = formData.get('name')! as string;
    const squad = formData.get('squad')! as string;
  
    const user = await mongo.createUser({ name: name.trim(), squad: squad.trim() });
  
    const { uuid } = user;
    
    cookies().set('x-user-id', uuid, {
      expires: Date.now() + 30 * 24 * 60 * 60 * 1000,
    });

    return {
      uuid,
    };
  } catch (error) {
    logger.error(error);
    return {
      error: true,
    };
  }
};
