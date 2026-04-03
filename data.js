const STORAGE_KEY = "expense-tracker-data";

export let expenses = loadExpenses();

function loadExpenses() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.log("Gagal load data:", error.message);
    return [];
  }
}

function saveExpenses() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  } catch (error) {
    if (error.name === "QuotaExceededError") {
      console.log("Penyimpanan penuh!");
    } else {
      console.log("Gagal simpan data:", error.message);
    }
  }
}

export function addExpense(expense) {
  expenses.push({
    id: Date.now(),
    ...expense,
    amount: Number(expense.amount),
  });
  saveExpenses();
}

export function deleteExpense(id) {
  expenses = expenses.filter((e) => e.id !== id);
  saveExpenses();
}

export function getExpenses(filterCategory = "") {
  if (!filterCategory) return expenses;
  return expenses.filter((e) => e.category === filterCategory);
}

export function getTotalByCategory() {
  return expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});
}

export function getTotal() {
  return expenses.reduce((total, e) => total + e.amount, 0);
}

export function importExpenses(data) {
  expenses = data;
  saveExpenses();
}
