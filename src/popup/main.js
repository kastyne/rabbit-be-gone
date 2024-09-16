document.addEventListener('alpine:init', () => {
    Alpine.data('model', () => ({

        historyList: [],
        allowedKeywords: [],
        allowedUrls: [],

        name: '',
        version: '',
        
        deleteItem(event) {
            if (!this.context) return
            this.context.remove(event.target.getAttribute('data-collection'), event.target.value)
        },

        addItem(event) {
            event.preventDefault()
            if (!this.context) return
            
            let item = (new FormData(event.target)).get('keyword')
            this.context.add(event.target.getAttribute('data-collection'), item)
        }, 


        init() {    getExtentionContext(context => {
            context.inject(this) // csp bypass 

            pager.inject(this, 'Page',
                ['home', 'about', 'list', 'settings'], 'home')

            const manifest = chrome.runtime.getManifest()
            this.name = manifest.name
            this.version = manifest.version
        })}
    }))
})

const pager = {
    currentPage: "",
    pages: [],

    changePage(event) {
        this.currentPage = event.target.id
        this.pages.forEach(page => this.object[page + this.suffix] = this.currentPage == page ? 'currPage' : 'hidden')
    },

    inject(object, suffix, pageList, first = '') {

        this.pages = pageList
        this.currentPage = first

        object.currentPage = this.currentPage
        object.changePage = this.changePage.bind(this)

        this.object = object
        this.suffix = suffix

        this.changePage({target: {id: this.currentPage}}) //ew
    }
}
