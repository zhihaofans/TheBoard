function ClipboardItem(uuid, timestamp, group, data) {
  this.uuid = uuid;
  this.timestamp = timestamp;
  this.group = group;
  this.data = data;
}

class SystemClipboard {
  constructor(name) {
    this.NAME = name;
  }
}

class AppClipboard {
  constructor(name) {
    this.SQL_FILE = "/assets/.files/sqlite/clipboard.db";
    this.initClipboard();
  }
  openSql() {
    const { File } = require("../../NeXT/storage"),
      file = new File(),
      dir = file.getDirByFile(this.SQL_FILE);
    file.mkdir(dir);
    return $sqlite.open(this.SQL_FILE);
  }
  initClipboard() {
    const sql = `
  CREATE TABLE items(
  uuid TEXT NOT NULL,
  timestamp INTEGER,
  group_id TEXT,
  data TEXT,
  PRIMARY KEY(uuid)
  );`,
      db = this.openSql(),
      result = db.update(sql);
    db.close();
    if (
      result ||
      result.error.localizedDescription == "table items already exists"
    ) {
      $console.info("CREATE TABLE items.");
    } else {
      $console.error(result.error);
    }
  }
  isDataExist(data) {
    const db = this.openSql(),
      itemList = [];
    db.query(
      {
        sql: `SELECT * FROM items WHERE data=?;`,
        args: [data]
      },
      (rs, err) => {
        while (rs.next()) {
          const uuid = rs.get("uuid"),
            groupId = rs.get("group_id"),
            timestamp = rs.get("timestamp"),
            data = rs.get("data"),
            clipItem = new ClipboardItem(uuid, timestamp, groupId, data);
          itemList.push(clipItem);
        }
        rs.close();
      }
    );
    return itemList.length > 0;
  }
  copyFromSystemClipboard() {}
  generateUUID() {
    return require("./uuid").generate();
  }
  add({ group, data }) {
    if (this.isDataExist(data)) {
      $ui.alert({
        title: "已存在",
        message: data,
        actions: [
          {
            title: "OK",
            disabled: false, // Optional
            handler: () => {}
          }
        ]
      });
      return false;
    }
    const timestamp = new Date().getTime(),
      uuid = this.generateUUID(),
      clipItem = new ClipboardItem(uuid, timestamp, group || "", data),
      db = this.openSql(),
      sql = `INSERT INTO items (uuid, timestamp, group_id, data) VALUES (?,?,?,?)`,
      args = [clipItem.uuid, clipItem.timestamp, clipItem.group, clipItem.data],
      update_result = db.update({ sql, args });
    db.close();
    if (update_result.result !== true) {
      $console.error(update_result.error);
    }
    return update_result.result;
  }
  getAll() {
    const db = this.openSql(),
      sql = `SELECT * FROM items;`,
      itemList = [];
    db.query(sql, (rs, err) => {
      while (rs.next()) {
        const uuid = rs.get("uuid"),
          groupId = rs.get("group_id"),
          timestamp = rs.get("timestamp"),
          data = rs.get("data"),
          clipItem = new ClipboardItem(uuid, timestamp, groupId, data);
        itemList.push(clipItem);
      }
      rs.close();
    });
    return itemList;
  }
}
module.exports = {
  SystemClipboard,
  AppClipboard
};
