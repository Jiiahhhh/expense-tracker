// Kategori dan emoji mapping
export const CATEGORIES = {
  Makanan: "🍔",
  Transport: "🚗",
  Rumah: "🏠",
  Hiburan: "🎮",
  Kesehatan: "💊",
  Pendidikan: "📚",
  Belanja: "👕",
  Lainnya: "📦",
};

// Format currency ke Rupiah
export function formatCurrency(amount) {
  return `Rp${Number(amount).toLocaleString("id-ID")}`;
}

// Format tanggal ke readable string
export function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function validateExpense({ name, amount, category, date }) {
  if (!name || name.trim().length < 2) {
    throw new Error("Nama pengeluaran minimal 2 karakter");
  }
  if (!amount || isNaN(amount) || Number(amount) <= 0) {
    throw new Error("Jumlah harus berupa angka dan lebih dari 0");
  }
  if (!category) {
    throw new Error("Kategori harus dipilih");
  }
  if (!date) {
    throw new Error("Tanggal harus diisi");
  }
}
