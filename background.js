// overall structure:
// 1. listen for tab updates
// 2. parse the html for currency symbols
// 3. remove any currancy amounts following the symbol
// 4. replace the price with nothing

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    // wait until the tab if fully loaded
    console.log("Tab update complete:", tabId); // debug
    const origin = await getHTML(tab); // fetch the HTML of the page
    const [symbols] = await getSymbols(); // get the symbols from storage
    const WSHtml = WSifyHTML(origin, symbols); // process the HTML to remove prices
    if (!WSHtml) {
      console.error("WSifyHTML returned undefined or null");
      return;
    }
    // now we need to send the data to a content script.....
    chrome.tabs.sendMessage(tab.id, {
      type: "Send-WS-HTML",
      data: WSHtml,
    });
    console.log("Sent Window Shopping HTML:", WSHtml);
  }
});

getHTML = (tab) => {
  chrome.scripting.executeScript({
    target: { tabId: currentTab.id },
    // get the HTML of the page
    func: () => {
      // Get the HTML of the page
      console.log("Getting HTML...");
      html = document.documentElement.innerHTML;
      // Return the HTML
      console.log("HTML retrieved.");
      return html;
    },
  });
};

WSifyHTML = (html, symbols) => {
  // create a regex pattern to match currency symbols followed by amounts
  const pattern = new RegExp(
    `(${symbols.join("|")})\\s*\\d+(\\.\\d{1,2})?`,
    "g"
  );
  // replace the matched patterns with an empty string
  const WSHtml = html.replace(pattern, "");
};

getSymbols = () => {
  chrome.storage.local.get(["currencySymbols"], (result) => {
    if (chrome.runtime.lastError) {
      console.error("Error retrieving symbols:", chrome.runtime.lastError);
      return [];
    }
    console.log("Retrieved symbols:", result.currencySymbols);
    return result.currencySymbols || [];
  });
};
