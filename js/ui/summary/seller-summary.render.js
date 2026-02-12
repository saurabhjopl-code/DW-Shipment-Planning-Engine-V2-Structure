// ==========================================
// SELLER ALLOCATION SUMMARY RENDER
// ==========================================

export function renderSellerSummary(appState) {

  const tbody = document.querySelector(
    ".content-container .card:nth-child(3) tbody"
  );

  tbody.innerHTML = "";

  const summary = {};

  // Build base from Allocate Quantity
  Object.values(appState.uniwareConsolidated).forEach(item => {

    summary[item.usku] = {
      allocateLimit: item.allocateQty || 0,
      used: 0
    };
  });

  // Add seller allocated usage
  appState.drrData.forEach(item => {

    const usku = item.usku;
    const used = item.sellerAllocatedQty || 0;

    if (!summary[usku]) {
      summary[usku] = {
        allocateLimit: 0,
        used: 0
      };
    }

    summary[usku].used += used;
  });

  Object.keys(summary).forEach(usku => {

    const allocate = summary[usku].allocateLimit;
    const used = summary[usku].used;
    const balance = allocate - used;

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${usku}</td>
      <td>${allocate.toLocaleString()}</td>
      <td>${used.toLocaleString()}</td>
      <td>${balance.toLocaleString()}</td>
    `;

    tbody.appendChild(tr);
  });
}
