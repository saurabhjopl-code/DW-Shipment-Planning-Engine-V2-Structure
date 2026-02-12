const SHEETS = {
  sale: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR_Ko_tmhbtxctjkYQ7zu25YB5C0zQPwcaUrqAUbcPw4daPmROC3gLff-gz-jkehXJdJ78Kh3eSpwvx/pub?gid=2115981230&single=true&output=csv",
  fc: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR_Ko_tmhbtxctjkYQ7zu25YB5C0zQPwcaUrqAUbcPw4daPmROC3gLff-gz-jkehXJdJ78Kh3eSpwvx/pub?gid=1945669210&single=true&output=csv",
  uniware: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR_Ko_tmhbtxctjkYQ7zu25YB5C0zQPwcaUrqAUbcPw4daPmROC3gLff-gz-jkehXJdJ78Kh3eSpwvx/pub?gid=1998228798&single=true&output=csv",
  remarks: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR_Ko_tmhbtxctjkYQ7zu25YB5C0zQPwcaUrqAUbcPw4daPmROC3gLff-gz-jkehXJdJ78Kh3eSpwvx/pub?gid=218928762&single=true&output=csv"
};

const progressFill = document.getElementById("progressFill");
const loadingText = document.getElementById("loadingText");

const saleCountEl = document.getElementById("saleCount");
const fcCountEl = document.getElementById("fcCount");
const uniwareCountEl = document.getElementById("uniwareCount");
const remarksCountEl = document.getElementById("remarksCount");

const refreshBtn = document.getElementById("refreshBtn");

function updateProgress(percent, text, color = "#2563eb") {
  progressFill.style.width = percent + "%";
  progressFill.style.background = color;
  loadingText.textContent = text;
  loadingText.style.color = color;
}

async function fetchCSV(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch");
  const text = await response.text();
  return text.trim().split("\n").length - 1;
}

async function loadAllSheets() {
  try {
    updateProgress(10, "Loading Sale 30D...");
    const saleRows = await fetchCSV(SHEETS.sale);
    saleCountEl.textContent = saleRows.toLocaleString();

    updateProgress(35, "Loading FC Stock...");
    const fcRows = await fetchCSV(SHEETS.fc);
    fcCountEl.textContent = fcRows.toLocaleString();

    updateProgress(60, "Loading Uniware Stock...");
    const uniwareRows = await fetchCSV(SHEETS.uniware);
    uniwareCountEl.textContent = uniwareRows.toLocaleString();

    updateProgress(85, "Loading Company Remarks...");
    const remarksRows = await fetchCSV(SHEETS.remarks);
    remarksCountEl.textContent = remarksRows.toLocaleString();

    updateProgress(
      100,
      "All Data Loaded Successfully ✔",
      "#16a34a"  // GREEN
    );

  } catch (error) {
    updateProgress(
      100,
      "Error loading data ❌",
      "#dc2626" // RED
    );
    console.error(error);
  }
}

refreshBtn.addEventListener("click", () => {
  updateProgress(0, "Refreshing...");
  loadAllSheets();
});

loadAllSheets();
