// script.js
let quotes = [];
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");
const LOCAL_STORAGE_KEY = "quotes";
const SESSION_STORAGE_KEY = "lastViewedQuote";
const CATEGORY_STORAGE_KEY = "selectedCategory";
const SYNC_INTERVAL_MS = 30000;
const SERVER_URL = "https://mocki.io/v1/4e1a6541-3c8f-4306-8dfc-248df7e79cb5";

function saveQuotes() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(quotes));
}

function loadQuotes() {
  const storedQuotes = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (storedQuotes) quotes = JSON.parse(storedQuotes);
}

function showRandomQuote() {
  const filtered = getFilteredQuotes();
  if (filtered.length === 0) return (quoteDisplay.textContent = "No quotes available.");
  const quote = filtered[Math.floor(Math.random() * filtered.length)];
  quoteDisplay.textContent = `${quote.text} - ${quote.category}`;
  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(quote));
}

function addQuote() {
  const text = document.getElementById("newQuoteText").value;
  const category = document.getElementById("newQuoteCategory").value;
  if (!text || !category) return alert("Both fields required");
  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  filterQuotes();
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categoryFilter.appendChild(opt);
  });
  const savedCategory = localStorage.getItem(CATEGORY_STORAGE_KEY);
  if (savedCategory) {
    categoryFilter.value = savedCategory;
    filterQuotes();
  }
}

function getFilteredQuotes() {
  const category = categoryFilter.value;
  if (category === "all") return quotes;
  return quotes.filter(q => q.category === category);
}

function filterQuotes() {
  localStorage.setItem(CATEGORY_STORAGE_KEY, categoryFilter.value);
  showRandomQuote();
}

function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    const importedQuotes = JSON.parse(e.target.result);
    importedQuotes.forEach(q => {
      if (!quotes.some(local => local.text === q.text && local.category === q.category)) {
        quotes.push(q);
      }
    });
    saveQuotes();
    populateCategories();
    filterQuotes();
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

function syncWithServer() {
  fetch(SERVER_URL)
    .then(res => res.json())
    .then(serverQuotes => {
      let newQuotesAdded = 0;
      serverQuotes.forEach(serverQuote => {
        const exists = quotes.some(localQuote =>
          localQuote.text === serverQuote.text &&
          localQuote.category === serverQuote.category
        );
        if (!exists) {
          quotes.push(serverQuote);
          newQuotesAdded++;
        }
      });
      if (newQuotesAdded > 0) {
        saveQuotes();
        populateCategories();
        filterQuotes();
        showSyncStatus(`${newQuotesAdded} new quote(s) synced from server.`);
      } else {
        showSyncStatus("No new quotes found on server.");
      }
    })
    .catch(err => {
      console.error("Sync failed:", err);
      showSyncStatus("Failed to sync with server.", true);
    });
}

function showSyncStatus(message, isError = false) {
  const statusDiv = document.getElementById("syncStatus");
  statusDiv.style.color = isError ? "red" : "green";
  statusDiv.textContent = message;
  setTimeout(() => (statusDiv.textContent = ""), 5000);
}

// Event Listeners
newQuoteBtn.addEventListener("click", showRandomQuote);

// Initialization
loadQuotes();
populateCategories();
filterQuotes();

// Auto sync every 30 seconds
setInterval(syncWithServer, SYNC_INTERVAL_MS);
