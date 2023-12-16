const isDevelopment = process.env.NODE_ENV === 'development';

export default function isValid(value: number) {
  if (!isDevelopment) {
    return new Date(2023, 11, value).valueOf() <= Date.now()
  }

  return true;
};
