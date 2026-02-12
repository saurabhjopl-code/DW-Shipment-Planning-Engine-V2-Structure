// ==========================================
// SHIPMENT REPORT RENDER
// ==========================================

export function renderShipmentReport(appState) {

  const tbody = document.querySelector(
    ".content-container .card:nth-child(3) tbody"
  );

  tbody.innerHTML = "";

  appState.drrData.forEach(item => {

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${item.MP}</td>
      <td>${item.MPSKU}</td>
      <td>${item.warehouseId}</td>
      <td>${item.usku || ""}</td>
      <td>${item.totalUnits30D.toLocaleString()}</td>
      <td>${item.drr.toFixed(2)}</td>
      <td>${item.fcStock.toLocaleString()}</td>
      <td>${item.stockCover === Infinity ? "∞" : item.stockCover.toFixed(1)}</td>
      <td>${(item.requiredShipmentQty || 0).toLocaleString()}</td>
      <td>${(item.spQty || 0).toLocaleString()}</td>
      <td>${(item.finalShipmentQty || 0).toLocaleString()}</td>
      <td>${(item.recallQty || 0).toLocaleString()}</td>
    `;

    tbody.appendChild(tr);
  });
}
