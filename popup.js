const quoteDisplay = document.getElementById('quote');
const saveButton = document.getElementById('save');
const copyButton = document.getElementById('copy');
const shareButton = document.getElementById('share');

// Function to fetch a random quote from Quotable API, with ZenQuotes as fallback
async function fetchQuote() {
  try {
    // Try to fetch from Quotable API
    const response = await fetch("https://api.quotable.io/random");
    if (!response.ok) {
      throw new Error(`Quotable API error! Status: ${response.status}`);
    }
    const data = await response.json();
    const quote = `"${data.content}" — ${data.author}`;
    quoteDisplay.textContent = quote;
  } catch (error) {
    console.error("Error fetching from Quotable:", error);

    // If Quotable fails, fallback to ZenQuotes API
    try {
      const response = await fetch("https://zenquotes.io/api/random");
      if (!response.ok) {
        throw new Error(`ZenQuotes API error! Status: ${response.status}`);
      }
      const data = await response.json();
      const quote = `"${data[0].q}" — ${data[0].a}`;
      quoteDisplay.textContent = quote;
    } catch (error) {
      quoteDisplay.textContent = "Failed to fetch a quote. Please try again.";
      console.error("Error fetching from ZenQuotes:", error);
    }
  }
}

// Copy quote to clipboard
copyButton.addEventListener('click', () => {
  navigator.clipboard.writeText(quoteDisplay.textContent)
    .then(() => alert('Quote copied to clipboard!'))
    .catch((error) => console.error("Error copying quote:", error));
});

// Share quote using Web Share API
shareButton.addEventListener('click', () => {
  if (navigator.share) {
    navigator.share({
      text: quoteDisplay.textContent
    }).catch(error => console.error("Error sharing quote:", error));
  } else {
    alert("Sharing not supported on this device.");
  }
});

// Save quote to local storage
saveButton.addEventListener('click', () => {
  chrome.storage.local.get({ savedQuotes: [] }, (result) => {
    const quotes = result.savedQuotes;
    quotes.push(quoteDisplay.textContent);
    chrome.storage.local.set({ savedQuotes: quotes }, () => {
      alert('Quote saved!');
    });
  });
});

// Fetch a quote on popup load
fetchQuote();
