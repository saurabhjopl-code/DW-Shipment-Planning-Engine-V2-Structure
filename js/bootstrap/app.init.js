const SHEETS = {
  sale: {
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR_Ko_tmhbtxctjkYQ7zu25YB5C0zQPwcaUrqAUbcPw4daPmROC3gLff-gz-jkehXJdJ78Kh3eSpwvx/pub?gid=2115981230&single=true&output=csv",
    requiredHeaders: [
      "MP",
      "Date",
      "MPSKU",
      "Channel ID",
      "Quantity",
      "Warehouse Id",
      "Fulfillment Type",
      "Uniware SKU",
      "Style ID",
      "Size"
    ]
  },
  fc: {
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR_Ko_tmhbtxctjkYQ7zu25YB5C0zQPwcaUrqAUbcPw4daPmROC3gLff-gz-jkehXJdJ78Kh3eSpwvx/pub?gid=1945669210&single=true&output=csv",
    requiredHeaders: [
      "MP",
      "Warehouse Id",
      "MPSKU",
      "Channel ID",
      "Quantity"
    ]
  },
  uniware: {
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR_Ko_tmhbtxctjkYQ7zu25YB5C0zQPwcaUrqAUbcPw4daPmROC3gLff-gz-jkehXJdJ78Kh3eSpwvx/pub?gid=1998228798&single=true&output=csv",
    requiredHeaders: [
      "Uniware SKU",
      "Quantity",
      "Allocate Quantity"
    ]
  },
  remarks: {
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR_Ko_tmhbtxctjkYQ7zu25YB5C0zQPwcaUrqAUbcPw4daPmROC3gLff-gz-jkehXJdJ78Kh3eSpwvx/pub?gid=218928762&single=true&output=csv",
    requiredHeaders: [
      "Style ID",
      "Category",
      "Company Remark"
    ]
  }
};

const progressFill = document.getElementById("progressFill");
const loadingText = document.getElementById("loadingText");

const saleCountEl = document.getElementById("saleCount");
const fcCountEl = document.getElementById("fcCount");
const uniwareCountEl = document.getElementById("uniwareCount");
const remarksCountEl = document.getElementById("remarksCount");

const refreshBtn = document.getElementById("refreshBtn");

function updateProgress(percent, text, color = "#2563eb") {
  progressFill.style.width = percent + "%";
  progressFill.style.background = color;
  loadingText.textContent = text;
  loadingText.style.color = color;
}

async function fetchAndValidate(sheetConfig) {
  const response = await fetch(sheetConfig.url);
  if (!response.ok) throw new Error("Failed to fetch");

  const text = await response.text();
  const rows = text.trim().split("\n");

  if (rows.length === 0) {
    throw new Error("Sheet is empty");
  }

  const headers = rows[0].split(",").map(h => h.trim());

  const missing = sheetConfig.requiredHeaders.filter(
    required => !headers.includes(required)
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing Headers: ${missing.join(", ")}`
    );
  }

  return rows.length - 1; // row count excluding header
}

async function loadAllSheets() {
  try {
    updateProgress(10, "Validating Sale 30D...");
    const saleRows = await fetchAndValidate(SHEETS.sale);
    saleCountEl.textContent = saleRows.toLocaleString();

    updateProgress(30, "Validating FC Stock...");
    const fcRows = await fetchAndValidate(SHEETS.fc);
    fcCountEl.textContent = fcRows.toLocaleString();

    updateProgress(55, "Validating Uniware Stock...");
    const uniwareRows = await fetchAndValidate(SHEETS.uniware);
    uniwareCountEl.textContent = uniwareRows.toLocaleString();

    updateProgress(80, "Validating Company Remarks...");
    const remarksRows = await fetchAndValidate(SHEETS.remarks);
    remarksCountEl.textContent = remarksRows.toLocaleString();

    updateProgress(
      100,
      "All Data Loaded Successfully ✔",
      "#16a34a"
    );

  } catch (error) {
    updateProgress(
      100,
      "Header Validation Failed ❌",
      "#dc2626"
    );

    console.error("Validation Error:", error.message);
  }
}

refreshBtn.addEventListener("click", () => {
  updateProgress(0, "Refreshing...");
  loadAllSheets();
});

loadAllSheets();

