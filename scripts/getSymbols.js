document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("submit-symbols")
    .addEventListener("click", function () {
      const symbolsInput = document
        .getElementsByClassName("currency-symbols")
        .join(",");
      const symbols = symbolsInput.value.split(",").map((s) => s.trim());
      chrome.storage.local.set({ currencySymbols: symbols }),
        console.log("Symbols saved:", symbols);
    });
});
