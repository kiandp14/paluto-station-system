function getSystemSpreadsheetId() {
  const props = PropertiesService.getScriptProperties();
  return props.getProperty(SCRIPT_PROPERTY_KEYS.SPREADSHEET_ID) || SpreadsheetApp.getActiveSpreadsheet().getId();
}

function getDriveRootFolderId() {
  const props = PropertiesService.getScriptProperties();
  return props.getProperty(SCRIPT_PROPERTY_KEYS.DRIVE_ROOT_ID);
}

function runWithLock(lockName, callback) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    return callback();
  } finally {
    lock.releaseLock();
  }
}

function createDataRow(sheetName, values) {
  const sheet = getSheetByName(sheetName);
  const row = values || [];
  sheet.appendRow(row);
  return sheet.getLastRow();
}

function readSheetRows(sheetName) {
  const sheet = getSheetByName(sheetName);
  const values = sheet.getDataRange().getValues();

  if (!values || values.length < 2) {
    return [];
  }

  const header = values[0];
  const records = [];

  for (let i = 1; i < values.length; i += 1) {
    const row = values[i];
    const isEmpty = row.every(function (cell) {
      return cell === '' || cell === null || typeof cell === 'undefined';
    });
    if (isEmpty) {
      continue;
    }

    const record = {};
    header.forEach(function (key, index) {
      record[key] = row[index];
    });
    records.push(record);
  }

  return records;
}

function findSheetRow(sheetName, columnName, value) {
  const rows = readSheetRows(sheetName);
  return rows.find(function (row) {
    return String(row[columnName] || '').trim() === String(value).trim();
  });
}

function getNextAvailableRow(sheetName) {
  const sheet = getSheetByName(sheetName);
  return sheet.getLastRow() + 1;
}

function normalizeNumber(value, fallback) {
  const numericValue = Number(value);
  if (isNaN(numericValue)) {
    return fallback !== undefined ? Number(fallback) : 0;
  }
  return numericValue;
}

function ensureNonEmptyString(value, fallback) {
  return value && String(value).trim() ? String(value).trim() : fallback || '';
}

function formatMoney(value) {
  const amount = Number(value || 0);
  return '₱' + amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function toDateString(dateValue) {
  if (!dateValue) {
    return '';
  }
  try {
    return new Date(dateValue).toISOString().split('T')[0];
  } catch (error) {
    return '';
  }
}

function toTimeString(dateValue) {
  if (!dateValue) {
    return '';
  }
  try {
    return new Date(dateValue).toLocaleTimeString('en-PH', { hour12: true });
  } catch (error) {
    return '';
  }
}
