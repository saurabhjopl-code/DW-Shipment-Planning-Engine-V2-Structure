// ==========================================
// SHIPMENT REPORT RENDER WITH COLOR LOGIC (STABLE)
// ==========================================

export function renderShipmentReport(appState) {

  const tbody = document
    .getElementById("shipmentReportTable")
    .querySelector("tbody");

  tbody.innerHTML = "";

  appState.drrData.forEach(item => {

    const recall = item.recallQty ?? 0;
    const finalShipment = item.finalShipmentQty ?? 0;
    const required = item.requiredShipmentQty ?? 0;
    const spQty = item.spQty ?? 0;
    const stockCover = item.stockCover;

    const tr = document.createElement("tr");

    // Closed SKU Grey
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
      <td class="sc-cell">${stockCover === Infinity ? "∞" : (stockCover || 0).toFixed(1)}</td>
      <td>${required.toLocaleString()}</td>
      <td>${spQty.toLocaleString()}</td>
      <td class="final-cell">${finalShipment.toLocaleString()}</td>
      <td>${recall.toLocaleString()}</td>
    `;

    tbody.appendChild(tr);

    // 🔴 SC > 90
    if (stockCover > 90) {
      tr.querySelector(".sc-cell").style.color = "#dc2626";
      tr.querySelector(".sc-cell").style.fontWeight = "600";
    }

    // 🟠 Under Supplied
    if (!item.isClosed && finalShipment < required) {
      tr.querySelector(".final-cell").style.color = "#f59e0b";
      tr.querySelector(".final-cell").style.fontWeight = "600";
    }
  });
}
