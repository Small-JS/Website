
export class ReferenceApp
{
	menuButton!: HTMLButtonElement;
	searchInput!: HTMLInputElement;
	indexDiv!: HTMLDivElement;
	pageDiv!: HTMLDivElement;
	indexPopup = false;

	async start()
	{
		await this.loadIncludes();
		this.bindElements();
		this.openIndexForPage();
	}

	// Replaces tags <include src="<file path>"> with referenced HTML

	async loadIncludes()
	{
		const includeNodes = document.getElementsByTagName( 'include' );
		for( const includeNode of includeNodes ) {
			let filePath = <string> includeNode.getAttribute( 'src' );
			let file = await fetch( filePath );
			let text = await file.text();
			includeNode.insertAdjacentHTML( 'afterend', text );
		}
	}

	bindElements()
	{
		this.menuButton = <HTMLButtonElement> document.getElementById( "menuButton" );
		if( !this.menuButton )
			throw new Error( "HTML element not found: menuButton" );
		this.menuButton.onclick = event => this.onMenuButton();

		this.searchInput = <HTMLInputElement> document.getElementById( "searchInput" );
		if( !this.searchInput )
			throw new Error( "HTML element not found: searchInput" );
		this.searchInput.oninput = event => this.onSearchInputChanged();

		this.indexDiv = <HTMLDivElement> document.getElementById( "indexDiv" );
		if( !this.indexDiv )
			throw new Error( "HTML element not found: indexDiv" );

		this.pageDiv = <HTMLDivElement> document.getElementById( "pageDiv" );
		if( !this.pageDiv )
			throw new Error( "HTML element not found: pageDiv" );
	}

	// Open the index tree details to show the entry for the current page.

	openIndexForPage()
	{
		// Find entry with same name as page URL

		let url = window.location.pathname;
		let fileName = url.substring( url.lastIndexOf( '/' ) + 1 );
		fileName = fileName.substring( 0, fileName.lastIndexOf( '.' ) );
		let element = document.getElementById( fileName + "Entry" );
		if( !element )
			throw new Error( "HTML element not found: " + element );

		// Open all <detail> parent HTML elements,
		// until the index div container is reached

		while( element && element != this.indexDiv ) {
			if( element.nodeName == "DETAILS" )
				( <HTMLDetailsElement> element ).open = true;
			element = element.parentElement;
		}
	}

	onMenuButton()
	{
		// If the index is popup mode, hide it again and show the page
		if( this.indexPopup ) {
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

	onSearchInputChanged()
	{
		this.showAllDetails( false );

		let searchText = this.searchInput.value.toLowerCase();
		if( searchText.length == 0 ) {
			this.showAllDetails( true );
			this.showAllLinks( true );
			this.openIndexForPage();
			return;
		}

		let links = this.indexDiv.getElementsByTagName( "a" );
		for( const link of links ) {
			let text = link.textContent.toLowerCase();
			if( text.includes( searchText ) ) {
				link.style.display = "block";
				this.showParents( link );
			}
			else {
				link.style.display = "none";
			}
		}
	}

	showAllDetails( show: boolean )
	{
		let display = show ? "block" : "none";
		let details = this.indexDiv.getElementsByTagName( "details" );
		for( const detail of details ) {
			detail.style.display = display;
			detail.open = false;
		}
	}

	showAllLinks( show: boolean )
	{
		let display = show ? "block" : "none";
		let links = this.indexDiv.getElementsByTagName( "a" );
		for( const link of links ) {
			link.style.display = display;
		}
	}

	showParents( element: Element )
	{
		let parent = element.parentElement;
		while( parent && parent != this.indexDiv ) {
			if( parent.nodeName == "DETAILS" ) {
				( <HTMLDetailsElement> parent ).open = true;
				( <HTMLDetailsElement> parent ).style.display = "block";
			}
			parent = parent.parentElement;
		}
	}

}
