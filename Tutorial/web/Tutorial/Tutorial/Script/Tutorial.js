export class Tutorial {
    menuButton;
    indexDiv;
    pageDiv;
    indexPopup = false;
    async start() {
        await this.loadIncludes();
        this.bindElements();
        this.openIndexForPage();
    }
    // Replaces tags <include src="<file path>"> with referenced HTML
    async loadIncludes() {
        const includeNodes = document.getElementsByTagName('include');
        for (const includeNode of includeNodes) {
            let filePath = includeNode.getAttribute('src');
            let file = await fetch(filePath);
            let text = await file.text();
            includeNode.insertAdjacentHTML('afterend', text);
        }
    }
    bindElements() {
        this.menuButton = document.getElementById("menuButton");
        if (!this.menuButton)
            throw new Error("HTML element not found: menuButton");
        this.menuButton.onclick = event => this.onMenuButton();
        this.indexDiv = document.getElementById("indexDiv");
        if (!this.indexDiv)
            throw new Error("HTML element not found: indexDiv");
        this.pageDiv = document.getElementById("pageDiv");
        if (!this.pageDiv)
            throw new Error("HTML element not found: pageDiv");
    }
    // Open the index tree details to show the entry for the current page.
    openIndexForPage() {
        // Find entry with same name as page URL
        let url = window.location.pathname;
        let fileName = url.substring(url.lastIndexOf('/') + 1);
        fileName = fileName.substring(0, fileName.lastIndexOf('.'));
        let element = document.getElementById(fileName + "Entry");
        if (!element)
            throw new Error("HTML element not found: " + element);
        // Open all <detail> parent HTML elements,
        // until the index div container is reached
        while (element && element != this.indexDiv) {
            if (element.nodeName == "DETAILS")
                element.open = true;
            element = element.parentElement;
        }
    }
    onMenuButton() {
        // If the index is popup mode, hide it again and show the page
        if (this.indexPopup) {
            this.indexDiv.style.display = "none";
            this.pageDiv.style.display = "block";
            this.indexPopup = false;
        }
        else {
            this.indexDiv.style.display = "block";
            this.pageDiv.style.display = "none";
            this.indexPopup = true;
        }
    }
}
//# sourceMappingURL=Tutorial.js.map