// ==========================================
// RECALL ENGINE WITH CLOSED OVERRIDE
// ==========================================

const RECALL_DAYS = 90;

export function runRecallEngine(appState) {

  // Build Style → Remark map
  const remarkMap = {};

  appState.remarks.forEach(row => {
    remarkMap[row["Style ID"]] = row["Company Remark"];
  });

  // Build MPSKU → Style ID map from sale sheet
  const mpskuStyleMap = {};

  appState.sale.forEach(row => {
    mpskuStyleMap[row["MPSKU"]] = row["Style ID"];
  });

  appState.drrData.forEach(item => {

    const styleId = mpskuStyleMap[item.MPSKU];
    const remark = remarkMap[styleId];

    let recallQty = 0;

    // 🔴 CLOSED OVERRIDE
    if (remark && remark.toLowerCase() === "closed") {

      recallQty = item.fcStock;

      item.requiredShipmentQty = 0;  // no shipment allowed
      item.isClosed = true;

    } 
    else {

      item.isClosed = false;

      if (item.drr === 0) {
        recallQty = item.fcStock;
      }
      else if (item.stockCover > RECALL_DAYS) {

        const allowedStock = item.drr * RECALL_DAYS;

        recallQty = Math.floor(item.fcStock - allowedStock);

        if (recallQty < 0) {
          recallQty = 0;
        }
      }
    }

    item.recallQty = recallQty;
  });

  console.log("Recall Engine Output:", appState.drrData);

  return appState.drrData;
}
