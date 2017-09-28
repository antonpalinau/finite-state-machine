class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
      if (!config) {
          throw new Error("There's no config");
      }
      this.config = config;
      this.state = config.initial;
      this.story = [];
      this.story.push(this.state);
      this.actualState = 0;
      this.isUndo = false;
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
      return this.state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
      if (!(state in this.config.states)) {
          throw new Error("State doesn't exist");
      } else{
        this.state = state;
        this.actualState++;
        if (this.isUndo) {
            this.story = this.story.slice(0, this.actualState);
            this.isUndo = false;
        }
        this.story.push(this.state);
      }
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
      if (!(event in this.config.states[this.state].transitions)) {
          throw new Error("Transition doesn't exixt in the current state!")
      } else {
        this.state = this.config.states[this.state].transitions[event];
        this.actualState++;
        if (this.isUndo) {
            this.story = this.story.slice(0, this.actualState);
            this.isUndo = false;
        }
        this.story.push(this.state);
      }
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
      this.state = this.config.initial;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
      if (!event) {
          const arr = [];
          for (var state in this.config.states) {
              arr.push(state);
          }
          return arr;
      }
      const arr = [];
      for (var state in this.config.states) {
          if (event in this.config.states[state].transitions) {
              arr.push(state);
          }
      }
      return arr;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
      if (this.story.length <= 1) {
          return false;
      }
      if (this.actualState === 0 ) {
          return false;
      }
      this.actualState--;
      this.state = this.story[this.actualState];
      this.isUndo = true;
      return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
      if (this.story.length <= 1) {
          return false;
      }
      if (this.actualState === this.story.length - 1 ) {
          return false;
      }
      this.actualState++;
      this.state = this.story[this.actualState];
      return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
      this.story = [];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
