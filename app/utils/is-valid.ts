const isDevelopment = process.env.NODE_ENV === 'development';

export default function isValid(value: number) {
  if (!isDevelopment) {
    const date = new Date(2024, 11, value);
    return Date.now() >= date.valueOf();
  }

  return true;
};
