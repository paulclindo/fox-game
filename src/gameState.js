import { modFox, modScene, togglePoopBag, writeModal } from "./ui";
// STATE MACHINE
// You either are awake or asleep, with 2 finite number of state
// 5 requirements => Finite number of states and events, an initial state,
// transition function (that determines the next state given) and set of final states
import {
  RAIN_CHANCE,
  SCENES,
  DAY_LENGTH,
  NIGHT_LENGTH,
  getNextDieTime,
  getNextHungerTime,
  getNextPoopTime,
} from "./constants";

const gameState = {
  current: "INIT",
  clock: 1,
  wakeTime: -1,
  scene: 0,
  sleepTime: -1,
  hungryTime: -1,
  dieTime: -1,
  timeToStartCelebrating: -1,
  timeToEndCelebrating: -1,
  popTime: -1,
  tick() {
    this.clock++;
    console.log(this.clock, "clock");
    if (this.clock === this.wakeTime) {
      this.wake();
    } else if (this.clock === this.sleepTime) {
      this.sleep();
    } else if (this.clock === this.hungryTime) {
      this.getHungry();
    } else if (this.clock === this.dieTime) {
      this.die();
    } else if (this.clock === this.timeToStartCelebrating) {
      this.startCelebrating();
    } else if (this.clock === this.timeToEndCelebrating) {
      this.endCelebrating();
    } else if (this.clock === this.popTime) {
      this.poop();
    }
    return this.clock;
  },
  startGame() {
    console.log("start");
    this.current = "HASHING";
    this.wakeTime = this.clock + 3;
    modFox("egg");
    modScene("day");
    writeModal();
  },
  wake() {
    console.log("awoken");
    this.current = "IDLING";
    this.waitTime = -1;
    this.scene = Math.random() > RAIN_CHANCE ? 0 : 1;
    modScene(SCENES[this.scene]);
    this.sleepTime = this.clock + DAY_LENGTH;
    this.hungryTime = getNextHungerTime(this.clock);
    this.determineFoxState();
    console.log("hungry", this.hungryTime);
  },
  sleep() {
    console.log("sleep");
    this.current = "SLEEP";
    modFox("sleep");
    modScene("night");
    this.clearTimes();
    this.wakeTime = this.clock + NIGHT_LENGTH;
  },
  poop() {
    this.current = "POOPING";
    this.popTime = -1;
    this.dieTime = getNextDieTime(this.clock);
    modFox("pooping");
  },
  die() {
    console.log("dead");
    this.current = "DEAD";
    modFox("dead");
    modScene("dead");
    this.clearTimes();
    writeModal("The fox died :( <br/> Press the middle button to start again!");
  },
  getHungry() {
    console.log("hungry niw!");
    this.current = "HUNGRY";
    this.dieTime = getNextDieTime(this.clock);
    this.hungryTime = -1;
    modFox("hungry");
  },
  startCelebrating() {
    this.current = "CELEBRATING";
    modFox("celebrate");
    this.timeToStartCelebrating = -1;
    this.timeToEndCelebrating = this.clock + 2;
  },
  endCelebrating() {
    this.timeToEndCelebrating = -1;
    this.current = "IDLING";
    this.determineFoxState();
    togglePoopBag(false);
  },
  determineFoxState() {
    if (this.current === "IDLING") {
      if (SCENES[this.scenes] === "rain") {
        modFox("rain");
      } else {
        modFox("idling");
      }
    }
  },
  clearTimes() {
    // reset timer
    this.wakeTime = -1;
    this.sleepTime = -1;
    this.hungryTime = -1;
    this.dieTime = -1;
    this.popTime = -1;
    this.timeToStartCelebrating = -1;
    this.timeToEndCelebrating = -1;
  },
  handleUserAction(icon) {
    console.log(icon);
    if (
      ["SLEEP", "FEEDING", "CELEBRATING", "HATCHING"].includes(this.current)
    ) {
      return;
    }
    if (this.current === "INIT" || this.current === "DEAD") {
      this.startGame();
      return;
    }

    switch (icon) {
      case "weather":
        this.changeWeather();
        break;
      case "poop":
        this.cleanUpPoop();
        break;
      case "fish":
        this.feed();
        break;
    }
  },
  changeWeather() {
    this.scene = (this.scene + 1) % SCENES.length;
    modScene(SCENES[this.scene]);
    this.determineFoxState();
  },
  cleanUpPoop() {
    console.log("clean up poop");
    if (this.current !== "POOPING") return;
    // this.current = ""
    this.dieTime = -1;
    togglePoopBag(true);
    this.startCelebrating();
    this.hungryTime = getNextHungerTime(this.clock);
  },
  feed() {
    console.log("feed");
    if (this.current !== "HUNGRY") {
      return;
    }
    this.current = "FEEDING";
    this.dieTime = -1;
    this.poopTime = getNextPoopTime(this.clock);
    modFox("eating");
    this.timeToStartCelebrating = this.clock + 2;
    this.popTime = this.clock + 6;
  },
};

// binding context to be 'this' to gameState
export const handleUserAction = gameState.handleUserAction.bind(gameState);
export default gameState;

// [
//   "INIT",
//   "HATCHING",
//   "IDLING",
//   "SLEEPING",
//   "EATING",
//   "POOPING",
//   "HUNGRY",
//   "CELEBRATING",
//   "DEAD",
// ];
