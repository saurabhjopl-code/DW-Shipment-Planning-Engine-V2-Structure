// ==========================================
// DEMAND WEIGHT RENDER
// ==========================================

export function renderDW(appState) {

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
