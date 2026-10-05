function onOpen() {
  SpreadsheetApp.getUi().alert(
    'PALUTO STATION SYSTEM is initialized. Run setupSystem() from the Apps Script editor to complete the database setup.'
  );
}

function setupSystem() {
  try {
    const spreadsheet = getSystemSpreadsheet();
    const spreadsheetId = spreadsheet.getId();
    const rootFolder = ensureDriveFolders();

    configureScriptProperties(spreadsheetId, rootFolder.getId());

    createRequiredSheets();
    ensureHeadersForAllSheets();
    ensureDefaultSettings();
    ensureDefaultCategories();
    validateDatabase();

    const summary = {
      appName: APP_NAME,
      spreadsheetId: spreadsheetId,
      rootFolderId: rootFolder.getId(),
      sheetCount: getAllSheetNames().length,
      status: 'READY'
    };

    return buildSuccessResponse('PALUTO STATION SYSTEM setup completed successfully.', summary);
  } catch (error) {
    console.error('setupSystem failed: ' + error.stack || error);
    return buildFailureResponse('SETUP_FAILED', 'Unable to complete PALUTO STATION SYSTEM setup.', error);
  }
}

function createRequiredSheets() {
  const spreadsheet = getSystemSpreadsheet();
  const sheetNames = Object.keys(SHEET_DEFINITIONS);

  sheetNames.forEach(function (sheetName) {
    let sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) {
      sheet = spreadsheet.insertSheet(sheetName);
    }
  });

  return true;
}

function ensureHeadersForAllSheets() {
  const spreadsheet = getSystemSpreadsheet();

  Object.keys(SHEET_DEFINITIONS).forEach(function (sheetName) {
    const definition = SHEET_DEFINITIONS[sheetName];
    const sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) {
      return;
    }

    const existingValues = sheet.getDataRange().getValues();
    const existingHeader = existingValues.length ? existingValues[0] : [];

    if (existingHeader.length === 0) {
      sheet.getRange(1, 1, 1, definition.length).setValues([definition]);
      return;
    }

    const normalizedExisting = existingHeader.map(function (value) {
      return String(value || '').trim();
    });

    const missingColumns = definition.filter(function (columnName) {
      return !normalizedExisting.includes(columnName);
    });

    if (missingColumns.length > 0) {
      const colIndex = existingHeader.length + 1;
      const range = sheet.getRange(1, colIndex, 1, missingColumns.length);
      range.setValues([missingColumns]);
    }
  });

  return true;
}

function ensureDefaultSettings() {
  const sheet = getSheetByName('Settings');
  const settings = Object.keys(DEFAULT_SETTINGS);

  const existingValues = sheet.getDataRange().getValues();
  const existingMap = {};

  for (let i = 1; i < existingValues.length; i += 1) {
    const key = String(existingValues[i][0] || '').trim();
    if (key) {
      existingMap[key] = true;
    }
  }

  const rowsToAdd = [];
  settings.forEach(function (key) {
    if (!existingMap[key]) {
      rowsToAdd.push([
        key,
        DEFAULT_SETTINGS[key].value,
        DEFAULT_SETTINGS[key].description,
        new Date().toISOString()
      ]);
    }
  });

  if (rowsToAdd.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, rowsToAdd.length, 4).setValues(rowsToAdd);
  }

  return true;
}

function ensureDefaultCategories() {
  const sheet = getSheetByName('Categories');
  const existingValues = sheet.getDataRange().getValues();
  const existingNames = {};

  for (let i = 1; i < existingValues.length; i += 1) {
    const categoryName = String(existingValues[i][1] || '').trim();
    if (categoryName) {
      existingNames[categoryName.toLowerCase()] = true;
    }
  }

  const rowsToAdd = [];
  DEFAULT_CATEGORIES.forEach(function (category) {
    const categoryName = category.categoryName;
    if (!existingNames[categoryName.toLowerCase()]) {
      rowsToAdd.push([
        createId('CAT'),
        category.categoryName,
        category.description,
        'ACTIVE',
        new Date().toISOString()
      ]);
    }
  });

  if (rowsToAdd.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, rowsToAdd.length, 5).setValues(rowsToAdd);
  }

  return true;
}

