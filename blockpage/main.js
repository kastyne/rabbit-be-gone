document.addEventListener('alpine:init', () => {
    Alpine.data('model', () => ({
        init() {
            // Initialise in-storage variables to avoid CSP errors
            this.pageContext = JSON.parse(decodeURI(window.location.hash).substring(1))
            this.title = this.pageContext.currentPage.title

            chrome.storage.local.get().then(localStorage => {
                this.context = localStorage.context;
            })
            
            
        }
    }))
})