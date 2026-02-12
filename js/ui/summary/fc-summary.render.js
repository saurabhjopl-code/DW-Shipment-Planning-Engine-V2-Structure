// ==========================================
// FC SUMMARY RENDER
// ==========================================

export function renderFCSummary(appState) {

  const tbody = document.querySelector(
    ".content-container .card:nth-child(1) tbody"
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
        totalSale: 0
      };
    }

    fcGroups[key].totalStock += item.fcStock || 0;
    fcGroups[key].totalSale += item.totalUnits30D || 0;
  });

  Object.values(fcGroups).forEach(group => {

    const drr = group.totalSale / 30;

    const stockCover = drr === 0
      ? "∞"
      : (group.totalStock / drr).toFixed(1);

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${group.MP} - ${group.warehouseId}</td>
      <td>${group.totalStock.toLocaleString()}</td>
      <td>${group.totalSale.toLocaleString()}</td>
      <td>${drr.toFixed(2)}</td>
      <td>${stockCover}</td>
    `;

    tbody.appendChild(tr);
  });
}
