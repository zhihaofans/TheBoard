class ActionRunner {
  constructor(appKernel) {
    this.appKernel = appKernel;
    this.ACTION_DIR = "/scripts/action/";
    this.launcherActionId = "action_manager";
  }
  getAction(actionId) {
    const jsData = require(`${this.ACTION_DIR}${actionId}.js`),
      action = new jsData(this);
    if (typeof action.run === "function") {
      return action;
    } else {
      return undefined;
    }
  }
  runAction(actionId, data) {
    const action = this.getAction(actionId);
    if (action != undefined) {
      action.run(data);
      return true;
    } else {
      return false;
    }
  }
  getActionList() {
    const actionList = [],
      fileList = $file.list(this.ACTION_DIR);
    if (fileList.length > 0) {
      fileList.map(actionId => {
        if (
          !$file.isDirectory(this.ACTION_DIR + actionId) &&
          actionId.endsWith(".js")
        ) {
          const jsData = require(`${this.ACTION_DIR}${actionId}.js`),
            action = new jsData(this);
          if (typeof action.run === "function") {
            actionList.push({
              id: actionId,
              title: action.ACTION_NAME
            });
          }
        }
      });
    } else {
      return undefined;
    }
  }
}
module.exports = {
  ActionRunner
};
