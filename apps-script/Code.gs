// SYBORG Club Merch Booth — Apps Script backend
// Deploy: Extensions > Apps Script (bound to the club's Google Sheet) > Deploy > Web app
//   Execute as: Me | Who has access: Anyone
//
// Expected sheets:
//   "Catalog"      columns: id | name | category | price | stock | imageUrl | series
//   "Reservations" columns: timestamp | itemId | name | contact | qty

function doGet(e) {
  var action = e.parameter.action;
  if (action === "catalog") {
    return json_(getCatalog_());
  }
  return json_({ error: "unknown action" });
}

function doPost(e) {
  var body = JSON.parse(e.postData.contents);
  if (body.action === "decrement") {
    return json_(decrementStock_(body.itemId, body.qty || 1));
  }
  if (body.action === "reserve") {
    return json_(addReservation_(body));
  }
  return json_({ error: "unknown action" });
}

function getCatalog_() {
  var sheet = SpreadsheetApp.getActive().getSheetByName("Catalog");
  var rows = sheet.getDataRange().getValues();
  var headers = rows.shift();
  var idCol = headers.indexOf("id");
  return rows
    .filter(function (row) { return row[idCol] !== "" && row[idCol] !== null; })
    .map(function (row) {
      var item = {};
      headers.forEach(function (h, i) { item[h] = row[i]; });
      return item;
    });
}

function decrementStock_(itemId, qty) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sheet = SpreadsheetApp.getActive().getSheetByName("Catalog");
    var rows = sheet.getDataRange().getValues();
    var headers = rows[0];
    var idCol = headers.indexOf("id");
    var stockCol = headers.indexOf("stock");
    for (var i = 1; i < rows.length; i++) {
      if (String(rows[i][idCol]) === String(itemId)) {
        var newStock = Math.max(0, rows[i][stockCol] - qty);
        sheet.getRange(i + 1, stockCol + 1).setValue(newStock);
        return { itemId: itemId, stock: newStock };
      }
    }
    return { error: "item not found" };
  } finally {
    lock.releaseLock();
  }
}

function addReservation_(body) {
  var sheet = SpreadsheetApp.getActive().getSheetByName("Reservations");
  sheet.appendRow([new Date(), body.itemId, body.name, body.contact, body.qty || 1]);
  return { ok: true };
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function myFunction() {
  
}