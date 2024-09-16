document.addEventListener('alpine:init', () => {
    Alpine.data('model', () => ({

        historyList: [],
        allowedKeywords: [],
        allowedUrls: [],

        name: '',
        version: '',
        
        // todo: move to pager module
        currentPage: "home",
        homePage: "currPage",
        listPage: "hidden",
        settingsPage: "hidden",
        aboutPage: "hidden",
        
        changePage(event) {
            this.currentPage = event.target.id

            this.homePage = this.currentPage == 'home' ? 'currPage' : 'hidden'
            this.listPage = this.currentPage == 'list' ? 'currPage' : 'hidden'
            this.settingsPage = this.currentPage == 'settings' ? 'currPage' : 'hidden'
            this.aboutPage = this.currentPage == 'about' ? 'currPage' : 'hidden'
        },


        deleteItem(event) {
            if (!this.context) return
            this.context.remove(event.target.getAttribute('data-collection'), event.target.value)
        },


        /**
         * Stores the value of an input field 
         */
        updateTemp(event) {
            this[event.target.getAttribute('data-collection')] = event.target.value;
        },
        
        addItem(event) {
            event.preventDefault()
            if (!this.context) return
            
            let item = (new FormData(event.target)).get('keyword')
            this.context.add(event.target.getAttribute('data-collection'), item)
        }, 


        init() {    getExtentionContext(context => {
            context.inject(this) // csp bypass 
            
            const manifest = chrome.runtime.getManifest()
            this.name = manifest.name
            this.version = manifest.version
        })}
    }))
})
