const storage = require("./storage"),
  SQLite = require("./sqlite"),
  update = require("./update"),
  { UserException } = require("./object");
class ViewItem {
  constructor({ id, title, icon, fileName, func }) {
    this.id = id;
    this.title = icon;
    this.icon = icon;
    this.fileName = fileName;
    this.func = func;
  }
}

class ViewLoader {
  constructor({ appKernel }) {
    this.appKernel = appKernel;
    this.DEBUG_MODE = this.appKernel.DEBUG_MODE === true;
    this.viewList = {
      viewIdList: [],
      viewList: {}
    };
    this.launchViewId = "";
    this.keyboardViewId = "";
  }
  registerView({ id, title, icon, fileName, func }) {
    if (id && title && fileName && func) {
      this.viewList.viewList[id] = new ViewItem({
        id,
        title,
        icon,
        fileName,
        func
      });
      this.viewList.viewIdList.push(id);
    } else {
      if (this.DEBUG_MODE === true) {
        $console.info({ id, title, icon, fileName, func });
      }
      throw new UserException({
        name: "registerView",
        message: "register view failed",
        source: "code"
      });
    }
  }
  setLaunchViewId(id) {
    if (
      id &&
      this.viewList.viewIdList.indexOf(id) >= 0 &&
      this.viewList.viewList[id]
    ) {
      this.launchViewId = id;
    } else {
      if (this.DEBUG_MODE === true) {
        $console.error(id);
      }
      throw new UserException({
        name: "setLaunchViewId",
        message: "set launch view id failed, can not find this view id",
        source: "code"
      });
    }
  }
  setKeyboardViewId(id) {
    if (
      id &&
      this.viewList.viewIdList.indexOf(id) >= 0 &&
      this.viewList.viewList[id]
    ) {
      this.keyboardViewId = id;
    } else {
      if (this.DEBUG_MODE === true) {
        $console.error(id);
      }
      throw new UserException({
        name: "setKeyboardViewId",
        message: "set keyboard view id failed, can not find this view id",
        source: "code"
      });
    }
  }
  openView(viewId, AppKernel = undefined) {
    if (viewId && this.viewList.viewList[viewId]) {
      const launchViewItem = this.viewList.viewList[viewId];
      if (launchViewItem) {
        if (AppKernel) {
          require(`/scripts/view/${launchViewItem.fileName}`)[
            launchViewItem.func
          ](AppKernel);
        } else {
          require(`/scripts/view/${launchViewItem.fileName}`)[
            launchViewItem.func
          ]();
        }
      } else {
        throw new UserException({
          name: "openView",
          message: "need viewId",
          source: "code"
        });
      }
    } else {
      throw new UserException({
        name: "openView",
        message: "open view failed, can not find this view id",
        source: "code"
      });
    }
  }
  openLaunchView() {
    this.openView(this.launchViewId, this.appKernel);
  }
  openKeyboardView() {
    this.openView(this.keyboardViewId, this.appKernel);
  }
}

class Config {
  constructor(configDataDir) {
    this.cache = storage.Cache;
    this.prefs = storage.Prefs;
    this.sqlite = SQLite;
    this.configDataDir = configDataDir || "/assets/.files/.config/";
  }
  setConfigDataDir(newDir) {
    this.configDataDir = newDir;
  }
}

class Kernel {
  constructor({ debugMode, keyboardMode }) {
    this.appInfo = $addin.current;
    this.DEBUG_MODE = debugMode === true;
    this.KEYBOARD_MODE = keyboardMode;
    this.config = new Config();
    this.update = new update({
      appVersion: this.appInfo.version,
      updateConfigUrl: undefined
    });
    this.viewLoader = new ViewLoader({
      appKernel: this
    });
  }
}
module.exports = Kernel;
