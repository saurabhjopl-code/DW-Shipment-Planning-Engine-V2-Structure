// ==========================================
// FINAL SHIPMENT ENGINE
// Final = min(Required, SP-Qty)
// Closed SKU → 0
// ==========================================

export function runFinalShipmentEngine(appState) {

  appState.drrData.forEach(item => {

    let finalQty = Math.min(
      item.requiredShipmentQty || 0,
      item.spQty || 0
    );

    if (item.isClosed) {
      finalQty = 0;
    }

    if (finalQty < 0) {
      finalQty = 0;
    }

    item.finalShipmentQty = finalQty;
  });

  console.log("Final Shipment Output:", appState.drrData);

  return appState.drrData;
}
