// ==========================================
// RECALL ENGINE
// Threshold = 90 Days
// Recall if Stock Cover > 90
// ==========================================

const RECALL_DAYS = 90;

export function runRecallEngine(appState) {

  appState.drrData.forEach(item => {

    let recallQty = 0;

    if (item.drr === 0) {
      // No demand → recall all stock
      recallQty = item.fcStock;
    }
    else if (item.stockCover > RECALL_DAYS) {

      const allowedStock = item.drr * RECALL_DAYS;

      recallQty = Math.floor(item.fcStock - allowedStock);

      if (recallQty < 0) {
        recallQty = 0;
      }
    }

    item.recallQty = recallQty;
  });

  console.log("Recall Engine Output:", appState.drrData);

  return appState.drrData;
}
