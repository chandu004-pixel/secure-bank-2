export type Transaction = {
  id: string;
  date: string;
  description: string;
  type: "credit" | "debit";
  amount: number;
  balance: number;
  status: "completed" | "pending" | "failed";
};

export const user = {
  name: "Jane Doe",
  email: "jane.doe@example.com",
  username: "janedoe",
  accountNumber: "1234567890",
  balance: 15350.75,
};

export const kycStatus = {
  status: "approved" as "approved" | "pending" | "rejected" | "none",
  submittedAt: "2023-10-15T10:00:00Z",
  details: {
    fullName: "Jane Doe",
    dob: "1990-05-20",
    address: "123 Banking St, Capital City, 12345",
    idType: "Passport",
    idNumber: "A1B2C3D4E5",
  },
};

export const transactions: Transaction[] = [
  {
    id: "txn_1",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Online Shopping",
    type: "debit",
    amount: 150.0,
    balance: 15350.75,
    status: "completed",
  },
  {
    id: "txn_2",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Salary Deposit",
    type: "credit",
    amount: 5000.0,
    balance: 15500.75,
    status: "completed",
  },
  {
    id: "txn_3",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Utility Bill Payment",
    type: "debit",
    amount: 75.5,
    balance: 10500.75,
    status: "completed",
  },
  {
    id: "txn_4",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Transfer to John Smith",
    type: "debit",
    amount: 300.0,
    balance: 10576.25,
    status: "completed",
  },
  {
    id: "txn_5",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Restaurant",
    type: "debit",
    amount: 45.25,
    balance: 10876.25,
    status: "completed",
  },
  {
    id: "txn_6",
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Cash Withdrawal",
    type: "debit",
    amount: 200.0,
    balance: 10921.5,
    status: "completed",
  },
  {
    id: "txn_7",
    date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    description: "Refund from Amazon",
    type: "credit",
    amount: 55.0,
    balance: 11121.5,
    status: "completed",
  },
];
