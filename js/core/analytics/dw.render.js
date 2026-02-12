// ==========================================
// DEMAND WEIGHT RENDER (SAFE VERSION)
// ==========================================

export function renderDW(appState) {

  // Find shipment report card body and reuse it
  const shipmentCard = document.querySelector(
    ".content-container .card:nth-child(3)"
  );

  if (!shipmentCard) return;

  shipmentCard.innerHTML = `
    <h2>Demand Weight (Global View)</h2>
    <table>
      <thead>
        <tr>
          <th>Uniware SKU</th>
          <th>MP SKU</th>
          <th>30D Units</th>
          <th>Internal DW</th>
          <th>Allocate Qty</th>
          <th>Calculated Split</th>
          <th>SP Qty (Engine)</th>
        </tr>
      </thead>
      <tbody id="dwBody"></tbody>
    </table>
  `;

  const tbody = document.getElementById("dwBody");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (!appState.dwData || appState.dwData.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7">No data available.</td>
      </tr>
    `;
    return;
  }

  appState.dwData.forEach(row => {

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${row.usku}</td>
      <td>${row.mpsku}</td>
      <td>${row.totalUnits.toLocaleString()}</td>
      <td>${row.internalDW.toFixed(4)}</td>
      <td>${row.allocateQty.toLocaleString()}</td>
      <td>${row.calculatedSplit.toLocaleString()}</td>
      <td>${row.spQty.toLocaleString()}</td>
    `;

    tbody.appendChild(tr);
  });
}
