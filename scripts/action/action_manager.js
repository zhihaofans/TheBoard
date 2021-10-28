const { Action } = require("../../NeXT/action");
class ActionManager extends Action {
  constructor(actionRunner) {
    super({
      actionName: "动作管理",
      hidden: true
    });
    this.actionRunner = actionRunner;
    this.ALLOW_URL_DATA = true;
    this.ALLOW_TEXT_DATA = true;
    this.HAS_KEYBOARD_DATA = false;
    this.HAS_CLIPBOARD_DATA = false;
  }
  run(data) {
    if (data == undefined || data.length == 0) {
      $ui.toast("空白内容");
    } else {
      $ui.alert({
        title: "",
        message: data,
        actions: [
          {
            title: "OK",
            disabled: false, // Optional
            handler: () => {}
          }
        ]
      });
    }
  }
}
module.exports = ActionManager;
