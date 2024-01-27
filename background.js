let distractionScores = [
    {"string": "wikipedia", "score": 25},
    {"string": "tvtropes", "score": 50},
    {"string": "xkcd", "score": 50},

    {"string": "spacebattles", "score": 100},
    {"string": "sufficientvelocity", "score": 100},
    {"string": "archiveofourown", "score": 100},
]

// Storage handler for synced Chrome extension data
// Init'ing storage should probably go in another file
const STORAGE = chrome.storage.sync;
STORAGE.set({distractionScores}, function() {});
STORAGE.set({"sessionScore": 0}, function() {});

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
async function initListener() {
    let distractions = await STORAGE.get(['distractionScores']);
    distractions = distractions.distractionScores; // Insert eye roll

    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        if (!changeInfo.url) { // Only fire if url has updated
            return;
        }
        
        const score = checkForDistraction(changeInfo.url, distractions);

        if (score) {
            // Need a new function to increment the sessionScore
        }
        
    })
};
initListener();


function checkForDistraction(url, distractions) {
    for (let d of distractions) {
        if (!url.includes(d.string)) {
            continue;
        }

        console.log("You visited " + url + " / " + d.score);
        return d.score;
    }

    return;
}

// browser.history.onVisited.addListener(calcScore)