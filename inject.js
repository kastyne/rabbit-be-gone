chrome.storage.local.get().then(localStorage => {
    let distractionScores = localStorage.distractionScores

    const urlToScore = historyItem => {
        let score = 0
        distractionScores.forEach(distraction => {
            if (historyItem.url.includes(distraction.string)) score += distraction.score 
            else if (historyItem.title.includes(distraction.string)) score += distraction.score
        })

        return score
    }

    let currScore = urlToScore({
        'url': String(window.location),
        'title': document.title
    })

    let body = document.createElement('body')
    body.innerText = "test"

    console.log(`bg score: ${localStorage.score} | pageScore: ${currScore}`)
    if(currScore > 0 && localStorage.score >= 100) {
        document.body = body
    }
})