export const happenedWithinLastHour = (isoString: string) => {
  const timestamp = Date.parse(isoString);

  if (Number.isNaN(timestamp)) {
    return false;
  }

  const now = Date.now();
  const diff = now - timestamp;
  const oneHour = 60 * 60 * 1000;

  return diff >= 0 && diff <= oneHour;
};

export const happenedWithinLastDay = (timestampRaw: number) => {
  const timestamp = Number(String(timestampRaw).padEnd(13, "0"));

  if (Number.isNaN(timestamp)) {
    return false;
  }

  const now = Date.now();
  const diff = now - timestamp;
  const oneDay = 60 * 60 * 1000 * 24;

  return diff >= 0 && diff <= oneDay;
};
