const Kernel = require("../NeXT/kernel"),
  Keyboard = require("../NeXT/keyboard"),
  kb = new Keyboard({});
class AppKernel extends Kernel {
  constructor() {
    super({ debugMode: true });
    this.global = {
      SQLITE_DIR: "/assets/.files/sqlite/"
    };
    this.viewLoader.registerView({
      id: "main",
      title: this.appInfo.name,
      icon: undefined,
      fileName: "main.js",
      func: "init"
    });
    this.viewLoader.registerView({
      id: "keyboard",
      title: "undefined",
      icon: undefined,
      fileName: "keyboard.js",
      func: "init"
    });
    this.viewLoader.setLaunchViewId("main");
    this.viewLoader.setKeyboardViewId("keyboard");
  }
  init() {
    if (this.debug === true) {
      $console.info("init");
      $console.info(this.appInfo);
    }
    if (kb.isKeyboard()) {
      this.viewLoader.openKeyboardView();
    } else {
      this.viewLoader.openLaunchView();
    }
  }
}

module.exports = AppKernel;
