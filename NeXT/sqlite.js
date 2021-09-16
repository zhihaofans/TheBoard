const storage = require("./storage");
class SQLite {
  constructor({ dataBaseFile, tableId }) {
    this.dataBaseFile = dataBaseFile;
    this.tableId = tableId;
  }
  open() {
    const file = new storage.File(),
      dir = file.getDirByFile(this.dataBaseFile);
    file.mkdir(dir);
    return $sqlite.open(this.dataBaseFile);
  }
  createTable(tableData) {
    const sql = `CREATE TABLE ${this.tableId}(${tableData});`,
      db = this.open(),
      result = db.update(sql);
    db.close();
    return result;
  }
  insert(data) {
    const dataKeys = data.keys(),
      dataValues = [],
      db = this.open();
    if (dataKeys && dataKeys.length > 0) {
      dataKeys.map(key => dataValues.push(data[key]));
      const sql = `INSERT INTO items (${dataKeys.toString()}) VALUES (?,?,?,?)`,
        updateResult = db.update({ sql, args: dataValues });
      db.close();
      if (updateResult.result !== true) {
        $console.error(updateResult.error);
      }
      return updateResult;
    } else {
      return undefined;
    }
  }
  query(where) {
    let db = this.open(),
      sql = `SELECT * FROM ${this.tableId}`,
      resultList = [];
    if (where && where.length > 0) {
      sql += `WHERE ${where}`;
    }
    db.query(sql, (rs, err) => {
      if (err) {
        $console.error(err);
      }
      while (rs.next()) {
        resultList.push(rs.values);
      }
      rs.close();
    });
    return resultList;
  }
  update(whereStr, dataList) {
    const dataKeys = dataList.keys(),
      dataValues = [],
      db = this.open();
    let keyStr = "";
    if (dataKeys && dataKeys.length > 0) {
      dataKeys.map(key => {
        dataValues.push(dataList[key]);
        if (keyStr.length == 0) {
          keyStr = `${key}=?`;
        } else {
          keyStr += `,${key}=?`;
        }
      });
      const sql = `UPDATE ${this.tableId} SET ${keyStr} WHERE ${whereStr}`,
        updateResult = db.update({ sql, args: dataValues });
      db.close();

      return updateResult;
    } else {
      return undefined;
    }
  }
  updateByStr(whereStr, dataStr, dataValueList) {
    if (whereStr.length > 0 && dataStr.length > 0 && dataValueList.length > 0) {
      const sql = `UPDATE ${this.tableId} SET ${dataStr} WHERE ${whereStr}`,
        db = this.open(),
        updateResult = db.update({ sql, args: dataValueList });
      db.close();
      return updateResult;
    } else {
      return undefined;
    }
  }
  remove(whereStr, args) {
    const db = this.open(),
      sql = `DELETE FROM ${this.tableId} WHERE ${whereStr};`,
      update_result = db.update({ sql, args });
    db.close();
    if (update_result.result !== true) {
      $console.error(update_result.error);
    }
    return update_result;
  }
}

module.exports = SQLite;
