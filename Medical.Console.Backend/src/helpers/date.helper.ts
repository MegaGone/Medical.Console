export const unixDate = (): string => {
  return JSON.stringify(Math.floor(Date.now() / 1000));
};
