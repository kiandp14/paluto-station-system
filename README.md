# PALUTO STATION SYSTEM

Phase 1 — Architecture + Google Sheets + setupSystem()

This repository contains the initial Phase 1 implementation for the PALUTO STATION SYSTEM.

Files included:
- Code.gs
- Config.gs
- Utils.gs
- DriveService.gs
- appsscript.json

## Setup instructions

STEP 1
Create a Google Spreadsheet in your Google Drive.

STEP 2
Open the spreadsheet and select:
Extensions → Apps Script

STEP 3
Create project files in the Apps Script editor and paste the Phase 1 code provided in the repo files.

STEP 4
Save the project.

STEP 5
Run setupSystem() from the Apps Script editor.

STEP 6
Authorize the script when prompted by Google.

STEP 7
Verify the automatically created sheets:
Users
Employees
Products
Categories
Sales
SaleItems
Inventory
InventoryHistory
Customers
CustomerPayments
Attendance
Payroll
PayrollItems
Expenses
Settings
Notifications
Shifts
ActivityLogs

STEP 8
Verify the Google Drive folders created under:
PALUTO STATION SYSTEM/
- Store Logo
- Product Images
- Employee Photos
- Payment Proof
- Receipts
- Payslips
- Customer Statements
- Reports
- Backups

STEP 9
Confirm the Settings sheet includes default entries and Categories sheet includes default categories.

STEP 10
Deploy the project as a Google Apps Script Web App when ready for the next phase.

## Phase 1 testing checklist

- Spreadsheet is created and opened successfully.
- setupSystem() runs without JavaScript errors.
- All required sheets are created automatically.
- Sheets have matching required headers.
- Default settings are saved.
- Default categories are saved.
- Drive root and subfolders are created.
- Script properties are populated.
- Database validation passes successfully.

## Notes

This is strictly Phase 1 implementation only, as requested. The next phase will continue with authentication, roles, permissions, and the web application UI.
