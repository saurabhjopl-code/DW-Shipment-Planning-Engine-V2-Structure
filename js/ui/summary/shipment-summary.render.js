// ==========================================
// SHIPMENT SUMMARY WITH COLOR LOGIC (STABLE)
// ==========================================

export function renderShipmentSummary(appState) {

  const tbody = document
    .getElementById("shipmentSummaryTable")
    .querySelector("tbody");

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

  Object.values(fcGroups).forEach(group => {

    const drr = group.totalSale / 30;

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${group.MP} - ${group.warehouseId}</td>
      <td>${group.totalStock.toLocaleString()}</td>
      <td>${group.totalSale.toLocaleString()}</td>
      <td>${drr.toFixed(2)}</td>
      <td>${group.totalRequired.toLocaleString()}</td>
      <td class="final-cell">${group.totalFinal.toLocaleString()}</td>
      <td>${group.totalRecall.toLocaleString()}</td>
    `;

    tbody.appendChild(tr);

    // Under Supply Highlight
    if (group.totalFinal < group.totalRequired) {
      tr.querySelector(".final-cell").style.color = "#f59e0b";
      tr.querySelector(".final-cell").style.fontWeight = "600";
    }
  });
}
