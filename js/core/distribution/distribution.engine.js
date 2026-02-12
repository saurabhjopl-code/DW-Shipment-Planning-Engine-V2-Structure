// ==========================================
// DW DISTRIBUTION ENGINE
// ==========================================

export function runDistributionEngine(appState) {

  const totalUnits = appState.drrData.reduce(
    (sum, item) => sum + item.totalUnits30D,
    0
  );

  // Build Uniware SKU mapping
  const mpskuToUSKU = {};
  appState.sale.forEach(row => {
    mpskuToUSKU[row["MPSKU"]] = row["Uniware SKU"];
  });

  // Group by Uniware SKU
  const uskuGroups = {};

  appState.drrData.forEach(item => {

    const usku = mpskuToUSKU[item.MPSKU];

    if (!uskuGroups[usku]) {
      uskuGroups[usku] = {
        totalUnits: 0,
        rows: []
      };
    }

    uskuGroups[usku].totalUnits += item.totalUnits30D;
    uskuGroups[usku].rows.push(item);
  });

  // Uniware allocation map
  const allocationMap = {};
  appState.uniware.forEach(row => {
    allocationMap[row["Uniware SKU"]] = row["Allocate Quantity"] || 0;
  });

  // Step 1 & 2 — USKU DW & S-Qty
  Object.keys(uskuGroups).forEach(usku => {

    const group = uskuGroups[usku];
    const uskuUnits = group.totalUnits;

    const uskuDW = totalUnits === 0 ? 0 : uskuUnits / totalUnits;

    const allocateQty = allocationMap[usku] || 0;

    const sQty = Math.floor(allocateQty * uskuDW);

    // Step 3 & 4 — MPSKU DW & SP-Qty
    group.rows.forEach(item => {

      const mpskuDW = uskuUnits === 0
        ? 0
        : item.totalUnits30D / uskuUnits;

      const spQty = Math.floor(sQty * mpskuDW);

      item.usku = usku;
      item.uskuDW = uskuDW;
      item.sQty = sQty;
      item.mpskuDW = mpskuDW;
      item.spQty = spQty;
    });
  });

  console.log("Distribution Engine Output:", appState.drrData);

  return appState.drrData;
}
