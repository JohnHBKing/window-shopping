document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("submit-symbols")
    .addEventListener("click", function () {
      const symbols = Array.from(
        document.getElementsByClassName("currency-symbols")
      )
        .filter((el) => el.checked)
        .map((el) => el.id);
      chrome.storage.local.set({ currencySymbols: symbols });
      console.log("Symbols saved:", symbols);
    });
});
