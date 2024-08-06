// Fonction pour ajouter un tweet vu
function addTweet(tweet) {
    chrome.storage.local.get({ tweets: [] }, (result) => {
      const tweets = result.tweets;
      if (!tweets.includes(tweet)) {
        tweets.push(tweet);
        chrome.storage.local.set({ tweets: tweets }, () => {
          console.log('Tweet added:', tweet);  // Message de débogage
        });
      }
    });
  }
  
  // Fonction pour récupérer les tweets stockés
  function getTweets(callback) {
    chrome.storage.local.get(['tweets'], (result) => {
      const tweets = result.tweets || [];
      console.log('Retrieved tweets:', tweets);  // Message de débogage
      callback(tweets);
    });
  }
  
  // Fonction pour analyser les tweets
  async function analyzeTweets(callback) {
    getTweets(async (tweets) => {
      const response = await fetch('http://localhost:5001/classify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tweets: tweets })
      });
  
      const result = await response.json();
      console.log('Analysis result:', result);  // Message de débogage
      callback(result);
    });
  }
  
  // Listener pour les messages du popup
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getTweetCount') {
      getTweets((tweets) => {
        sendResponse({ count: tweets.length, tweets: tweets });
      });
      return true;  // Indiquer que la réponse est asynchrone
    }
  
    if (message.action === 'analyzeTweets') {
      analyzeTweets((result) => {
        sendResponse({ result: result });
      });
      return true;  // Indiquer que la réponse est asynchrone
    }
  });
  