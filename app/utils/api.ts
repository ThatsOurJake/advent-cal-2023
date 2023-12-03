interface ResponseData {
  error?: string;
  result?: number;
}

const submitGameResult = async <T>(nonce: string, payload: T): Promise<number> => {
  const res = await fetch('/api/submit-game', {
    body: JSON.stringify({
      nonce,
      payload,
    }),
    method: 'POST',
  });

  const data: ResponseData = await res.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data.result!;
};

const api = {
  submitGameResult,
};

export default api;
