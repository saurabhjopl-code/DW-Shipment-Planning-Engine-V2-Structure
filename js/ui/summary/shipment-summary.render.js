// ==========================================
// SHIPMENT & RECALL SUMMARY WITH GRAND TOTAL
// ==========================================

export function renderShipmentSummary(appState) {

  const tbody = document.querySelector(
    ".content-container .card:nth-child(2) tbody"
  );

  tbody.innerHTML = "";

  const fcGroups = {};

  appState.drrData.forEach(item => {

    const key = `${item.MP}__${item.warehouseId}`;

    if (!fcGroups[key]) {
      fcGroups[key] = {
        MP: item.MP,
        warehouseId: item.warehouseId,
        totalStock: 0,
        totalSale: 0,
        totalRequired: 0,
        totalFinal: 0,
        totalRecall: 0
      };
    }

    fcGroups[key].totalStock += item.fcStock || 0;
    fcGroups[key].totalSale += item.totalUnits30D || 0;
    fcGroups[key].totalRequired += item.requiredShipmentQty || 0;
    fcGroups[key].totalFinal += item.finalShipmentQty || 0;
    fcGroups[key].totalRecall += item.recallQty || 0;
  });

  let grandStock = 0;
  let grandSale = 0;
  let grandRequired = 0;
  let grandFinal = 0;
  let grandRecall = 0;

  Object.values(fcGroups).forEach(group => {

    const drr = group.totalSale / 30;

    grandStock += group.totalStock;
    grandSale += group.totalSale;
    grandRequired += group.totalRequired;
    grandFinal += group.totalFinal;
    grandRecall += group.totalRecall;

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${group.MP} - ${group.warehouseId}</td>
      <td>${group.totalStock.toLocaleString()}</td>
      <td>${group.totalSale.toLocaleString()}</td>
      <td>${drr.toFixed(2)}</td>
      <td>${group.totalRequired.toLocaleString()}</td>
      <td>${group.totalFinal.toLocaleString()}</td>
      <td>${group.totalRecall.toLocaleString()}</td>
    `;

    tbody.appendChild(tr);
  });

  const grandDRR = grandSale / 30;

  const totalRow = document.createElement("tr");
  totalRow.style.fontWeight = "bold";
  totalRow.style.background = "#f3f4f6";

  totalRow.innerHTML = `
    <td>GRAND TOTAL</td>
    <td>${grandStock.toLocaleString()}</td>
    <td>${grandSale.toLocaleString()}</td>
    <td>${grandDRR.toFixed(2)}</td>
    <td>${grandRequired.toLocaleString()}</td>
    <td>${grandFinal.toLocaleString()}</td>
    <td>${grandRecall.toLocaleString()}</td>
  `;

  tbody.appendChild(totalRow);
}
