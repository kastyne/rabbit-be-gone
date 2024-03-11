const pageToScore = (historyItem, distractionScores) => {
    let score = 0
    distractionScores.forEach(distraction => {
        if (historyItem.url.includes(distraction.string)) score += distraction.score 
        else if (historyItem.title.includes(distraction.string)) score += distraction.score
    })

    return score

}

const blockPage = (currentScore) => {
    let body = document.createElement('body')
    body.innerText = `test ${currentScore}`
    document.body = body
}

const presetScores = [
    {"string": "wikipedia", "score": 25},
    {"string": "tvtropes", "score": 50},
    {"string": "xkcd", "score": 50},

    {"string": "spacebattles", "score": 100},
    {"string": "sufficientvelocity", "score": 100},
    {"string": "archiveofourown", "score": 100},
]


// TODO?: write small wrapper around the storage apis cuz they are a pain
chrome.storage.local.get().then(localStorage => {
chrome.storage.sync.get().then(syncStorage => {
    let distractionScores = syncStorage.distractionScores ? syncStorage.distractionScores : presetScores
    let historyList = localStorage.historyList ? localStorage.historyList : []

    let currentPage = {
        'url': String(window.location),
        'title': document.title
    }

    let currentScore = pageToScore(currentPage, distractionScores)
    historyList.push(currentPage)
    
    chrome.storage.local.set({'historyList': historyList})

    let accumulatedScore = historyList.slice(-5).reduce((score, historyItem) => score += pageToScore(historyItem, distractionScores), 0)

    if(currentScore > 0 && accumulatedScore >= 100) {
       blockPage(currentScore) // mby just pass in some storage context thing in future?
    }
})})