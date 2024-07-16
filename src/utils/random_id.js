const CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890";

const randomId = (len) => {
  return [...Array(len)]
    .map(() => CHARS[Math.floor(Math.random() * CHARS.length)])
    .join("");
};

export default randomId;
