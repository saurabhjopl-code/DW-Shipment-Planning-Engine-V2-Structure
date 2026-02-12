// ==========================================
// STOCK COVER ENGINE (CONSOLIDATED)
// ==========================================

export function runSCEngine(appState) {

  appState.drrData.forEach(item => {

    const key = `${item.MP}__${item.MPSKU}__${item.warehouseId}`;

    const fcStock = appState.fcConsolidated[key] || 0;

    item.fcStock = fcStock;

    if (item.drr === 0) {
      item.stockCover = Infinity;
    } else {
      item.stockCover = fcStock / item.drr;
    }
  });

  return appState.drrData;
}
