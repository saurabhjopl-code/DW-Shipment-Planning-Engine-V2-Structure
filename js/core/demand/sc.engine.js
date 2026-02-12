// ==========================================
// STOCK COVER ENGINE
// SC = FC Stock / DRR
// Level: MP → MPSKU → Warehouse Id
// ==========================================

export function runSCEngine(appState) {

  const fcStockMap = {};

  // Build FC stock map
  appState.fc.forEach(row => {
    const key = `${row["MP"]}__${row["MPSKU"]}__${row["Warehouse Id"]}`;
    const qty = Number(row["Quantity"]) || 0;

    if (!fcStockMap[key]) {
      fcStockMap[key] = 0;
    }

    fcStockMap[key] += qty;
  });

  // Attach FC Stock & calculate SC
  appState.drrData.forEach(item => {

    const key = `${item.MP}__${item.MPSKU}__${item.warehouseId}`;

    const fcStock = fcStockMap[key] || 0;

    item.fcStock = fcStock;

    if (item.drr === 0) {
      item.stockCover = Infinity;
    } else {
      item.stockCover = fcStock / item.drr;
    }
  });

  console.log("SC Engine Output:", appState.drrData);

  return appState.drrData;
}
