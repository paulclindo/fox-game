// STATE MACHINE
// You either are awake or asleep, with 2 finite number of state
// 5 requirements => Finite number of states and events, an initial state,
// transition function (that determines the next state given) and set of final states

const gameState = {
  current: "INIT",
  clock: 1,
  tick() {
    this.clock++;
    console.log(this.clock);
    return this.clock;
  },
  handleUserAction(icon) {
    console.log(icon);
  },
};
module.exports = gameState;

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
