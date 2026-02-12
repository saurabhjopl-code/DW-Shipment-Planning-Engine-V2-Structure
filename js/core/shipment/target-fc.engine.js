// ==========================================
// TARGET FC ENGINE (RECOMMENDATION ONLY)
// ==========================================

export function runTargetFCEngine(appState) {

  // Build MPSKU → FC rows map
  const skuMap = {};

  appState.drrData.forEach(item => {

    if (item.warehouseId !== "SELLER") {

      if (!skuMap[item.MPSKU]) {
        skuMap[item.MPSKU] = [];
      }

      skuMap[item.MPSKU].push(item);
    }
  });

  appState.drrData.forEach(item => {

    // Normal FC rows
    if (item.warehouseId !== "SELLER") {
      item.targetFC = item.warehouseId;
      return;
    }

    // Seller rows
    const fcRows = skuMap[item.MPSKU] || [];

    if (!fcRows.length) {
      item.targetFC = "-";
      return;
    }

    // Filter non-closed rows
    const validRows = fcRows.filter(r => !r.isClosed);

    if (!validRows.length) {
      item.targetFC = "-";
      return;
    }

    // Sort by lowest Stock Cover
    validRows.sort((a, b) => (a.stockCover || 0) - (b.stockCover || 0));

    // Take Top 3
    const top3 = validRows.slice(0, 3);

    item.targetFC = top3
      .map(r => r.warehouseId)
      .join(" | ");
  });

  return appState.drrData;
}
