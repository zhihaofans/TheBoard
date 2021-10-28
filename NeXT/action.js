const ActionLib = {
  
};

class Action {
  constructor({ actionName }) {
    this.ACTION_NAME = actionName;
    this.ALLOW_URL_DATA = false;
    this.ALLOW_TEXT_DATA = false;
    this.contextData = undefined;
  }
  run(data) {
    $console.warn("Action.run");
    this.contextData = data;
  }
}
module.exports = {
  Action,
  ActionLib
};
