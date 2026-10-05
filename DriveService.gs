function ensureDriveFolders() {
  const rootFolderName = 'PALUTO STATION SYSTEM';
  let rootFolder;

  const rootFolders = DriveApp.getFoldersByName(rootFolderName);
  if (rootFolders.hasNext()) {
    rootFolder = rootFolders.next();
  } else {
    rootFolder = DriveApp.createFolder(rootFolderName);
  }

  const folderPaths = [
    'Store Logo',
    'Product Images',
    'Employee Photos',
    'Payment Proof',
    'Receipts',
    'Payslips',
    'Customer Statements',
    'Reports',
    'Backups'
  ];

  folderPaths.forEach(function (folderName) {
    const folderPath = rootFolder.getName() + '/' + folderName;
    const existingFolders = DriveApp.getFoldersByName(folderName);
    let folderExists = false;

    while (existingFolders.hasNext()) {
      const existingFolder = existingFolders.next();
      if (existingFolder.getParents().next().getId() === rootFolder.getId()) {
        folderExists = true;
        break;
      }
    }

    if (!folderExists) {
      rootFolder.createFolder(folderName);
    }
  });

  PropertiesService.getScriptProperties().setProperty('PALUTO_DRIVE_ROOT_ID', rootFolder.getId());
  return rootFolder;
}

function getFolderByRelativePath(relativePath) {
  const rootFolder = getSystemRootFolder();
  const segments = relativePath.split('/').filter(Boolean);
  let currentFolder = rootFolder;

  segments.forEach(function (segment) {
    let found = false;
    const folders = currentFolder.getFoldersByName(segment);
    while (folders.hasNext()) {
      const folder = folders.next();
      if (folder.getParents().next() && folder.getParents().next().getId() === currentFolder.getId()) {
        currentFolder = folder;
        found = true;
        break;
      }
    }

    if (!found) {
      currentFolder = currentFolder.createFolder(segment);
    }
  });

  return currentFolder;
}

function uploadFileToDrive(base64Data, fileName, folderPath) {
  const folder = getFolderByRelativePath(folderPath || 'PALUTO STATION SYSTEM');
  const blob = Utilities.newBlob(base64Data, 'application/octet-stream', fileName);
  const file = folder.createFile(blob);
  return file.getId();
}

function uploadImageToDrive(imageBlob, fileName, folderPath) {
  const folder = getFolderByRelativePath(folderPath || 'PALUTO STATION SYSTEM/Product Images');
  const file = folder.createFile(imageBlob.setName(fileName));
  return file.getId();
}

function ensureSpreadsheetConfigured() {
  const props = PropertiesService.getScriptProperties();
  const spreadsheetId = props.getProperty(SCRIPT_PROPERTY_KEYS.SPREADSHEET_ID);
  if (!spreadsheetId) {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    if (!spreadsheet) {
      throw new Error('No active spreadsheet found. Create a Google Spreadsheet and open it before running setupSystem().');
    }
    props.setProperty(SCRIPT_PROPERTY_KEYS.SPREADSHEET_ID, spreadsheet.getId());
  }

  return true;
}
