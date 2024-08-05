// background.js
chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.sendMessage(tab.id, { action: "getTweets" }, (response) => {
        fetch('http://localhost:5000/api/classify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tweets: response.tweets })
        })
        .then(response => response.json())
        .then(data => {
            chrome.storage.local.set({ analysis: data });
        });
    });
});
