console.log('Content script loaded');

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes) {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          const tweetTextElement = node.querySelector('div[data-testid="tweetText"]');
          if (tweetTextElement) {
            const tweetText = tweetTextElement.innerText;
            console.log('Tweet detected:', tweetText);  // Message de débogage
            chrome.runtime.sendMessage({ action: 'addTweet', tweet: tweetText });
          }
        }
      });
    }
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
