// ==========================================
// FINAL SHIPMENT ENGINE (SELLER POOL FIXED)
// ==========================================

export function runFinalShipmentEngine(appState) {

  // Step 0: Seller Pool = Allocate Quantity ONLY
  const sellerPool = {};

  Object.values(appState.uniwareConsolidated).forEach(item => {
    sellerPool[item.usku] = item.allocateQty || 0;
  });

  // Step 1: Calculate UnderSupplyGap
  appState.drrData.forEach(item => {

    const required = item.requiredShipmentQty || 0;
    const spQty = item.spQty || 0;

    item.underSupplyGap = Math.max(required - spQty, 0);
    item.sellerAllocatedQty = 0;
  });

  // Step 2: Group by USKU
  const uskuGroups = {};

  appState.drrData.forEach(item => {

    if (!uskuGroups[item.usku]) {
      uskuGroups[item.usku] = [];
    }

    uskuGroups[item.usku].push(item);
  });

  // Step 3: Allocate Seller Pool
  Object.keys(uskuGroups).forEach(usku => {

    let available = sellerPool[usku] || 0;

    if (available <= 0) return;

    const rows = uskuGroups[usku]
      .filter(r => r.underSupplyGap > 0)
      .sort((a, b) => b.underSupplyGap - a.underSupplyGap);

    for (let row of rows) {

      if (available <= 0) break;

      const allocate = Math.min(row.underSupplyGap, available);

      row.sellerAllocatedQty = allocate;
      available -= allocate;
    }
  });

  // Step 4: Final Shipment
  appState.drrData.forEach(item => {

    const spQty = item.spQty || 0;
    const sellerQty = item.sellerAllocatedQty || 0;

    item.finalShipmentQty = spQty + sellerQty;
  });

  return appState.drrData;
}
