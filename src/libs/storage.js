
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
                if (this[arrayName].indexOf(item) > 0) return false
                
                this[arrayName].push(item)
                console.log(JSON.stringify(this[arrayName]))
                this.setField(arrayName, {[arrayName]: this[arrayName]})
            },

            remove(arrayName, index) {
                if (notIn(arrayName, this.lists)) return false

                this[arrayName].splice(index, 1)
				console.log(JSON.stringify(this[arrayName])) //proxies! yay
                this.setField(arrayName, {[arrayName]: this[arrayName]})
            },

            changeMode(mode, value) {
                if (notIn(mode, this.options)) return false

                this[mode] = value
                this.setField(arrayName, {mode: value})
            },

            inject(object) {
                object.context = this;
                [...model.options, ...model.lists].forEach(field => object[field.name] = context[field.name])
                
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
