console.log('Background script loaded');

let tweetQueue = [];
let isProcessingQueue = false;

// Function to process the tweet queue
function processTweetQueue() {
  if (isProcessingQueue || tweetQueue.length === 0) {
    return;
  }

  isProcessingQueue = true;
  const tweet = tweetQueue.shift();

  chrome.storage.local.get({ tweets: [] }, (result) => {
    const tweets = result.tweets || [];
    console.log('Current tweets in storage before adding:', tweets); // Debugging
    const isTweetPresent = tweets.some(t => t === tweet);

    if (!isTweetPresent) {
      tweets.push(tweet);
      chrome.storage.local.set({ tweets: tweets }, () => {
        console.log('Tweet added to storage:', tweet);
        chrome.storage.local.get(['tweets'], (result) => {
          console.log('Tweets in storage after adding:', result.tweets); // Debugging
        });
        isProcessingQueue = false;
        processTweetQueue(); // Process the next tweet in the queue
      });
    } else {
      console.log('Tweet already in storage:', tweet);
      isProcessingQueue = false;
      processTweetQueue(); // Process the next tweet in the queue
    }
  });
}

// Function to add a tweet to the queue
function addTweet(tweet) {
  tweetQueue.push(tweet);
  processTweetQueue();
}

// Function to get stored tweets
function getTweets(callback) {
  chrome.storage.local.get(['tweets'], (result) => {
    console.log('Result from chrome.storage.local.get:', result); // Debugging
    const tweets = result.tweets || [];
    console.log('Retrieved tweets from storage:', tweets); // Debugging
    callback(tweets);
  });
}

// Function to analyze tweets
async function analyzeTweets(callback) {
  getTweets(async (tweets) => {
    try {
      const response = await fetch('https://localhost:7295/api/Tweets/classify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tweets: tweets })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Analysis result:', result);
      callback(result);
    } catch (error) {
      console.error('Error analyzing tweets:', error);
    }
  });
}

// Combined message listener
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getTweetCount') {
    getTweets((tweets) => {
      sendResponse({ count: tweets.length, tweets: tweets });
    });
    return true;  // Indicate that the response is asynchronous
  }

  if (message.action === 'analyzeTweets') {
    analyzeTweets((result) => {
      sendResponse({ result: result });
    });
    return true;  // Indicate that the response is asynchronous
  }

  if (message.action === 'addTweet') {
    console.log('Adding tweet from content script:', message.tweet);
    addTweet(message.tweet);
  }

  if (message.action === 'clearStorage') {
    chrome.storage.local.clear(() => {
      console.log('Storage cleared');
      sendResponse();
    });
    return true;  // Indicate that the response is asynchronous
  }
});