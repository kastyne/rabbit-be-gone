let distractionScores = [
    {"string": "wikipedia", "score": 25},
    {"string": "tvtropes", "score": 50},
    {"string": "xkcd", "score": 50},

    {"string": "spacebattles", "score": 100},
    {"string": "sufficient velocity", "score": 100},
    {"string": "archiveofourown", "score": 100},


]
document.body.style.backgroundColor = "red"
console.log("Test")

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

    historyItems.forEach(item => score += calcScore(item))
    console.log(score)
    return score
}

let warningScreen = document.createElement("h1")
warningScreen.innerText = "TOO DISTRACTED"
calcScore().then(score =>{
    if (score >= 100) {
        document.body = warningScreen
    }

})
