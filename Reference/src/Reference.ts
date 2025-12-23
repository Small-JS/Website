
export class Reference
{
	indexDiv!: HTMLDivElement;

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
		this.indexDiv = <HTMLDivElement> document.getElementById( "referenceIndexDiv" );
		if( !this.indexDiv )
			throw new Error( "HTML element not found: tutorialIndexDiv" );
	}

	// Open the index tree details to show the entry for the current page.

	openIndexForPage()
	{
		// Find entry with same name as page URL

		let url = window.location.pathname;
		let fileName = url.substring( url.lastIndexOf( '/' ) + 1 );
		fileName = fileName.substring( 0, fileName.lastIndexOf( '.' ) )
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
}
