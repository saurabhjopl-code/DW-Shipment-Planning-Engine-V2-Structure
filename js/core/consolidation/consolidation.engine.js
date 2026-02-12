// ==========================================
// CONSOLIDATION ENGINE
// ==========================================

export function runConsolidationEngine(appState) {

  // ==============================
  // 1️⃣ CONSOLIDATE SALE
  // ==============================

  const saleMap = {};

  appState.sale.forEach(row => {

    const key = `${row["MP"]}__${row["MPSKU"]}__${row["Warehouse Id"]}`;
    const qty = Number(row["Quantity"]) || 0;

    if (!saleMap[key]) {
      saleMap[key] = {
        MP: row["MP"],
        MPSKU: row["MPSKU"],
        warehouseId: row["Warehouse Id"],
        totalUnits30D: 0
      };
    }

    saleMap[key].totalUnits30D += qty;
  });

  appState.saleConsolidated = Object.values(saleMap);

  // ==============================
  // 2️⃣ CONSOLIDATE FC STOCK
  // ==============================

  const fcMap = {};

  appState.fc.forEach(row => {

    const key = `${row["MP"]}__${row["MPSKU"]}__${row["Warehouse Id"]}`;
    const qty = Number(row["Quantity"]) || 0;

    if (!fcMap[key]) {
      fcMap[key] = 0;
    }

    fcMap[key] += qty;
  });

  appState.fcConsolidated = fcMap;

  // ==============================
  // 3️⃣ CONSOLIDATE UNIWARE
  // ==============================

  const uniwareMap = {};

  appState.uniware.forEach(row => {

    const usku = row["Uniware SKU"];

    if (!uniwareMap[usku]) {
      uniwareMap[usku] = {
        usku: usku,
        totalStock: 0,
        allocateQty: 0
      };
    }

    uniwareMap[usku].totalStock += Number(row["Quantity"]) || 0;
    uniwareMap[usku].allocateQty += Number(row["Allocate Quantity"]) || 0;
  });

  appState.uniwareConsolidated = uniwareMap;

  return appState;
}
