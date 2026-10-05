const APP_NAME = 'PALUTO STATION SYSTEM';
const APP_SUBTITLE = 'Sari-Sari Store';

const SHEET_DEFINITIONS = Object.freeze({
  Users: [
    'UserID', 'GoogleAccountEmail', 'EmployeeID', 'FullName', 'Role', 'Status', 'ProfilePhoto',
    'CreatedAt', 'UpdatedAt', 'LastLogin'
  ],
  Employees: [
    'EmployeeID', 'EmployeeCode', 'FullName', 'FirstName', 'LastName', 'Contact', 'Address', 'Email',
    'Position', 'Role', 'SalaryType', 'SalaryRate', 'HireDate', 'WorkSchedule', 'Photo', 'Status',
    'CreatedAt', 'UpdatedAt'
  ],
  Products: [
    'ProductID', 'SKU', 'ProductName', 'Category', 'Description', 'CostPrice', 'SellingPrice', 'PalutoFee',
    'MinimumStock', 'CurrentStock', 'Unit', 'ProductPhoto', 'Status', 'CreatedAt', 'UpdatedAt'
  ],
  Categories: [
    'CategoryID', 'CategoryName', 'Description', 'Status', 'CreatedAt'
  ],
  Sales: [
    'SaleID', 'ReceiptNumber', 'Date', 'Time', 'CashierID', 'CustomerID', 'Subtotal', 'PalutoFee',
    'Discount', 'TotalAmount', 'AmountPaid', 'Change', 'PaymentMethod', 'ReferenceNumber', 'Status',
    'Notes', 'CreatedAt'
  ],
  SaleItems: [
    'SaleItemID', 'SaleID', 'ProductID', 'ProductName', 'Quantity', 'UnitPrice', 'PalutoFee', 'Discount', 'Subtotal', 'Total'
  ],
  Inventory: [
    'InventoryID', 'ProductID', 'CurrentStock', 'MinimumStock', 'InventoryValue', 'Status', 'UpdatedAt'
  ],
  InventoryHistory: [
    'InventoryHistoryID', 'ProductID', 'TransactionType', 'Quantity', 'PreviousStock', 'NewStock', 'Reason',
    'ReferenceNumber', 'EmployeeID', 'Date', 'Time'
  ],
  Customers: [
    'CustomerID', 'CustomerCode', 'FullName', 'ContactNumber', 'Address', 'Email', 'TotalPurchases',
    'OutstandingBalance', 'Status', 'CreatedAt', 'UpdatedAt'
  ],
  CustomerPayments: [
    'PaymentID', 'CustomerID', 'SaleID', 'PaymentDate', 'Amount', 'PaymentMethod', 'ReferenceNumber',
    'ReceivedBy', 'Notes', 'CreatedAt'
  ],
  Attendance: [
    'AttendanceID', 'EmployeeID', 'Date', 'TimeIn', 'TimeOut', 'WorkingHours', 'LateMinutes', 'OvertimeHours',
    'Status', 'Notes', 'EditedBy', 'CreatedAt'
  ],
  Payroll: [
    'PayrollID', 'EmployeeID', 'PayrollPeriod', 'BasicSalary', 'RegularHours', 'OvertimeHours', 'OvertimePay',
    'LateDeduction', 'AbsenceDeduction', 'Allowances', 'OtherDeductions', 'NetSalary', 'Status', 'PaymentDate', 'GeneratedBy', 'CreatedAt'
  ],
  PayrollItems: [
    'PayrollItemID', 'PayrollID', 'Description', 'Type', 'Amount', 'CreatedAt'
  ],
  Expenses: [
    'ExpenseID', 'ExpenseDate', 'Category', 'Description', 'Amount', 'PaymentMethod', 'ReceiptFile', 'RecordedBy', 'Notes', 'CreatedAt'
  ],
  Settings: [
    'SettingKey', 'SettingValue', 'Description', 'UpdatedAt'
  ],
  Notifications: [
    'NotificationID', 'UserID', 'Title', 'Message', 'Type', 'Status', 'CreatedAt', 'ReadAt'
  ],
  Shifts: [
    'ShiftID', 'EmployeeID', 'Date', 'TimeIn', 'TimeOut', 'StartingCash', 'ExpectedCash', 'ActualCash', 'Difference', 'TotalSales', 'Status'
  ],
  ActivityLogs: [
    'LogID', 'UserID', 'UserName', 'Action', 'Module', 'ReferenceID', 'Description', 'Date', 'Time'
  ]
});

