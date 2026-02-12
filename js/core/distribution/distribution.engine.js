// ==========================================
// DISTRIBUTION ENGINE (EXCLUDES SELLER MP)
// ==========================================

export function runDistributionEngine(appState) {

  const mpskuToUSKU = {};
  appState.sale.forEach(row => {
    mpskuToUSKU[row["MPSKU"]] = row["Uniware SKU"];
  });

  const uskuGroups = {};

  appState.drrData.forEach(item => {

    // Ignore Seller MP rows
    if ((item.MP || "").toUpperCase().includes("SELLER"))
      return;

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

    group.rows.forEach(item => {

      const weight = uskuUnits === 0
        ? 0
        : item.totalUnits30D / uskuUnits;

      const spQty = Math.floor(allocateQty * weight);

      item.spQty = spQty || 0;
    });
  });

  return appState.drrData;
}
