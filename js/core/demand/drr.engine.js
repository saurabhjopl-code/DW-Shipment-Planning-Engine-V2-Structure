// ==========================================
// DRR ENGINE
// Calculates 30D Units & DRR
// Level: MP → MPSKU → Warehouse Id
// Includes FC + Seller sales
// ==========================================

export function runDRREngine(appState) {

  const grouped = {};

  appState.sale.forEach(row => {

    const mp = row["MP"];
    const mpsku = row["MPSKU"];
    const warehouse = row["Warehouse Id"];
    const qty = Number(row["Quantity"]) || 0;

    const key = `${mp}__${mpsku}__${warehouse}`;

    if (!grouped[key]) {
      grouped[key] = {
        MP: mp,
        MPSKU: mpsku,
        warehouseId: warehouse,
        totalUnits30D: 0,
        drr: 0
      };
    }

    grouped[key].totalUnits30D += qty;
  });

  // Calculate DRR
  Object.values(grouped).forEach(item => {
    item.drr = item.totalUnits30D / 30;
  });

  // Save in state
  appState.drrData = Object.values(grouped);

  console.log("DRR Engine Output:", appState.drrData);

  return appState.drrData;
}
