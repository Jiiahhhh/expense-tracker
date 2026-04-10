import {
  expenses,
  addExpense,
  deleteExpense,
  getExpenses,
  getTotalByCategory,
  getTotal,
  importExpenses,
} from "./data.js";

import {
  renderSummary,
  renderExpenses,
  showError,
  hideError,
  resetForm,
} from "./ui.js";

import { validateExpense } from "./utils.js";

// STATE
let currentFilter = "";

// MAIN RENDER FUNCTION
function render() {
  renderSummary(getTotal(), getTotalByCategory());
  renderExpenses(getExpenses(currentFilter));
}

// EVENT: ADD EXPENSE
document.getElementById("btnAdd").addEventListener("click", () => {
  const name = document.getElementById("inputName").value;
  const amount = document.getElementById("inputAmount").value;
  const category = document.getElementById("inputCategory").value;
  const date = document.getElementById("inputDate").value;

  try {
    // Validation (Error Handling)
    validateExpense({ name, amount, category, date });

    // Success
    hideError();

    addExpense({
      name,
      amount,
      category,
      date,
    });

    resetForm();
    render();
  } catch (error) {
    showError(error.message);
  }
});

// EVENT: DELETE EXPENSE (Delegation)
document.getElementById("expenseList").addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-delete")) {
    const id = e.target.dataset.id;

    deleteExpense(Number(id));
    render();
  }
});

// EVENT: FILTER CATEGORY
document.getElementById("filterCategory").addEventListener("change", (e) => {
  currentFilter = e.target.value;
  render();
});

// EVENT: EXPORT JSON
document.getElementById("btnExport").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(expenses, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `expenses-${new Date().toISOString().split("T")[0]}.json`;

  a.click();
  URL.revokeObjectURL(url);
});

// EVENT IMPORT JSON
document.getElementById("importFile").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (event) => {
    try {
      const data = JSON.parse(event.target.result);

      if (!Array.isArray(data)) {
        throw new Error("Format tidak valid");
      }

      importExpenses(data);
      render();
    } catch (error) {
      showError("Gagal import: " + error.message);
    }
  };
  reader.readAsText(file);
});

// INITIAL LOAD
resetForm();
render();
