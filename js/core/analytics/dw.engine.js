// ==========================================
// DEMAND WEIGHT ENGINE (ALLOCATION VIEW)
// Based on CURRENT distribution logic
// ==========================================

export function runDWEngine(appState) {

  const dwData = [];

  // Build MPSKU → Uniware map
  const mpskuToUSKU = {};
  appState.sale.forEach(row => {
    mpskuToUSKU[row["MPSKU"]] = row["Uniware SKU"];
  });

  // Group drrData by USKU
  const uskuGroups = {};

  appState.drrData.forEach(item => {

    const usku = mpskuToUSKU[item.MPSKU] || null;
    if (!usku) return;

    if (!uskuGroups[usku]) {
      uskuGroups[usku] = {
        allocateQty: appState.uniwareConsolidated[usku]?.allocateQty || 0,
        totalUnits: 0,
        rows: []
      };
    }

    uskuGroups[usku].totalUnits += item.totalUnits30D || 0;
    uskuGroups[usku].rows.push(item);
  });

  // Calculate internal DW + allocation split
  Object.keys(uskuGroups).forEach(usku => {

    const group = uskuGroups[usku];
    const totalUnits = group.totalUnits || 0;
    const allocateQty = group.allocateQty || 0;

    group.rows.forEach(item => {

      const internalDW = totalUnits === 0
        ? 0
        : (item.totalUnits30D || 0) / totalUnits;

      const calculatedSplit = Math.floor(allocateQty * internalDW);

      dwData.push({
        usku,
        mpsku: item.MPSKU,
        totalUnits: item.totalUnits30D || 0,
        internalDW,
        allocateQty,
        spQty: item.spQty || 0,
        calculatedSplit
      });
    });
  });

  appState.dwData = dwData;

  return dwData;
}
