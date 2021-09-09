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
  parseQueryResult(result, keys) {
    try {
      if (keys && result) {
        if (result.error !== null) {
          $console.error(result.error);
          return undefined;
        }
        const sqlResult = result.result,
          data = [];
        while (sqlResult.next()) {
          const dataItem = {};
          if (keys.length > 0) {
            keys.map(key => (dataItem[key] = sqlResult.get(key)));
            data.push(dataItem);
          }
        }
        sqlResult.close();
        return data;
      } else {
        return undefined;
      }
    } catch (_ERROR) {
      $console.error(`parseQueryResult:${_ERROR.message}`);
      return undefined;
    }
  }
  isItemExist() {}
  addNewItem(clipItem) {
    $console.error(clipItem);
    try {
      if (clipItem != undefined) {
        const db = this.open(),
          sql = `INSERT INTO ${this.tableId.items} (uuid, timestamp, group_id, data) VALUES (?, ?, ?, ?)`,
          args = [
            clipItem.uuid,
            clipItem.timestamp,
            clipItem.group,
            clipItem.data
          ],
          update_result = db.update(sql, args);
        $console.error(sql);
        if (update_result.result !== true) {
          $console.error(update_result.error);
        }
        return update_result.result;
      } else {
        return false;
      }
    } catch (_ERROR) {
      $console.error(`addNewItem:${_ERROR.message}`);
      return false;
    }
  }
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
    const timestamp = new Date().getTime(),
      uuid = this.generateUUID(),
      clipItem = new ClipboardItem(uuid, timestamp, group || "", data),
      result = this.SQLITE.addNewItem(clipItem);
    $console.info(result);
    return result;
  }
}
module.exports = {
  SystemClipboard,
  AppClipboard
};
