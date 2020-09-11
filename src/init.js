import gameState, { handleUserAction } from "./gameState";
import initButtons from "./button";
import { TICK_RATE } from "./constants";

async function init() {
  initButtons(handleUserAction);
  console.log("starting the game now!");
  let nextTimeToTick = Date.now();

  function nextAnimationFrame() {
    const now = Date.now();
    if (nextTimeToTick <= now) {
      gameState.tick();
      nextTimeToTick = now + TICK_RATE;
    }
    requestAnimationFrame(nextAnimationFrame);
  }
  nextAnimationFrame();
}
init();
