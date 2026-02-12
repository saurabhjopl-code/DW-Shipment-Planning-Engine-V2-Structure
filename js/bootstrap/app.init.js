import { runConsolidationEngine } from "../core/consolidation/consolidation.engine.js";

import { runDRREngine } from "../core/demand/drr.engine.js";
import { runSCEngine } from "../core/demand/sc.engine.js";
import { runRequiredEngine } from "../core/demand/required.engine.js";
import { runRecallEngine } from "../core/demand/recall.engine.js";

import { runDistributionEngine } from "../core/distribution/distribution.engine.js";
import { runFinalShipmentEngine } from "../core/shipment/final-shipment.engine.js";

import { renderFCSummary } from "../ui/summary/fc-summary.render.js";
import { renderShipmentSummary } from "../ui/summary/shipment-summary.render.js";
import { renderShipmentReport } from "../ui/report/shipment-report.render.js";

// ===============================
// SHEET CONFIG
// ===============================

const SHEETS = {
  sale: {
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR_Ko_tmhbtxctjkYQ7zu25YB5C0zQPwcaUrqAUbcPw4daPmROC3gLff-gz-jkehXJdJ78Kh3eSpwvx/pub?gid=2115981230&single=true&output=csv",
    requiredHeaders: [
      "MP","Date","MPSKU","Channel ID","Quantity",
      "Warehouse Id","Fulfillment Type","Uniware SKU",
      "Style ID","Size"
    ],
    numericFields: ["Quantity"]
  },
  fc: {
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR_Ko_tmhbtxctjkYQ7zu25YB5C0zQPwcaUrqAUbcPw4daPmROC3gLff-gz-jkehXJdJ78Kh3eSpwvx/pub?gid=1945669210&single=true&output=csv",
    requiredHeaders: [
      "MP","Warehouse Id","MPSKU","Channel ID","Quantity"
    ],
    numericFields: ["Quantity"]
  },
  uniware: {
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR_Ko_tmhbtxctjkYQ7zu25YB5C0zQPwcaUrqAUbcPw4daPmROC3gLff-gz-jkehXJdJ78Kh3eSpwvx/pub?gid=1998228798&single=true&output=csv",
    requiredHeaders: [
      "Uniware SKU","Quantity","Allocate Quantity"
    ],
    numericFields: ["Quantity","Allocate Quantity"]
  },
  remarks: {
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR_Ko_tmhbtxctjkYQ7zu25YB5C0zQPwcaUrqAUbcPw4daPmROC3gLff-gz-jkehXJdJ78Kh3eSpwvx/pub?gid=218928762&single=true&output=csv",
    requiredHeaders: ["Style ID","Category","Company Remark"],
    numericFields: []
  }
};

// ===============================
// DOM REFERENCES
// ===============================

const progressFill = document.getElementById("progressFill");
const loadingText = document.getElementById("loadingText");

const saleCountEl = document.getElementById("saleCount");
const fcCountEl = document.getElementById("fcCount");
const uniwareCountEl = document.getElementById("uniwareCount");
const remarksCountEl = document.getElementById("remarksCount");

const refreshBtn = document.getElementById("refreshBtn");

// ===============================
// APP STATE
// ===============================

export const appState = {
  sale: [],
  fc: [],
  uniware: [],
  remarks: [],

  saleConsolidated: [],
  fcConsolidated: {},
  uniwareConsolidated: {},

  drrData: []
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

  const data = rows.slice(1).map(row => {
    const values = row.split(",");
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = values[index] ? values[index].trim() : "";
    });
    return obj;
  });

  return { headers, data };
}

function validateNumeric(data, fields, sheetName) {
  for (let row of data) {
    for (let field of fields) {
      if (row[field] === "") continue;

      const value = Number(row[field]);

      if (isNaN(value))
        throw new Error(`${sheetName}: Non-numeric ${field}`);

      if (value < 0)
        throw new Error(`${sheetName}: Negative ${field}`);

      row[field] = value;
    }
  }
}

async function fetchAndValidate(sheetKey, sheetConfig) {
  const response = await fetch(sheetConfig.url);
  if (!response.ok) throw new Error("Failed to fetch");

  const text = await response.text();
  const { headers, data } = parseCSV(text);

  const missing = sheetConfig.requiredHeaders.filter(
    required => !headers.includes(required)
  );

  if (missing.length > 0) {
    throw new Error(`${sheetKey}: Missing ${missing.join(", ")}`);
  }

  validateNumeric(data, sheetConfig.numericFields, sheetKey);

  return data;
}

// ===============================
// MAIN LOAD FLOW
// ===============================

async function loadAllSheets() {

  try {

    updateProgress(10, "Loading Sale...");
    appState.sale = await fetchAndValidate("Sale", SHEETS.sale);
    saleCountEl.textContent = appState.sale.length.toLocaleString();

    updateProgress(25, "Loading FC...");
    appState.fc = await fetchAndValidate("FC", SHEETS.fc);
    fcCountEl.textContent = appState.fc.length.toLocaleString();

    updateProgress(40, "Loading Uniware...");
    appState.uniware = await fetchAndValidate("Uniware", SHEETS.uniware);
    uniwareCountEl.textContent = appState.uniware.length.toLocaleString();

    updateProgress(55, "Loading Remarks...");
    appState.remarks = await fetchAndValidate("Remarks", SHEETS.remarks);
    remarksCountEl.textContent = appState.remarks.length.toLocaleString();

    // ===============================
    // CONSOLIDATION
    // ===============================

    updateProgress(65, "Consolidating Data...");
    runConsolidationEngine(appState);

    // ===============================
    // DEMAND SIDE
    // ===============================

    updateProgress(70, "Running DRR...");
    runDRREngine(appState);

    updateProgress(75, "Calculating Stock Cover...");
    runSCEngine(appState);

    updateProgress(80, "Calculating Required Shipment...");
    runRequiredEngine(appState);

    updateProgress(85, "Calculating Recall...");
    runRecallEngine(appState);

    // ===============================
    // SUPPLY SIDE
    // ===============================

    updateProgress(90, "Running Distribution...");
    runDistributionEngine(appState);

    updateProgress(93, "Calculating Final Shipment...");
    runFinalShipmentEngine(appState);

    // ===============================
    // RENDER
    // ===============================

    updateProgress(96, "Rendering Summary...");
    renderFCSummary(appState);
    renderShipmentSummary(appState);

    updateProgress(98, "Rendering Shipment Report...");
    renderShipmentReport(appState);

    updateProgress(100, "All Data Loaded Successfully ✔", "#16a34a");

  } catch (error) {

    updateProgress(100, "Validation Failed ❌", "#dc2626");
    console.error(error);
  }
}

// ===============================
// EVENTS
// ===============================

refreshBtn.addEventListener("click", () => {
  updateProgress(0, "Refreshing...");
  loadAllSheets();
});

loadAllSheets();
