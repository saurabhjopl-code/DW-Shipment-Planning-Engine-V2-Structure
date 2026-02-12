// ==========================================
// FINAL SHIPMENT ENGINE (SAFE)
// ==========================================

export function runFinalShipmentEngine(appState) {

  appState.drrData.forEach(item => {

    const required = item.requiredShipmentQty || 0;
    const supply = item.spQty || 0;

    let finalQty = Math.min(required, supply);

    if (item.isClosed) {
      finalQty = 0;
    }

    if (!finalQty || finalQty < 0) {
      finalQty = 0;
    }

    item.finalShipmentQty = finalQty;
  });

  return appState.drrData;
}
