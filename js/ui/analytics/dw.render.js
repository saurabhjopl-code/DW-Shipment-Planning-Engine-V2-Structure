// ==========================================
// DEMAND WEIGHT RENDER (EXPANDABLE GLOBAL)
// ==========================================

export function renderDW(appState) {

  const shipmentCard = document.querySelector(
    ".content-container .card:nth-child(3)"
  );

  if (!shipmentCard) return;

  shipmentCard.innerHTML = `
    <h2>Demand Weight (Global View)</h2>
    <table>
      <thead>
        <tr>
          <th>Uniware SKU</th>
          <th>USKU 30D Sale (Total)</th>
          <th>Allocate Qty</th>
          <th>Expand</th>
        </tr>
      </thead>
      <tbody id="dwBody"></tbody>
    </table>
  `;

  const tbody = document.getElementById("dwBody");
  if (!tbody) return;

  // Group by USKU
  const uskuGroups = {};

  appState.dwData.forEach(row => {

    if (!uskuGroups[row.usku]) {
      uskuGroups[row.usku] = {
        totalUnits: 0,
        allocateQty: row.allocateQty,
        rows: []
      };
    }

    uskuGroups[row.usku].totalUnits += row.totalUnits;
    uskuGroups[row.usku].rows.push(row);
  });

  Object.keys(uskuGroups).forEach(usku => {

    const group = uskuGroups[usku];

    const tr = document.createElement("tr");
    tr.style.fontWeight = "600";
    tr.style.background = "#f9fafb";

    tr.innerHTML = `
      <td>${usku}</td>
      <td>${group.totalUnits.toLocaleString()}</td>
      <td>${group.allocateQty.toLocaleString()}</td>
      <td><button class="dw-toggle">+</button></td>
    `;

    tbody.appendChild(tr);

    const childContainer = document.createElement("tr");
    childContainer.style.display = "none";

    childContainer.innerHTML = `
      <td colspan="4">
        <table style="width:100%; margin-top:8px;">
          <thead>
            <tr>
              <th>MP SKU</th>
              <th>30D Sale</th>
              <th>Internal DW</th>
              <th>Calculated Split</th>
              <th>SP Qty (Engine)</th>
            </tr>
          </thead>
          <tbody>
            ${group.rows.map(r => `
              <tr>
                <td>${r.mpsku}</td>
                <td>${r.totalUnits.toLocaleString()}</td>
                <td>${r.internalDW.toFixed(4)}</td>
                <td>${r.calculatedSplit.toLocaleString()}</td>
                <td>${r.spQty.toLocaleString()}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </td>
    `;

    tbody.appendChild(childContainer);

    tr.querySelector(".dw-toggle").addEventListener("click", e => {

      const isHidden = childContainer.style.display === "none";
      childContainer.style.display = isHidden ? "table-row" : "none";
      e.target.textContent = isHidden ? "-" : "+";
    });
  });
}