const DEFAULT_SETTINGS = Object.freeze({
  storeName: { value: APP_NAME, description: 'Store or business name.' },
  storeSubtitle: { value: APP_SUBTITLE, description: 'Subtitle displayed in branding.' },
  storeAddress: { value: 'Paluto Station, City', description: 'Store business address.' },
  storeContact: { value: '+63 000 000 0000', description: 'Main contact number.' },
  storeEmail: { value: 'store@palutostation.com', description: 'Store email address.' },
  currency: { value: 'PHP', description: 'Default currency.' },
  receiptHeader: { value: 'PALUTO STATION', description: 'Header text printed on receipts.' },
  receiptFooter: { value: 'Thank you for shopping with us!', description: 'Footer text printed on receipts.' },
  lowStockThreshold: { value: '10', description: 'Minimum stock threshold before low stock alert.' },
  preventNegativeInventory: { value: 'TRUE', description: 'Restrict stock below zero.' },
  allowCashierDiscounts: { value: 'FALSE', description: 'Whether cashiers can apply discounts.' },
  paymentMethods: { value: 'CASH,GCASH,INSTAPAY', description: 'Enabled payment methods.' },
  defaultPalutoFee: { value: '0', description: 'Default paluto fee amount.' },
  timezone: { value: 'Asia/Manila', description: 'Default timezone for reports and attendance.' },
  appVersion: { value: '1.0.0', description: 'System version.' }
});

const DEFAULT_CATEGORIES = [
  { categoryName: 'All', description: 'Default all items category', status: 'ACTIVE' },
  { categoryName: 'Drinks', description: 'Beverages and drinks', status: 'ACTIVE' },
  { categoryName: 'Snacks', description: 'Snacks and light bites', status: 'ACTIVE' },
  { categoryName: 'Noodles', description: 'Noodles and cooked meals', status: 'ACTIVE' },
  { categoryName: 'Household', description: 'Home and household products', status: 'ACTIVE' },
  { categoryName: 'Personal Care', description: 'Personal care items', status: 'ACTIVE' },
  { categoryName: 'Others', description: 'Miscellaneous items', status: 'ACTIVE' }
];

const DRIVE_FOLDER_STRUCTURE = [
  'PALUTO STATION SYSTEM',
  'PALUTO STATION SYSTEM/Store Logo',
  'PALUTO STATION SYSTEM/Product Images',
  'PALUTO STATION SYSTEM/Employee Photos',
  'PALUTO STATION SYSTEM/Payment Proof',
  'PALUTO STATION SYSTEM/Receipts',
  'PALUTO STATION SYSTEM/Payslips',
  'PALUTO STATION SYSTEM/Customer Statements',
  'PALUTO STATION SYSTEM/Reports',
  'PALUTO STATION SYSTEM/Backups'
];

const SCRIPT_PROPERTY_KEYS = Object.freeze({
  SPREADSHEET_ID: 'PALUTO_SPREADSHEET_ID',
  DRIVE_ROOT_ID: 'PALUTO_DRIVE_ROOT_ID',
  APP_NAME: 'PALUTO_APP_NAME',
  APP_SUBTITLE: 'PALUTO_APP_SUBTITLE',
  LAST_SETUP: 'PALUTO_LAST_SETUP'
});
