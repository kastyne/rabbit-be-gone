
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
const getExtensionContext = callback => {

    chrome.storage.local.get().then(localStorage => {
    chrome.storage.sync.get().then(syncStorage => {
		let model = {
		    options: [
		        { name: 'cutoffMode', preset: "pageCount", area: 'sync' },
		        { name: 'filterMode', preset: "blacklist", area: 'sync' }
		    ],
		    lists: [
		        { name: 'distractionScores', preset: distractionScoresPreset, area: 'sync' },
		        { name: 'allowedUrls', preset: allowedUrlsPreset, area: 'sync' },
		        { name: 'allowedKeywords', preset: allowedKeywordsPreset, area: 'sync' },
		        { name: 'historyList', preset: [], area: 'local' },
		        { name: 'exceptionList', preset: [], area: 'local' }
		    ]
		}
		
        let context = {
        	lists: model.lists.map(f => f.name),
        	options: model.options.map(f => f.name),
        	fieldToArea: {},
        	
        	
        	setField(fieldName, item) {
        		chrome.storage[this.fieldToArea[fieldName]].set(item)
        	},
        	
            add(arrayName, item) {
                if (notIn(arrayName, this.lists)) return false
                
                this[arrayName].push(item)
                this.setField(arrayName, {[arrayName]: this[arrayName]})
            },

            remove(arrayName, item) {
                if (notIn(arrayName, this.lists)) return false

                let index = this[arrayName].indexOf(item)
                if (index > -1) {
                    this[arrayName].splice(index, 1)
                }
                this.setField(arrayName, {[arrayName]: this[arrayName]})
            },

            changeMode(mode, value) {
                if (notIn(mode, this.options)) return false

                this[mode] = value
                this.setField(arrayName, {mode: value})
            },

            inject(object) {
                object.context = this
                object.historyList = this.historyList
                object.allowedKeywords = this.allowedKeywords
                object.allowedUrls = this.allowedUrls

            }
        };

		[...model.options, ...model.lists].forEach(field => {
			let area = field.area == 'sync' ? syncStorage : localStorage
		
			context.fieldToArea[field.name] = field.area 
			context[field.name] = area[field.name] ?? field.preset
		})

        
        callback(context)
    })})
}
