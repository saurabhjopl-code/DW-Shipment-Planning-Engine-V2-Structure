// ==========================================
// EXPORT RECALL CSV
// ==========================================

function downloadCSV(filename, rows) {

  const processRow = (row) =>
    row.map(value =>
      `"${String(value).replace(/"/g, '""')}"`
    ).join(",");

  const csvContent = rows.map(processRow).join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;"
  });

  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportRecall(appState) {

  const rows = [
    ["MP", "MPSKU", "Warehouse Id", "Recall Qty"]
  ];

  appState.drrData.forEach(item => {

    if ((item.recallQty || 0) > 0) {
      rows.push([
        item.MP,
        item.MPSKU,
        item.warehouseId,
        item.recallQty
      ]);
    }
  });

  downloadCSV("Recall_Report.csv", rows);
}
