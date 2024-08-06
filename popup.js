document.getElementById('viewTweets').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'getTweetCount' }, (response) => {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `<p>Number of tweets seen: ${response.count}</p><p>Tweets:</p><ul>${response.tweets.map(tweet => `<li>${tweet}</li>`).join('')}</ul>`;
  });
});

document.getElementById('analyzeTweets').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'analyzeTweets' }, (response) => {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `<p>Analysis Result:</p><ul>${response.result.map((res, index) => `<li>Tweet ${index + 1}: ${res}</li>`).join('')}</ul>`;
  });
});

document.getElementById('clearStorage').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'clearStorage' }, () => {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '<p>Storage cleared.</p>';
  });
});