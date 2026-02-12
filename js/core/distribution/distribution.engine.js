// ==========================================
// DISTRIBUTION ENGINE (CONSOLIDATED)
// ==========================================

export function runDistributionEngine(appState) {

  // Build MPSKU → Uniware map
  const mpskuToUSKU = {};
  appState.sale.forEach(row => {
    mpskuToUSKU[row["MPSKU"]] = row["Uniware SKU"];
  });

  // Group by USKU
  const uskuGroups = {};

  appState.drrData.forEach(item => {

    const usku = mpskuToUSKU[item.MPSKU] || null;

    item.usku = usku;

    if (!uskuGroups[usku]) {
      uskuGroups[usku] = {
        totalUnits: 0,
        rows: []
      };
    }

    uskuGroups[usku].totalUnits += item.totalUnits30D;
    uskuGroups[usku].rows.push(item);
  });

  Object.keys(uskuGroups).forEach(usku => {

    const group = uskuGroups[usku];
    const uskuUnits = group.totalUnits || 0;

    const allocateQty =
      appState.uniwareConsolidated[usku]?.allocateQty || 0;

    const sQty = allocateQty;

    group.rows.forEach(item => {

      const mpskuDW = uskuUnits === 0
        ? 0
        : item.totalUnits30D / uskuUnits;

      const spQty = Math.floor(sQty * mpskuDW);

      item.spQty = spQty || 0;
    });
  });

  return appState.drrData;
}
