// ==========================================
// FC SUMMARY RENDER (ID-INDEPENDENT SAFE)
// ==========================================

export function renderFCSummary(appState) {

  const fcCard = document.querySelector(".content-container .card:nth-child(1)");
  if (!fcCard) return;

  const tbody = fcCard.querySelector("tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  const fcStockMap = {};
  const fcSaleMap = {};

  // 1️⃣ FULL STOCK from FC sheet
  appState.fc.forEach(row => {

    const fc = row["Warehouse Id"];
    const qty = row["Quantity"] || 0;

    if (!fcStockMap[fc]) fcStockMap[fc] = 0;
    fcStockMap[fc] += qty;
  });

  // 2️⃣ SALE from drrData
  appState.drrData.forEach(item => {

    const fc = item["Warehouse Id"];
    const sale = item.totalUnits30D || 0;

    if (!fcSaleMap[fc]) fcSaleMap[fc] = 0;
    fcSaleMap[fc] += sale;
  });

  const allFCs = new Set([
    ...Object.keys(fcStockMap),
    ...Object.keys(fcSaleMap)
  ]);

  let grandStock = 0;
  let grandSale = 0;
  let grandDRR = 0;

  allFCs.forEach(fc => {

    const totalStock = fcStockMap[fc] || 0;
    const totalSale = fcSaleMap[fc] || 0;

    const drr = totalSale / 30;
    const stockCover = drr > 0 ? totalStock / drr : 0;

    grandStock += totalStock;
    grandSale += totalSale;
    grandDRR += drr;

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${fc}</td>
      <td>${totalStock.toLocaleString()}</td>
      <td>${totalSale.toLocaleString()}</td>
      <td>${drr.toFixed(2)}</td>
      <td>${stockCover.toFixed(1)}</td>
    `;

    tbody.appendChild(tr);
  });

  // Grand total
  const grandSC = grandDRR > 0 ? grandStock / grandDRR : 0;

  const grandRow = document.createElement("tr");
  grandRow.style.fontWeight = "600";
  grandRow.style.background = "#f3f4f6";

  grandRow.innerHTML = `
    <td>GRAND TOTAL</td>
    <td>${grandStock.toLocaleString()}</td>
    <td>${grandSale.toLocaleString()}</td>
    <td>${grandDRR.toFixed(2)}</td>
    <td>${grandSC.toFixed(1)}</td>
  `;

  tbody.appendChild(grandRow);
}