function validateDatabase() {
  const spreadsheet = getSystemSpreadsheet();
  const issues = [];

  Object.keys(SHEET_DEFINITIONS).forEach(function (sheetName) {
    const sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) {
      issues.push('Missing sheet: ' + sheetName);
      return;
    }

    const header = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0];
    const expectedColumns = SHEET_DEFINITIONS[sheetName];

    expectedColumns.forEach(function (columnName, index) {
      if (!header[index] || String(header[index]).trim() !== columnName) {
        issues.push('Sheet "' + sheetName + '" missing column: ' + columnName);
      }
    });
  });

  if (issues.length > 0) {
    throw new Error('Database validation failed: ' + issues.join('; '));
  }

  return buildSuccessResponse('Database structure validated successfully.', { validatedSheets: Object.keys(SHEET_DEFINITIONS).length });
}

function getAllSheetNames() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheets().map(function (sheet) {
    return sheet.getName();
  });
}

function getSystemSpreadsheet() {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (activeSpreadsheet) {
    return activeSpreadsheet;
  }

  return SpreadsheetApp.create(APP_NAME + ' Database');
}

function configureScriptProperties(spreadsheetId, driveRootId) {
  PropertiesService.getScriptProperties().setProperties({
    PALUTO_SPREADSHEET_ID: spreadsheetId,
    PALUTO_DRIVE_ROOT_ID: driveRootId,
    PALUTO_APP_NAME: APP_NAME,
    PALUTO_APP_SUBTITLE: APP_SUBTITLE,
    PALUTO_LAST_SETUP: new Date().toISOString()
  }, false);

  return true;
}

function buildSuccessResponse(message, data) {
  return {
    success: true,
    message: message,
    data: data || {}
  };
}

function buildFailureResponse(code, message, details) {
  const error = details && details.message ? details.message : String(details || 'Unknown error');
  return {
    success: false,
    message: message,
    errorCode: code,
    error: error
  };
}

function createId(prefix) {
  const now = new Date();
  const randomPart = Utilities.getUuid().replace(/-/g, '').slice(0, 8).toUpperCase();
  return prefix + '-' + now.getFullYear() + String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0') + '-' + randomPart;
}

function getSheetByName(sheetName) {
  const spreadsheet = getSystemSpreadsheet();
  let sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    throw new Error('Sheet not found: ' + sheetName);
  }
  return sheet;
}

function getSettingValue(key, defaultValue) {
  const sheet = getSheetByName('Settings');
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i += 1) {
    if (String(data[i][0]).trim() === key) {
      return data[i][1];
    }
  }

  return defaultValue;
}

function setSettingValue(key, value, description) {
  const sheet = getSheetByName('Settings');
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i += 1) {
    if (String(data[i][0]).trim() === key) {
      sheet.getRange(i + 1, 2).setValue(value);
      sheet.getRange(i + 1, 3).setValue(description || data[i][2] || '');
      sheet.getRange(i + 1, 4).setValue(new Date().toISOString());
      return true;
    }
  }

  sheet.getRange(sheet.getLastRow() + 1, 1, 1, 4).setValues([[key, value, description || '', new Date().toISOString()]]);
  return true;
}

function getSystemRootFolder() {
  const rootId = PropertiesService.getScriptProperties().getProperty('PALUTO_DRIVE_ROOT_ID');
  if (!rootId) {
    return ensureDriveFolders();
  }

  try {
    return DriveApp.getFolderById(rootId);
  } catch (error) {
    return ensureDriveFolders();
  }
}

function getAllSettings() {
  const sheet = getSheetByName('Settings');
  const values = sheet.getDataRange().getValues();
  const rows = [];

  for (let i = 1; i < values.length; i += 1) {
    if (String(values[i][0] || '').trim()) {
      rows.push({
        key: values[i][0],
        value: values[i][1],
        description: values[i][2],
        updatedAt: values[i][3]
      });
    }
  }

  return rows;
}

function ensureSystemReady() {
  const spreadsheet = getSystemSpreadsheet();
  const requiredSheets = Object.keys(SHEET_DEFINITIONS);

  requiredSheets.forEach(function (sheetName) {
    if (!spreadsheet.getSheetByName(sheetName)) {
      spreadsheet.insertSheet(sheetName);
    }
  });

  ensureHeadersForAllSheets();
  ensureDefaultSettings();
  ensureDefaultCategories();
  ensureDriveFolders();

  return buildSuccessResponse('System is ready.', { status: 'READY' });
}
