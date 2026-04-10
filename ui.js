import { CATEGORIES, formatCurrency, formatDate } from "./utils.js";

// Escape HTML sederhana (defensive UI)
function escapeHTML(str = "") {
  return String(str).replace(
    /[&<>"']/g,
    (m) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[m],
  );
}

// Generate summary card
function createSummaryCard(label, amount, isTotal = false) {
  return `
    <div class="summary-card ${isTotal ? "total" : ""}">
      <div class="summary-label">${label}</div>
      <div class="summary-amount">${formatCurrency(amount)}</div>
    </div>
  `;
}

// Render Summary
export function renderSummary(total, totalByCategory) {
  const container = document.getElementById("summaryGrid");

  // Defensive fallback
  if (!container) return;

  // Total card
  const totalHTML = createSummaryCard("Total Pengeluaran", total, true);

  // Category cards (pakai destructuring + map)
  const categoryHTML = Object.entries(totalByCategory)
    .map(([category, amount]) => {
      const emoji = CATEGORIES[category] ?? "📦";
      return createSummaryCard(`${emoji} ${category}`, amount);
    })
    .join("");

  // Inject sekali (lebih performant)
  container.innerHTML = totalHTML + categoryHTML;
}

// Render Expense List
export function renderExpenses(expenses = []) {
  const listEl = document.getElementById("expenseList");
  const emptyMsgEl = document.getElementById("emptyMsg");

  if (!listEl || !emptyMsgEl) return;

  // Empty state
  if (expenses.length === 0) {
    emptyMsgEl.classList.remove("hidden");
    listEl.classList.add("hidden");
    listEl.innerHTML = "";
    return;
  }

  emptyMsgEl.classList.add("hidden");
  listEl.classList.remove("hidden");

  const listHTML = expenses
    .map(({ id, name, amount, category, date }) => {
      const emoji = CATEGORIES[category] ?? "📦";
      return `
        <div class="expense-item" data-id="${id}">
          <div class="expense-left">
            <span class="expense-emoji">${emoji}</span>
            <div>
              <div class="expense-name">${escapeHTML(name)}</div>
              <div class="expense-meta">
                ${category} · ${formatDate(date)}
              </div>
            </div>
          </div>
          <div class="expense-right">
            <span class="expense-amount">
              ${formatCurrency(amount)}
            </span>
            <button class="btn-delete" data-id="${id}">X</button>
          </div>
        </div>
      `;
    })
    .join("");
  listEl.innerHTML = listHTML;
}

// Error Handling UI
export function showError(message) {
  const errorEl = document.getElementById("errorMsg");
  if (!errorEl) return;

  errorEl.textContent = message;
  errorEl.classList.remove("hidden");
}

export function hideError() {
  const errorEl = document.getElementById("errorMsg");
  if (!errorEl) return;

  errorEl.textContent = "";
  errorEl.classList.add("hidden");
}

// Form Reset
export function resetForm() {
  const nameEl = document.getElementById("inputName");
  const amountEl = document.getElementById("inputAmount");
  const categoryEl = document.getElementById("inputCategory");
  const dateEl = document.getElementById("inputDate");

  if (!nameEl || !amountEl || !categoryEl || !dateEl) return;

  // Reset values
  nameEl.value = "";
  amountEl.value = "";
  categoryEl.value = "";

  // Set today date
  dateEl.value = new Date().toISOString().split("T")[0];
}
