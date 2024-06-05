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
       blockPage(currentScore)
    }

}


const isInWhitelist = (allowedKeywords, allowedUrls, page) => {
    // TODO: fancy tracking statistics for rule-break
    if (allowedKeywords.indexOf(page.url) > -1 || allowedKeywords.indexOf(page.title) > -1) {
        return true;
    }

    // Not a good way to check urls, check domain in the future?
    if (allowedUrls.indexOf(page.url) > -1) {
        return true;
    }

    return false;
}


/**
 * A "white mode" enforcer - only allow visiting urls specified
 * 
 * @param context: browser storage
 * @param currentPage: updated page payload
 */
const whitelistMode = (context, currentPage) => {
    const isAllowed = isInWhitelist(context.allowedKeywords, context.allowedUrls, currentPage);
    if (!isAllowed) {
        blockPage(0);
    }
}

const blockPage = (currentScore) => {
    let body = document.createElement('body')
    body.innerText = `YOU FAILED! ${currentScore}`
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

const allowedUrlsPreset = [
    "https://www.google.com/",
    "https://www.khanacademy.org/"
]

const allowedKeywordsPreset = [
    "learn",
    "library",
    "math",
    "science",
]


// extention storage apis cuz they are a pain
chrome.storage.local.get().then(localStorage => {
chrome.storage.sync.get().then(syncStorage => {

    // a buncha turnaries to check if any default settings have been changed
    // todo come up w/ better way to fix it
    // todo also ome up w/ verification checks
    let context = {
        distractionScores: syncStorage.distractionScores ? syncStorage.distractionScores : presetDistractionScores,

        allowedUrls: syncStorage.allowedUrls ?? allowedUrlsPreset,
        allowedKeywords: syncStorage.allowedKeywords ?? allowedKeywordsPreset,

        cutoffMode: syncStorage.cutoffMode ? syncStorage.cutoffMode : "pageCount",
        filterMode: syncStorage.filterMode ? syncStorage.filterMode : "blacklist",
        historyList: localStorage.historyList ? localStorage.historyList : [],
    }

    // Payload for all tab update data
    let currentPage = {
        'url': String(window.location),
        'title': document.title,
        'time': Date.now(),
    }
    
    // add current page to history list
    context.historyList.push(currentPage);
    chrome.storage.local.set({'context': context});


    if (context.filterMode === "blacklist") blacklistMode(context, currentPage);
    else if (context.filterMode === "whitelist") whitelistMode(context, currentPage);
})})