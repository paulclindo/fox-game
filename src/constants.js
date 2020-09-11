export const ICONS = ["fish", "poop", "weather"];
export const TICK_RATE = 2500;
export const RAIN_CHANCE = 0.6;
export const SCENES = ["day", "rain"];
export const DAY_LENGTH = 30;
export const NIGHT_LENGTH = 6;

export const getNextHungerTime = (clock) =>
  Math.floor(Math.random() * 3) + 5 + clock; // 5,6,7 + clock
export const getNextDieTime = (clock) =>
  Math.floor(Math.random() * 2) + 3 + clock; // 3,4 + clock
export const getNextPoopTime = (clock) =>
  Math.floor(Math.random() * 3) + 4 + clock; // 3,4 + clock
