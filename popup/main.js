const historyList = document.getElementById("historyList")
let distractionScores = [
    {"string": "wikipedia", "score": 25},
    {"string": "tvtropes", "score": 50},
    {"string": "xkcd", "score": 50},

    {"string": "spacebattles", "score": 100},
    {"string": "sufficient velocity", "score": 100},
    {"string": "archiveofourown", "score": 100},


]

const calcScore = historyItem => {
    let score = 0
    distractionScores.forEach(distraction => {
        if (historyItem.url.includes(distraction.string)) score += distraction.score 
        else if (historyItem.title.includes(distraction.string)) score += distraction.score
    })

    return score
}

browser.history
    .search({
        text: "",
        maxResults: 5
    })
    .then(historyItems => {
        historyItems.forEach(item => {
          
        let itemElement = document.createElement('li')
        itemElement.innerText = item.title + " --" + calcScore(item)
        historyList.appendChild(itemElement)  
        })
    })