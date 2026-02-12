// ==========================================
// REQUIRED SHIPMENT ENGINE
// Target = 45 Days
// Required = floor((DRR × 45) - FC Stock)
// If < 0 → 0
// ==========================================

const TARGET_DAYS = 45;

export function runRequiredEngine(appState) {

  appState.drrData.forEach(item => {

    const requiredStock = item.drr * TARGET_DAYS;

    let requiredQty = Math.floor(requiredStock - item.fcStock);

    if (requiredQty < 0) {
      requiredQty = 0;
    }

    item.requiredShipmentQty = requiredQty;

  });

  console.log("Required Shipment Engine Output:", appState.drrData);

  return appState.drrData;
}
