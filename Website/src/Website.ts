import { PageTheme } from "./PageTheme.js";

export class Website
{
	pageTheme = new PageTheme();
	darkCssLink!: HTMLLinkElement;
	navBarDarkCssLink!: HTMLLinkElement;
	themeButton!: HTMLButtonElement;

	async start()
	{
		// Apply page theme before loading includes, to prevent a flash of the light theme.
		this.darkCssLink = this.getElement( "darkCssLink", "link" ) as HTMLLinkElement;
		this.pageTheme.apply( this.darkCssLink );

		await this.loadIncludes();
		this.bindElements();
		this.applyTheme();
		this.bindEvents();
	}

	// Replaces tags <include src="<file path>"> with referenced HTML

	async loadIncludes()
	{
		let includeNodes = document.getElementsByTagName( 'include' );
		for( let includeNode of includeNodes ) {
			let filePath = <string> includeNode.getAttribute( 'src' );
			let file = await fetch( filePath );
			if( ! file.ok )
				throw new Error( "Include file not loaded: " + filePath + ", status: " + file.status );
			let text = await file.text();
			includeNode.insertAdjacentHTML( 'afterend', text );
		}
	}

	bindElements()
	{
		this.navBarDarkCssLink = this.getElement( "navBarDarkCssLink", "link" ) as HTMLLinkElement;
		this.themeButton = this.getElement( "themeButton", "button" ) as HTMLButtonElement;
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

	bindEvents()
	{
		this.themeButton.onclick = () => this.onThemeButton();
	}

	applyTheme()
	{
		this.pageTheme.apply( this.navBarDarkCssLink );
		this.pageTheme.themeButtonVisible( this.themeButton );
	}

	// Toggle dark / light mode.

	onThemeButton()
	{
		this.pageTheme.toggle();
	}

}
