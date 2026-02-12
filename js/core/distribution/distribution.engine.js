// ==========================================
// ROBUST DW DISTRIBUTION ENGINE
// ==========================================

export function runDistributionEngine(appState) {

  const totalUnits = appState.drrData.reduce(
    (sum, item) => sum + (item.totalUnits30D || 0),
    0
  );

  // Build MPSKU → Uniware SKU map
  const mpskuToUSKU = {};
  appState.sale.forEach(row => {
    if (row["MPSKU"] && row["Uniware SKU"]) {
      mpskuToUSKU[row["MPSKU"]] = row["Uniware SKU"];
    }
  });

  // Group rows by Uniware SKU
  const uskuGroups = {};

  appState.drrData.forEach(item => {

    const usku = mpskuToUSKU[item.MPSKU] || null;

    item.usku = usku;   // assign early

    if (!uskuGroups[usku]) {
      uskuGroups[usku] = {
        totalUnits: 0,
        rows: []
      };
    }

    uskuGroups[usku].totalUnits += item.totalUnits30D || 0;
    uskuGroups[usku].rows.push(item);
  });

  // Build Allocation map
  const allocationMap = {};
  appState.uniware.forEach(row => {
    allocationMap[row["Uniware SKU"]] = Number(row["Allocate Quantity"]) || 0;
  });

  // Process each Uniware group
  Object.keys(uskuGroups).forEach(usku => {

    const group = uskuGroups[usku];
    const uskuUnits = group.totalUnits || 0;

    const uskuDW = totalUnits === 0 ? 0 : uskuUnits / totalUnits;

    const allocateQty = allocationMap[usku] || 0;

    const sQty = Math.floor(allocateQty * uskuDW);

    group.rows.forEach(item => {

      const mpskuDW = uskuUnits === 0
        ? 0
        : (item.totalUnits30D || 0) / uskuUnits;

      const spQty = Math.floor(sQty * mpskuDW);

      item.uskuDW = uskuDW || 0;
      item.sQty = sQty || 0;
      item.mpskuDW = mpskuDW || 0;
      item.spQty = spQty || 0;   // 🔥 always numeric
    });
  });

  return appState.drrData;
}
