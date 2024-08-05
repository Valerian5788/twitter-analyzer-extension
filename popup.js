// popup.js
document.getElementById('analyzeButton').addEventListener('click', () => {
    chrome.storage.local.get('analysis', (result) => {
        if (result.analysis) {
            displayResults(result.analysis);
        }
    });
});

function displayResults(data) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    for (const [category, count] of Object.entries(data)) {
        const p = document.createElement('p');
        p.textContent = `${category}: ${count}%`;
        resultsDiv.appendChild(p);
    }
}
