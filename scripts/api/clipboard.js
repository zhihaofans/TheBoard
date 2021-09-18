function ClipboardItem(uuid, timestamp, group, data) {
  this.uuid = uuid;
  this.timestamp = timestamp;
  this.group = group;
  this.data = data;
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
    const db = this.openSql(),
      itemsResult = db.update(`
  CREATE TABLE items(
  uuid TEXT NOT NULL,
  timestamp INTEGER,
  group_id TEXT,
  data TEXT,
  PRIMARY KEY(uuid)
  );`),
      appClipResult = db.update(`
  CREATE TABLE appclipboard(
  id TEXT NOT NULL,
  data TEXT,
  PRIMARY KEY(id)
  );`);
    db.close();
    $console.info("itemsResult");
    $console.warn(itemsResult.result ? itemsResult : itemsResult.error);
    $console.info("appClipResult");
    $console.warn(appClipResult.result ? appClipResult : appClipResult.error);
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
  removeItem(uuid) {
    const db = this.openSql(),
      sql = `DELETE FROM items WHERE uuid=?;`,
      args = [uuid],
      update_result = db.update({ sql, args });
    db.close();
    if (update_result.result !== true) {
      $console.error(update_result.error);
    }
    return update_result.result;
  }
  editItem(uuid, newData) {
    const db = this.openSql(),
      sql = `UPDATE items SET data=? WHERE uuid=?`,
      args = [newData, uuid],
      update_result = db.update({ sql, args });
    db.close();
    if (update_result.result !== true) {
      $console.error(update_result.error);
    }
    return update_result.result;
  }
  getLastClipboardData() {
    const db = this.openSql(),
      sql = `SELECT * FROM appclipboard WHERE id=?;`,
      args = ["last_clipboard_data"],
      itemList = [];
    db.query(
      {
        sql,
        args
      },
      (rs, err) => {
        $console.error(err);
        while (rs.next()) {
          itemList.push(rs.values);
        }
        rs.close();
      }
    );
    $console.warn(itemList);
    if (itemList.length > 0) {
      return itemList[0].data;
    }
    return undefined;
  }
  setLastClipboardData(data) {
    let hasData = false;
    this.openSql().query(
      {
        sql: `SELECT * FROM appclipboard WHERE id=?;`,
        args: ["last_clipboard_data"]
      },
      (rs, err) => {
        while (rs.next()) {
          $console.warn(rs);
          if (rs.get("id") == "last_clipboard_data") {
            hasData = true;
          }
        }
        rs.close();
      }
    );
    const db = this.openSql(),
      sql = hasData
        ? `UPDATE appclipboard SET data=? WHERE id=?`
        : `INSERT INTO appclipboard (data,id) VALUES (?,?)`,
      args = [data, "last_clipboard_data"],
      updateResult = db.update({ sql, args });
    return updateResult.result ? updateResult : updateResult.error;
  }
}
module.exports = {
  AppClipboard
};
