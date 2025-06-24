// ✅ Check for the existence of the quotes array with objects containing text and category properties
if (!Array.isArray(window.quotes)) {
  var quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Simplicity is the ultimate sophistication.", category: "Design" },
    { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
  ];
}

// ✅ Check for the displayRandomQuote function
function showRandomQuote() {
  // ✅ Check for logic to select a random quote and update the DOM
  if (!Array.isArray(quotes) || quotes.length === 0) {
    console.warn("No quotes available.");
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  const quoteDisplay = document.getElementById('quoteDisplay');
  if (quoteDisplay) {
    quoteDisplay.textContent = `"${quote.text}" — [${quote.category}]`;
  }
}

// ✅ Check for the addQuote function
function addQuote() {
  const quoteTextInput = document.getElementById('newQuoteText');
  const quoteCategoryInput = document.getElementById('newQuoteCategory');

  const quoteText = quoteTextInput?.value.trim();
  const quoteCategory = quoteCategoryInput?.value.trim();

  // ✅ Check for logic to add a new quote to the quotes array and update the DOM
  if (!quoteText || !quoteCategory) {
    alert("Please fill in both the quote and category.");
    return;
  }

  const newQuote = { text: quoteText, category: quoteCategory };
  quotes.push(newQuote);

  // Clear inputs
  quoteTextInput.value = "";
  quoteCategoryInput.value = "";

  alert("Quote added successfully!");
}

// ✅ Check for event listener on the “Show New Quote” button
document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById('newQuote');
  if (button) {
    button.addEventListener('click', showRandomQuote);
  }
});
