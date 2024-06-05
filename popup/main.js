document.addEventListener('alpine:init', () => {
    Alpine.data('model', () => ({

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


        deleteItem(event) {
            if (!this.context) {
                return;
            }

            const collections = {
                wkw: this.context.allowedKeywords,
                wurl: this.context.allowedUrls,
            }

            this.msg = event.target.getAttribute('data-collection')
            const collection = collections[event.target.getAttribute('data-collection')];
            for (let key in collection) {
                if (collection[key] === event.target.value) {
                    delete collection[key];
                }
            }

            chrome.storage.local.set({'context': this.context});
        },
        

        init() {
            chrome.storage.local.get().then(localStorage => {
                this.context = localStorage.context;
                if (this.context) {
                    this.historyList = this.context.historyList;
                    this.allowedKeywords = this.context.allowedKeywords
                    this.allowedUrls = this.context.allowedUrls
                }
            })
            
            // Initialise in-storage variables to avoid CSP errors
            this.context = null;
            this.historyList = null;
            this.allowedKeywords = []
            this.allowedUrls = []

            const manifest = chrome.runtime.getManifest()
            this.name = manifest.name
            this.version = manifest.version
            this.homePage = "currPage"
            this.listPage = "hidden"
            this.settingsPage = "hidden"
            this.aboutPage = "hidden"
        }
    }))
})
