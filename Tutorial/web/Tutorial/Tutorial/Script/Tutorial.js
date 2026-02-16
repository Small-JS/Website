export class Tutorial {
    menuButton;
    previousButton;
    nextButton;
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
        const includeNodes = document.getElementsByTagName("include");
        for (const includeNode of includeNodes) {
            let filePath = includeNode.getAttribute("src");
            let file = await fetch(filePath);
            let text = await file.text();
            includeNode.insertAdjacentHTML("afterend", text);
            // This might produce a bug with multiple include nodes?
            includeNode.remove();
        }
    }
    bindElements() {
        this.menuButton = this.getElement("menuButton", "button");
        this.menuButton.onclick = () => this.onMenuButton();
        this.menuButton = this.getElement("previousButton", "button");
        this.menuButton.onclick = () => this.onPreviousButton();
        this.menuButton = this.getElement("nextButton", "button");
        this.menuButton.onclick = () => this.onNextButton();
        this.indexDiv = this.getElement("indexDiv", "div");
        this.pageDiv = this.getElement("pageDiv", "div");
        this.addCopyToClipboardButtons();
    }
    // Get HTML element also id checking for existence and correct tag
    // Otherwise throw an error.
    getElement(id, tagName) {
        let element = document.getElementById(id);
        if (!element)
            throw new Error("HTML element id not found: " + id);
        tagName = tagName.toUpperCase();
        if (element.tagName != tagName)
            throw new Error("HTML element tag name unexpected: " + element.tagName +
                ", expected: " + tagName);
        return element;
    }
    // Add a button enabling copy to clipboard after every codeblock
    addCopyToClipboardButtons() {
        for (let element of document.getElementsByClassName("codeBlock")) {
            // Create button image
            let image = document.createElement("img");
            image.src = "/Tutorial/Tutorial/Copy.png";
            image.classList.add("copyImage");
            // Create button
            let button = document.createElement("button");
            button.classList.add("copyButton");
            button.append(image);
            button.onclick = () => navigator.clipboard.writeText(element.textContent);
            element.after(button);
        }
    }
    // Open the index tree details to show the entry for the current page.
    openIndexForPage() {
        let element = this.currentIndexElement();
        // Open all <detail> parent HTML elements,
        // until the index div container is reached
        while (element && element != this.indexDiv) {
            if (element.tagName == "DETAILS")
                element.open = true;
            element = element.parentElement;
        }
    }
    // Find entry with same name as URL of current page
    // Throw an error if it is not found.
    currentIndexElement() {
        let url = window.location.pathname;
        let fileName = url.substring(url.lastIndexOf("/") + 1);
        fileName = fileName.substring(0, fileName.lastIndexOf("."));
        let element = document.getElementById(fileName + "Entry");
        if (!element)
            throw new Error("HTML element not found: " + element);
        return element;
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
    onPreviousButton() {
        let element = this.currentIndexElement();
        this.navigateIntoPrevious(element);
    }
    // Find the previous "sibling" in the tree and navigate into last link
    navigateIntoPrevious(element) {
        if (!element)
            throw Error("Failed to find previous sibling element in tree");
        let previousElement = element.previousElementSibling;
        while (previousElement && previousElement.tagName == "BR")
            previousElement = previousElement.previousElementSibling;
        if (!previousElement) {
            if (element == this.indexDiv)
                return;
            return this.navigateIntoPrevious(element.parentElement);
        }
        this.navigateIntoLast(previousElement);
    }
    navigateIntoLast(element) {
        if (!element)
            throw new Error("Failed to find last anchor element");
        if (element.tagName == "SUMMARY" || element.tagName == "DETAILS")
            return this.navigateIntoLast(element.lastElementChild);
        while (element && element.tagName == "BR")
            element = element.previousElementSibling;
        if (!element)
            throw new Error("Failed to find last anchor element");
        if (element.tagName != "A")
            throw new Error("Unexpected tag: " + element.tagName);
        window.location.href = element.href;
    }
    onNextButton() {
        let element = this.currentIndexElement();
        this.navigateIntoNext(element);
    }
    // Find the next "sibling" in the tree and navigate into first link
    navigateIntoNext(element) {
        if (!element)
            throw Error("Failed to find next sibling element in tree");
        let nextElement = element.nextElementSibling;
        while (nextElement && nextElement.tagName == "BR")
            nextElement = nextElement.nextElementSibling;
        if (!nextElement) {
            if (element == this.indexDiv)
                return;
            return this.navigateIntoNext(element.parentElement);
        }
        this.navigateIntoFirst(nextElement);
    }
    navigateIntoFirst(element) {
        if (!element)
            throw new Error("Failed to find next first anchor element");
        if (element.tagName == "SUMMARY" || element.tagName == "DETAILS")
            return this.navigateIntoFirst(element.firstElementChild);
        if (element.tagName != "A")
            throw new Error("Unexpected tag: " + element.tagName);
        window.location.href = element.href;
    }
}
//# sourceMappingURL=Tutorial.js.map