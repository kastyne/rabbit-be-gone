const historyList = document.getElementById("historyList")
const heading = document.getElementById('heading')

chrome.storage.local.get().then(localStorage => {
    heading.innerText = `Score: ${localStorage.score}`

    localStorage.historyItems.forEach(item => {
        let itemElement = document.createElement('li')
        itemElement.innerText = item.title + " --" + item.score
        historyList.appendChild(itemElement)  
    })
})