import { PageTheme } from "./PageTheme.js";

export class TutorialApp
{
	pageTheme = new PageTheme();
	darkCssLink!: HTMLLinkElement;
	themeButton!: HTMLButtonElement;

	previousButton!: HTMLButtonElement;
	nextButton!: HTMLButtonElement;
	advanceButton!: HTMLButtonElement;

	indexPopup = false;
	menuButton!: HTMLButtonElement;
	indexDiv!: HTMLDivElement;

	pageDiv!: HTMLDivElement;

	async start()
	{
		this.bindElements();
		this.applyTheme();
		this.addCopyToClipboardButtons();
		await this.loadIncludes();
		this.openIndexForPage();
		this.bindEvents();
	}

	bindElements()
	{
		this.darkCssLink = this.getElement( "darkCssLink", "link" ) as HTMLLinkElement;
		this.themeButton = this.getElement( "themeButton", "button" ) as HTMLButtonElement;

		this.previousButton = this.getElement( "previousButton", "button" ) as HTMLButtonElement;
		this.nextButton = this.getElement( "nextButton", "button" ) as HTMLButtonElement;
		this.advanceButton = this.getElement( "advanceButton", "button" ) as HTMLButtonElement;

		this.menuButton = this.getElement( "menuButton", "button" ) as HTMLButtonElement;
		this.indexDiv = this.getElement( "indexDiv", "div" ) as HTMLDivElement;

		this.pageDiv = this.getElement( "pageDiv", "div" ) as HTMLDivElement;
	}

	// Call this after the page is completely loaded.

	bindEvents()
	{
		this.themeButton.onclick = () => this.onThemeButton();
		this.menuButton.onclick = () => this.onMenuButton();
		this.previousButton.onclick = () => this.onPreviousButton();
		this.nextButton.onclick = () => this.onNextButton();
		this.advanceButton.onclick = () => this.onNextButton();
	}

	applyTheme()
	{
		this.pageTheme.apply( this.darkCssLink );
	}

	// Toggle dark / light mode.

	onThemeButton()
	{
		this.pageTheme.toggle( this.darkCssLink );
	}

	// Get HTML element also id checking for existence and correct tag
	// Otherwise throw an error.

	getElement( id: string, tagName: string ): HTMLElement
	{
		let element = document.getElementById( id );
		if( ! element )
			throw new Error( "HTML element id not found: " + id );

		tagName = tagName.toUpperCase();
		if( element.tagName != tagName )
			throw new Error( "HTML element tag name unexpected: " + element.tagName +
				", expected: " + tagName );

		return element;
	}

	// Add a button enabling copy to clipboard after every codeblock

	addCopyToClipboardButtons()
	{
		for( let element of document.getElementsByClassName( "codeBlock" ) ) {
			// Create button image
			let image = document.createElement( "img" );
			image.src = "/Tutorial/Tutorial/Copy.png";
			image.classList.add( "copyImage" );

			// Create button
			let button = document.createElement( "button" );
			button.classList.add( "copyButton" );
			button.append( image );
			button.onclick = () => navigator.clipboard.writeText( element.textContent );
			element.after( button );
		}
	}

	// Replaces tags <include src="<file path>"> with referenced HTML

	async loadIncludes()
	{
		const includeNodes = document.getElementsByTagName( "include" );
		for( const includeNode of includeNodes ) {
			let filePath = <string> includeNode.getAttribute( "src" );
			let file = await fetch( filePath );
			let text = await file.text();
			includeNode.insertAdjacentHTML( "afterend", text );
			// This might produce a bug with multiple include nodes?
			includeNode.remove();
		}
	}

	// Open the index tree details to show the entry for the current page.

	openIndexForPage()
	{
		let element: HTMLElement | null = this.currentIndexElement();

		// Open all <detail> parent HTML elements,
		// until the index div container is reached

		while( element && element != this.indexDiv ) {
			if( element.tagName == "DETAILS" )
				( <HTMLDetailsElement> element ).open = true;
			element = element.parentElement;
		}
	}

	// Find entry with same href as URL of current page.
	// Throw an error if it is not found.

	currentIndexElement(): HTMLElement
	{
		let url = window.location.pathname;
		var element = <HTMLElement> document.querySelector( "a[href='" + url + "']");
		if( !element )
			throw new Error( "HTML element not found with href: " + url );

		return element;
	}

	onMenuButton()
	{
		// If the index is popup mode, hide it again and show the page
		if( this.indexPopup ) {
			this.indexDiv.style.display = "none";
			this.pageDiv.style.display = "block"
			this.indexPopup = false;
		}
		else {
			this.indexDiv.style.display = "block";
			this.pageDiv.style.display = "none";
			this.indexPopup = true;
		}
	}

	onPreviousButton()
	{
		let element = this.currentIndexElement();
		this.navigateIntoPrevious( element );
	}

	// Find the previous "sibling" in the tree and navigate into last link

	navigateIntoPrevious( element: Element | null ): undefined
	{
		if( ! element )
			throw Error( "Failed to find previous sibling element in tree" );

		let previousElement = element.previousElementSibling;
		if( ! previousElement ) {
			if( element == this.indexDiv )
				return;
			return this.navigateIntoPrevious( element.parentElement );
		}

		this.navigateIntoLast( previousElement );
	}

	navigateIntoLast( element: Element | null ): undefined
	{
		if( ! element )
			throw new Error( "Failed to find last anchor element" );

		if( element.tagName == "SUMMARY" || element.tagName == "DETAILS" )
			return this.navigateIntoLast( element.lastElementChild )

		if( ! element )
			throw new Error( "Failed to find last anchor element" );

		if( element.tagName != "A" )
			throw new Error( "Unexpected tag: " + element.tagName );

		window.location.href = ( <HTMLAnchorElement> element ).href;
	}

	onNextButton()
	{
		let element = this.currentIndexElement();
		this.navigateIntoNext( element );
	}

	// Find the next "sibling" in the tree and navigate into first link

	navigateIntoNext( element: Element | null ): undefined
	{
		if( ! element )
			throw Error( "Failed to find next sibling element in tree" );

		let nextElement = element.nextElementSibling;
		if( ! nextElement ) {
			if( element == this.indexDiv )
				return;
			return this.navigateIntoNext( element.parentElement );
		}

		this.navigateIntoFirst( nextElement );
	}

	navigateIntoFirst( element: Element | null ): undefined
	{
		if( ! element )
			throw new Error( "Failed to find next first anchor element" );

		if( element.tagName == "SUMMARY" || element.tagName == "DETAILS" )
			return this.navigateIntoFirst( element.firstElementChild )

		if( element.tagName != "A" )
			throw new Error( "Unexpected tag: " + element.tagName );

		window.location.href = ( <HTMLAnchorElement> element ).href;
	}

}
