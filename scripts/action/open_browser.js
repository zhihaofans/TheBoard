const { Action } = require("../../NeXT/action");
class OpenBrowser extends Action {
  constructor() {
    super({
      actionName: "使用浏览器打开链接"
    });
    this.ALLOW_URL_DATA = true;
    this.ALLOW_TEXT_DATA = true;
  }
  run() {}
}
module.exports = OpenBrowser;
