// alpine has to be initialized in this odd way to follow the CSP rules for extentions
document.addEventListener('alpine:init', () => { 
    Alpine.data('model', () => ({
        // Unfortunately programmatically getting manifest info requires background.js
        // Otherwise we could do browser.runtime.getManifest().version
        version: 0.1,
        currentPage: "home",
        score: 10,
        scoreTxt: `Score: ${this.score}`,
        history: [],
        changePage(event) {
            this.currentPage = event.target.id

            this.homePage = this.currentPage == 'home' ? 'currPage' : 'hidden' 
            this.listPage = this.currentPage == 'list' ? 'currPage' : 'hidden'
            this.settingsPage = this.currentPage == 'settings' ? 'currPage' : 'hidden'
            this.aboutPage = this.currentPage == 'about' ? 'currPage' : 'hidden'
        },

        // this is the only way i can get reactivity to work in CSP mode
        init() {
            this.homePage = "currPage"
            this.listPage = "hidden"
            this.settingsPage = "hidden"
            this.aboutPage = "hidden"
        }
    }))
})

/*
chrome.storage.local.get().then(localStorage => {
    heading.innerText = `Score: ${localStorage.score}`

    localStorage.historyItems.forEach(item => {
        let itemElement = document.createElement('lwi')
        itemElement.innerText = item.title + " --" + item.score
        historyList.appendChild(itemElement)  

    settingsForm.addEventListener('submit', () => {
        FormData(settingsForm).entries().forEach((entry) => {
            key, value = entry
            chrome.storage.sync.set([{
                key, value
            }])
        })
    })
})
*/