export function renderShipmentReport(appState) {

  const tbody = document.getElementById("shipmentReportBody");
  if (!tbody) return;

  tbody.innerHTML = "";

  appState.drrData.forEach(item => {

    const recall = item.recallQty ?? 0;
    const finalShipment = item.finalShipmentQty ?? 0;
    const required = item.requiredShipmentQty ?? 0;
    const spQty = item.spQty ?? 0;
    const stockCover = item.stockCover;

    const tr = document.createElement("tr");

    if (item.isClosed) {
      tr.style.background = "#f3f4f6";
      tr.style.color = "#6b7280";
    }

    tr.innerHTML = `
      <td>${item.MP}</td>
      <td>${item.MPSKU}</td>
      <td>${item.warehouseId}</td>
      <td>${item.usku || ""}</td>
      <td>${(item.totalUnits30D || 0).toLocaleString()}</td>
      <td>${(item.drr || 0).toFixed(2)}</td>
      <td>${(item.fcStock || 0).toLocaleString()}</td>
      <td>${stockCover === Infinity ? "∞" : (stockCover || 0).toFixed(1)}</td>
      <td>${required.toLocaleString()}</td>
      <td>${spQty.toLocaleString()}</td>
      <td>${finalShipment.toLocaleString()}</td>
      <td>${recall.toLocaleString()}</td>
      <td>${item.targetFC || item.warehouseId}</td>
    `;

    tbody.appendChild(tr);
  });
}
