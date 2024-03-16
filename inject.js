let pageToScore = (historyItem, distractionScores) => {
        let score = 0
        distractionScores.forEach(distraction => {
            if (historyItem.url.includes(distraction.string)) score += distraction.score 
            else if (historyItem.title.includes(distraction.string)) score += distraction.score
        })
    
        return score
    }

let scoreReducer = (score, historyItem) => score += pageToScore(historyItem, config.distractionScores),
    timeCuttof = (historyItem) => currentPage.time - 18*(10^5) <= historyItem.time // 30 minnute time cuttof

const blacklistMode = (context, currentPage) => {
    let currentScore = pageToScore(currentPage, context.distractionScores)

    if (context.cuttoffMode = "pageCount") accumulatedScore = historyList.slice(-5).reduce(scoreReducer, 0)
    else if (context.cuttoffMode = "time") accumulatedScore = historyList.filter(timeCuttof).reduce(scoreReducer, 0)

    if(currentScore > 0 && accumulatedScore >= 100) {
       return true
    }

}

const whitelistMode = (context, currentPage) = {
    
}

const blockPage = (currentScore) => {
    let body = document.createElement('body')
    body.innerText = `test ${currentScore}`
    document.body = body
}

const presetDistractionScores = [
    {"string": "wikipedia", "score": 25},
    {"string": "tvtropes", "score": 50},
    {"string": "xkcd", "score": 50},

    {"string": "spacebattles", "score": 100},
    {"string": "sufficientvelocity", "score": 100},
    {"string": "archiveofourown", "score": 100},
]


// extention storage apis cuz they are a pain
chrome.storage.local.get().then(localStorage => {
chrome.storage.sync.get().then(syncStorage => {

    // a buncha turnaries to check if any default settings have been changed
    // todo come up w/ better way to fix it
    // todo also ome up w/ verification checks
    let context = {
        distractionScores: syncStorage.distractionScores ? syncStorage.distractionScores : presetDistractionScores,
        cuttoffMode: syncStorage.cuttoffMode ? syncStorage.cuttoffMode : "pageCount",
        filterMode: syncStorage.filterMode ? syncStorage.filterMode : "blacklist",

        historyList: localStorage.historyList ? localStorage.historyList : [],
    }

    let currentPage = {
        'url': String(window.location),
        'title': document.title,
        'time': Date.now(),
    }

    // add current page to history list
    context.historyList.push(currentPage)
    chrome.storage.local.set({'historyList': context.historyList})

    if (context.filterMode = "blacklist") blacklistMode(context, currentPage)
    else if (context.filterMode = "whitelist") whitelistMode(context, currentPage)
})})