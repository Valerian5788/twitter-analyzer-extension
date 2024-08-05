// content.js
let tweets = [];

function isTextTweet(tweetElement) {
    // Vérifier s'il y a des images ou des vidéos
    let media = tweetElement.querySelector('img, video');
    return !media;
}

document.addEventListener('scroll', function() {
    let tweetElements = document.querySelectorAll('article');
    tweetElements.forEach(tweetElement => {
        let tweetText = tweetElement.innerText;
        if (!tweets.includes(tweetText) && isTextTweet(tweetElement)) {
            tweets.push(tweetText);
        }
    });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getTweets") {
        sendResponse({ tweets: tweets });
    }
});
