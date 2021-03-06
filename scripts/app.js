const { Kernel } = require("../NeXT/kernel"),
  Keyboard = require("../NeXT/keyboard"),
  kb = new Keyboard({});
class AppKernel extends Kernel {
  constructor() {
    super();
    this.setDebug(true);
    this.setKeyboardMode(true);
    this.global = {
      SQLITE_DIR: "/assets/.files/sqlite/",
      KEYBOARD_HEIGHT: 360
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
    this.viewLoader.setLaunchViewId("keyboard");
    this.viewLoader.setKeyboardViewId("keyboard");
  }
  init() {
    if (this.DEBUG_MODE === true) {
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
const init = () => {
  const app = new AppKernel();
  app.init();
};
module.exports = {
  init
};
