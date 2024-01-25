let distractionScores = localStorage.distractionScores

const urlToScore = historyItem => {
    let score = 0
    distractionScores.forEach(distraction => {
        if (historyItem.url.includes(distraction.string)) score += distraction.score 
        else if (historyItem.title.includes(distraction.string)) score += distraction.score
    })

    return score
}

let warningScreen = document.createElement("h1")
warningScreen.innerText = "TOO DISTRACTED"

let currScore = urlToScore({
    'url': window.location,
    'title': document.title
})


console.log(localStorage.score)
if(currScore > 0 && localStorage.score >= 100) {
    document.body = warningScreen
}