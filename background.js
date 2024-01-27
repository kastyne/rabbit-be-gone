let distractionScores = [
    {"string": "wikipedia", "score": 25},
    {"string": "tvtropes", "score": 50},
    {"string": "xkcd", "score": 50},

    {"string": "spacebattles", "score": 100},
    {"string": "sufficientvelocity", "score": 100},
    {"string": "archiveofourown", "score": 100},
]

chrome.storage.local.set({distractionScores})


const urlToScore = historyItem => {
    let score = 0
    distractionScores.forEach(distraction => {
        if (historyItem.url.includes(distraction.string)) score += distraction.score 
        else if (historyItem.title && historyItem.title.includes(distraction.string)) score += distraction.score
    })
    historyItem.score = score
    return score
}

const calcScore = async () => {
    let score = 0
    historyItems = await chrome.history.search({
        text: "",
        maxResults: 5
   })

    historyItems.forEach(item => score += urlToScore(item))
    chrome.storage.local.set({score, historyItems})
    
}

chrome.history.onTitleChanged.addListener(calcScore)
calcScore()