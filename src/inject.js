let pageToScore = (historyItem, distractionScores) => {
    let score = 0
    distractionScores.forEach(distraction => {
        if (historyItem.url.includes(distraction.string)) score += distraction.score 
        else if (historyItem.title.includes(distraction.string)) score += distraction.score
    })

    return score
}


const blacklistMode = (context, currentPage) => {
    let scoreReducer = (score, historyItem) => score += pageToScore(historyItem, context.distractionScores),
    timeCuttof = (historyItem) => currentPage.time - 18*(10^5) <= historyItem.time // 30 minnute time cuttof

    let currentScore = pageToScore(currentPage, context.distractionScores)

    if (context.cutoffMode = "pageCount") accumulatedScore = context.historyList.slice(-5).reduce(scoreReducer, 0)
    else if (context.cutoffMode = "time") accumulatedScore = context.historyList.filter(timeCuttof).reduce(scoreReducer, 0)

    if(currentScore > 0 && accumulatedScore >= 100) {
       blockPage(currentPage)
    }
}


const whitelistMode = (context, currentPage) => {
    for (url of context.allowedUrls) {
        if (currentPage.url.includes(url)) return true
    }

    for (keyword of context.allowedKeywords) {
        if (currentPage.url.includes(keyword)) return true
        else if (currentPage.title.includes(keyword)) return true
    }

    blockPage(currentPage);
}


const blockPage = (currentPage) => {
    window.location = chrome.runtime.getURL("blockpage/index.html") + "#" + JSON.stringify(currentPage)
}

getExtentionContext(context => {
    let currentPage = {
        'url': String(window.location),
        'title': document.title,
        'time': Date.now(),
    }
    context.historyPush(currentPage);

    if (context.filterMode === "blacklist") blacklistMode(context, currentPage);
    else if (context.filterMode === "whitelist") whitelistMode(context, currentPage);
})