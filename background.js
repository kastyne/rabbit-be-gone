let distractionScores = [
    {"string": "wikipedia", "score": 25},
    {"string": "tvtropes", "score": 50},
    {"string": "xkcd", "score": 50},

    {"string": "spacebattles", "score": 100},
    {"string": "sufficient velocity", "score": 100},
    {"string": "archiveofourown", "score": 100},


]
localStorage.distractionScores = distractionScores


const urlToScore = historyItem => {
    let score = 0
    distractionScores.forEach(distraction => {
        if (historyItem.url.includes(distraction.string)) score += distraction.score 
        else if (historyItem.title.includes(distraction.string)) score += distraction.score
    })

    return score
}

const calcScore = async () => {
    let score = 0
    historyItems = await browser.history.search({
        text: "",
        maxResults: 5
   })

    historyItems.forEach(item => score += urlToScore(item))
    localStorage.score = score
    
}

browser.history.onVisited.addListener(calcScore)