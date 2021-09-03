function ClipboardItem(uuid, timestamp, group, data) {
  this.uuid = uuid;
  this.timestamp = timestamp;
  this.group = group;
  this.data = data;
}

class SQLite {
  constructor(sqlFile) {
    this.sqlFile = sqlFile;
    this.tableId = {
      items: "items"
    };
  }
  mkdir(sqlFilePath) {
    const { File } = require("../../NeXT/storage"),
      file = new File(),
      dir = file.getDirByFile(sqlFilePath);
    file.mkdir(dir);
  }
  open() {
    this.mkdir(this.sqlFile);
    return $sqlite.open(this.sqlFile);
  }
  createItemTable() {
    const db = this.open(),
      result = db.update(
        `CREATE TABLE ${this.tableId.items}(uuid VARCHAR(100) PRIMARY KEY, timestamp BIGINT NOT NULL, group_id VARCHAR(100), data VARCHAR(100) NOT NULL)`
      );
    db.close();
    return result.result ? result : result.error;
  }
  addNewItem(clipItem) {}
  editOldItem(uuid) {}
}

class SystemClipboard {
  constructor(name) {
    this.NAME = name;
  }
}

class AppClipboard {
  constructor(name) {
    this.NAME = name;
    this.SQLITE = new SQLite("/assets/.files/sqlite/clipboard.db");
    this.CREATE_ITEM_TABLE_RESULT = this.SQLITE.createItemTable();
    $console.info(`CREATE_ITEM_TABLE_RESULT`);
    $console.info(this.CREATE_ITEM_TABLE_RESULT);
  }
  copyFromSystemClipboard() {}
  generateUUID() {
    return require("./uuid").generate();
  }
  add({ group, data }) {
    const timestamp = 0,
      uuid = this.generateUUID(),
      clipItem = new ClipboardItem(timestamp, uuid, group, data);
  }
}
module.exports = {
  SystemClipboard,
  AppClipboard
};
