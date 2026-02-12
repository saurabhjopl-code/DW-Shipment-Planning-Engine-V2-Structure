// ==========================================
// DRR ENGINE (USES CONSOLIDATED SALE)
// ==========================================

export function runDRREngine(appState) {

  appState.drrData = appState.saleConsolidated.map(item => ({
    MP: item.MP,
    MPSKU: item.MPSKU,
    warehouseId: item.warehouseId,
    totalUnits30D: item.totalUnits30D,
    drr: item.totalUnits30D / 30
  }));

  return appState.drrData;
}
