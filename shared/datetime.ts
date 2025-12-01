export const happenedWithinLastTime = (
  isoString: string,
  lastTime: "hour" | "day"
) => {
  const ts = Date.parse(isoString);

  if (Number.isNaN(ts)) {
    return false;
  }

  const now = Date.now();
  const diff = now - ts;
  const sixtyMinutesMs =
    lastTime === "hour" ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000;

  return diff >= 0 && diff <= sixtyMinutesMs;
};
