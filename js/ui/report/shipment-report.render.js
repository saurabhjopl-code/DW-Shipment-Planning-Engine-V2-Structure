// ==========================================
// SHIPMENT REPORT RENDER (WITH SAFE RECALL)
// ==========================================

export function renderShipmentReport(appState) {

  const tbody = document.querySelector(
    ".content-container .card:nth-child(3) tbody"
  );

  tbody.innerHTML = "";

  appState.drrData.forEach(item => {

    const recall = item.recallQty ?? 0;
    const finalShipment = item.finalShipmentQty ?? 0;
    const spQty = item.spQty ?? 0;

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${item.MP}</td>
      <td>${item.MPSKU}</td>
      <td>${item.warehouseId}</td>
      <td>${item.usku || ""}</td>
      <td>${(item.totalUnits30D || 0).toLocaleString()}</td>
      <td>${(item.drr || 0).toFixed(2)}</td>
      <td>${(item.fcStock || 0).toLocaleString()}</td>
      <td>${item.stockCover === Infinity ? "∞" : (item.stockCover || 0).toFixed(1)}</td>
      <td>${(item.requiredShipmentQty || 0).toLocaleString()}</td>
      <td>${spQty.toLocaleString()}</td>
      <td>${finalShipment.toLocaleString()}</td>
      <td>${recall.toLocaleString()}</td>
    `;

    tbody.appendChild(tr);
  });
}
