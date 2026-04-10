document.addEventListener('alpine:init', () => {
    Alpine.data('model', () => ({
        init() { getExtensionContext(context =>{
            // Initialise in-storage variables to avoid CSP errors
			context.inject(this)
            this.pageContext = JSON.parse(atob(decodeURI(window.location.hash).substring(1)))
            this.title = this.pageContext.title
            
        })},

		getBlockers() {
		    return this.context.distractionScores.filter(distraction => {
				return (this.pageContext.url.includes(distraction.string) || this.pageContext.title.includes(distraction.string))
			})
			
		},
        
        addException(e) {
        	let time = parseInt(new FormData(e.target).get('time'));
        	this.getBlockers().forEach(b => this.context.add('exceptionList', {string: b.string, expiry: Date.now() + time}));
			console.log(this.getBlockers(), this.context.exceptionList, time)
        	history.back();
        }
    }))
})
