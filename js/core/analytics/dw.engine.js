// ==========================================
// DEMAND WEIGHT ENGINE
// Pure analytics view – no mutation of shipment
// ==========================================

export function runDWEngine(appState) {

  const dwData = [];

  if (!appState.drrData || appState.drrData.length === 0) {
    appState.dwData = [];
    return [];
  }

  // Build MPSKU → Uniware map
  const mpskuToUSKU = {};
  appState.sale.forEach(row => {
    mpskuToUSKU[row["MPSKU"]] = row["Uniware SKU"];
  });

  // Group by USKU
  const uskuGroups = {};

  appState.drrData.forEach(item => {

    const usku = mpskuToUSKU[item.MPSKU] || "UNKNOWN";

    if (!uskuGroups[usku]) {
      uskuGroups[usku] = {
        allocateQty: appState.uniwareConsolidated?.[usku]?.allocateQty || 0,
        totalUnits: 0,
        rows: []
      };
    }

    uskuGroups[usku].totalUnits += item.totalUnits30D || 0;
    uskuGroups[usku].rows.push(item);
  });

  // Calculate DW + allocation view
  Object.keys(uskuGroups).forEach(usku => {

    const group = uskuGroups[usku];
    const totalUnits = group.totalUnits || 0;
    const allocateQty = group.allocateQty || 0;

    group.rows.forEach(item => {

      const internalDW =
        totalUnits === 0
          ? 0
          : (item.totalUnits30D || 0) / totalUnits;

      const calculatedSplit = Math.floor(allocateQty * internalDW);

      dwData.push({
        usku,
        mpsku: item.MPSKU,
        totalUnits: item.totalUnits30D || 0,
        internalDW,
        allocateQty,
        calculatedSplit,
        spQty: item.spQty || 0
      });

    });
  });

  appState.dwData = dwData;
  return dwData;
}
