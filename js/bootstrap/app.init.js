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

import { exportShipment } from "../services/export/export-shipment.js";
import { exportRecall } from "../services/export/export-recall.js";

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

const exportShipmentBtn = document.querySelector(".btn.primary");
const exportRecallBtn = document.querySelector(".btn.danger");

const tabButtons = document.querySelectorAll(".tab");

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

  drrData: [],

  activeMP: "ALL"
};

// ===============================
// FILTER LOGIC (FIXED)
// ===============================

function getFilteredData() {

  if (appState.activeMP === "ALL")
    return appState.drrData;

  const target = appState.activeMP.toUpperCase();

  return appState.drrData.filter(item => {

    const mp = (item.MP || "").toUpperCase();

    if (target === "AMAZON IN")
      return mp.includes("AMAZON");

    if (target === "FLIPKART")
      return mp.includes("FLIPKART");

    if (target === "MYNTRA")
      return mp.includes("MYNTRA");

    if (target === "SELLER")
      return mp.includes("SELLER");

    return true;
  });
}

function renderAll() {
  const filtered = getFilteredData();

  renderFCSummary({ ...appState, drrData: filtered });
  renderShipmentSummary({ ...appState, drrData: filtered });
  renderShipmentReport({ ...appState, drrData: filtered });
}

// ===============================
// TAB EVENTS
// ===============================

tabButtons.forEach(tab => {

  tab.addEventListener("click", () => {

    tabButtons.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    const label = tab.textContent.trim();

    if (label === "Amazon IN")
      appState.activeMP = "AMAZON IN";
    else if (label === "Flipkart")
      appState.activeMP = "FLIPKART";
    else if (label === "Myntra")
      appState.activeMP = "MYNTRA";
    else if (label === "SELLER")
      appState.activeMP = "SELLER";
    else
      appState.activeMP = "ALL";

    renderAll();
  });
});
