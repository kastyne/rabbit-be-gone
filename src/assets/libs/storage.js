
const distractionScoresPreset = [
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

const notIn = (item, array) => {
    return (array.indexOf(item) == -1)
}

// extention storage apis cuz they are a pain
const getExtentionContext = callback => {

    chrome.storage.local.get().then(localStorage => {
    chrome.storage.sync.get().then(syncStorage => {
        let context = {
            distractionScores: syncStorage.distractionScores ? syncStorage.distractionScores : distractionScoresPreset,
    
            allowedUrls: syncStorage.allowedUrls ?? allowedUrlsPreset,
            allowedKeywords: syncStorage.allowedKeywords ?? allowedKeywordsPreset,
    
            cutoffMode: syncStorage.cutoffMode ? syncStorage.cutoffMode : "pageCount",
            filterMode: syncStorage.filterMode ? syncStorage.filterMode : "blacklist",
            historyList: localStorage.historyList ? localStorage.historyList : [],

            historyPush(page) {
                this.historyList.push(page)
                chrome.storage.local.set({'historyList': this.historyList})
            },

            add(arrayName, item) {
                if (notIn(arrayName, ['distractionScores', 'allowedUrls', 'allowedKeywords'])) return false
                
                this[arrayName].push(item)
                chrome.storage.sync.set({[arrayName]: this[arrayName]})
            },

            remove(arrayName, item) {
                if (notIn(arrayName, ['distractionScores', 'allowedUrls', 'allowedKeywords'])) return false

                let index = this[arrayName].indexOf(item)
                if (index > -1) {
                    this[arrayName].splice(index, 1)
                }
                chrome.storage.sync.set({[arrayName]: this[arrayName]})
            },

            changeMode(mode, value) {
                if (notIn(mode, ['cuttofMode', 'filterMode'])) return false

                this[mode] = value
                chrome.storage.sync.set({mode: value})
            },

            inject(object) {   
                object.context = this;
                object.historyList = this.historyList;
                object.allowedKeywords = this.allowedKeywords;
                object.allowedUrls = this.allowedUrls

            }
        }
        callback(context)
    })})
}