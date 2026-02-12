// ===============================
// SHEET CONFIG
// ===============================

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
    ],
    numericFields: ["Quantity"]
  },
  fc: {
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR_Ko_tmhbtxctjkYQ7zu25YB5C0zQPwcaUrqAUbcPw4daPmROC3gLff-gz-jkehXJdJ78Kh3eSpwvx/pub?gid=1945669210&single=true&output=csv",
    requiredHeaders: [
      "MP",
      "Warehouse Id",
      "MPSKU",
      "Channel ID",
      "Quantity"
    ],
    numericFields: ["Quantity"]
  },
  uniware: {
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR_Ko_tmhbtxctjkYQ7zu25YB5C0zQPwcaUrqAUbcPw4daPmROC3gLff-gz-jkehXJdJ78Kh3eSpwvx/pub?gid=1998228798&single=true&output=csv",
    requiredHeaders: [
      "Uniware SKU",
      "Quantity",
      "Allocate Quantity"
    ],
    numericFields: ["Quantity", "Allocate Quantity"]
  },
  remarks: {
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR_Ko_tmhbtxctjkYQ7zu25YB5C0zQPwcaUrqAUbcPw4daPmROC3gLff-gz-jkehXJdJ78Kh3eSpwvx/pub?gid=218928762&single=true&output=csv",
    requiredHeaders: [
      "Style ID",
      "Category",
      "Company Remark"
    ],
    numericFields: []
  }
};

// ===============================
// DOM
// ===============================

const progressFill = document.getElementById("progressFill");
const loadingText = document.getElementById("loadingText");

const saleCountEl = document.getElementById("saleCount");
const fcCountEl = document.getElementById("fcCount");
const uniwareCountEl = document.getElementById("uniwareCount");
const remarksCountEl = document.getElementById("remarksCount");

const refreshBtn = document.getElementById("refreshBtn");

// ===============================
// STATE
// ===============================

export const appState = {
  sale: [],
  fc: [],
  uniware: [],
  remarks: []
};

// ===============================
// HELPERS
// ===============================

function updateProgress(percent, text, color = "#2563eb") {
  progressFill.style.width = percent + "%";
  progressFill.style.background = color;
  loadingText.textContent = text;
  loadingText.style.color = color;
}

function parseCSV(text) {
  const rows = text.trim().split("\n");
  const headers = rows[0].split(",").map(h => h.trim());

  const data = rows.slice(1).map((row, rowIndex) => {
    const values = row.split(",");
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = values[index] ? values[index].trim() : "";
    });
    obj.__rowNumber = rowIndex + 2; // actual row in sheet
    return obj;
  });

  return { headers, data };
}

function validateNumeric(data, fields, sheetName) {
  for (let row of data) {
    for (let field of fields) {
      if (row[field] === "") continue;

      const value = Number(row[field]);

      if (isNaN(value)) {
        throw new Error(
          `${sheetName}: Non-numeric value in "${field}" at row ${row.__rowNumber}`
        );
      }

      if (value < 0) {
        throw new Error(
          `${sheetName}: Negative value in "${field}" at row ${row.__rowNumber}`
        );
      }

      row[field] = value; // convert to number
    }
  }
}

async function fetchAndValidate(sheetKey, sheetConfig) {
  const response = await fetch(sheetConfig.url);
  if (!response.ok) throw new Error("Failed to fetch");

  const text = await response.text();
  const { headers, data } = parseCSV(text);

  // Header validation
  const missing = sheetConfig.requiredHeaders.filter(
    required => !headers.includes(required)
  );

  if (missing.length > 0) {
    throw new Error(`${sheetKey}: Missing Headers: ${missing.join(", ")}`);
  }

  // Numeric validation
  validateNumeric(data, sheetConfig.numericFields, sheetKey);

  return data;
}

// ===============================
// LOAD FLOW
// ===============================

async function loadAllSheets() {
  try {
    updateProgress(10, "Validating Sale 30D...");
    const saleData = await fetchAndValidate("Sale 30D", SHEETS.sale);
    appState.sale = saleData;
    saleCountEl.textContent = saleData.length.toLocaleString();

    updateProgress(30, "Validating FC Stock...");
    const fcData = await fetchAndValidate("FC Stock", SHEETS.fc);
    appState.fc = fcData;
    fcCountEl.textContent = fcData.length.toLocaleString();

    updateProgress(55, "Validating Uniware Stock...");
    const uniwareData = await fetchAndValidate("Uniware Stock", SHEETS.uniware);
    appState.uniware = uniwareData;
    uniwareCountEl.textContent = uniwareData.length.toLocaleString();

    updateProgress(80, "Validating Company Remarks...");
    const remarksData = await fetchAndValidate("Company Remarks", SHEETS.remarks);
    appState.remarks = remarksData;
    remarksCountEl.textContent = remarksData.length.toLocaleString();

    updateProgress(
      100,
      "All Data Loaded Successfully ✔",
      "#16a34a"
    );

    console.log("App State Loaded:", appState);

  } catch (error) {
    updateProgress(
      100,
      "Validation Failed ❌",
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
