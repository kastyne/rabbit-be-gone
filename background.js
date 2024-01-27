let distractionScores = [
    {"string": "wikipedia", "score": 25},
    {"string": "tvtropes", "score": 50},
    {"string": "xkcd", "score": 50},

    {"string": "spacebattles", "score": 100},
    {"string": "sufficient velocity", "score": 100},
    {"string": "archiveofourown", "score": 100},
]

// Storage handler for synced Chrome extension data
const STORAGE = chrome.storage.sync;
STORAGE.set({"distractionScores": distractionScores}, function() {});

// Pending deletion?
const urlToScore = historyItem => {
    let score = 0
    distractionScores.forEach(distraction => {
        if (historyItem.url.includes(distraction.string)) score += distraction.score 
        else if (historyItem.title.includes(distraction.string)) score += distraction.score
    })

    return score;
}

// Primary listener for url updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (!changeInfo.url) { // Only fire if url has updated
        return;
    }

    console.log(changeInfo.url);
    STORAGE.get(['distractionScores']).then((result)=>{
        console.log(result)
    });
});


const calcScore = async () => {
    let score = 0
    historyItems = await browser.history.search({
        text: "",
        maxResults: 5
   })

    historyItems.forEach(item => score += urlToScore(item))
    STORAGE.set({"score": score}, function() {});
}

// browser.history.onVisited.addListener(calcScore)