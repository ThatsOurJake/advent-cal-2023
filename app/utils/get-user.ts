import { cookies } from 'next/headers';
import mongo from '@/app/services/mongo';
import { RedirectType, redirect } from 'next/navigation';

const getUser = async () => {
  const cookie = cookies();
  const userId = cookie.get('x-user-id')?.value;

  if (!userId) {
    return redirect('/login', RedirectType.replace);
  }

  const user = await mongo.getUser(userId);

  if (!user) {
    return redirect('/login', RedirectType.replace);
  }

  return user;
}

export default getUser;
