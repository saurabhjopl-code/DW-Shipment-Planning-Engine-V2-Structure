// ==========================================
// FC SUMMARY RENDER WITH GRAND TOTAL
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

  let grandStock = 0;
  let grandSale = 0;

  Object.values(fcGroups).forEach(group => {

    const drr = group.totalSale / 30;
    const stockCover = drr === 0 ? "∞" : (group.totalStock / drr).toFixed(1);

    grandStock += group.totalStock;
    grandSale += group.totalSale;

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

  // Grand Total Row
  const grandDRR = grandSale / 30;
  const grandSC = grandDRR === 0 ? "∞" : (grandStock / grandDRR).toFixed(1);

  const totalRow = document.createElement("tr");
  totalRow.style.fontWeight = "bold";
  totalRow.style.background = "#f3f4f6";

  totalRow.innerHTML = `
    <td>GRAND TOTAL</td>
    <td>${grandStock.toLocaleString()}</td>
    <td>${grandSale.toLocaleString()}</td>
    <td>${grandDRR.toFixed(2)}</td>
    <td>${grandSC}</td>
  `;

  tbody.appendChild(totalRow);
}
