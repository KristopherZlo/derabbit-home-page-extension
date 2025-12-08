console.log("Background script loaded");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Background received message:", request);
  if (request.action === "getHistory") {
    chrome.history.search({ text: '', maxResults: 20, startTime: 0 }, (results) => {
      console.log("History results:", results);
      sendResponse({ results });
    });
    return true;
  }
});
