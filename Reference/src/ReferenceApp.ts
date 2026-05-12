import { DocumentedClass } from "./DocumentedClass.js";
import { PageTheme } from "./PageTheme.js";

type ClassMap = Map<string /* className */, DocumentedClass>;

export class ReferenceApp
{
	classMap: ClassMap = new Map();
	visibleClassMap: ClassMap = new Map();

	pageTheme = new PageTheme();
	darkCssLink!: HTMLLinkElement;
	themeButton!: HTMLButtonElement;

	indexPopup = false;
	menuButton!: HTMLButtonElement;
	indexDiv!: HTMLDivElement;
	searchInput!: HTMLInputElement;
	searchMethodsCheckbox!: HTMLInputElement;

	pageDiv!: HTMLDivElement;

	async start()
	{
		this.bindElements();
		this.applyTheme();
		await this.loadClasses();
		await this.loadIncludes();
		this.openIndexForPage();
		this.bindEvents();
	}

	applyTheme()
	{
		this.pageTheme.apply( this.darkCssLink );
		this.pageTheme.themeButtonVisible( this.themeButton );
	}

	// Toggle dark / light mode.

	onThemeButton()
	{
		this.pageTheme.toggle( this.darkCssLink );
	}

	// Load documented classes from JSON file

	async loadClasses()
	{
		this.classMap = new Map();

		let response = await fetch( '/Reference/Reference/DocumentedClasses.json' );
		let objects = <Object[]> await response.json();
		if( !Array.isArray( objects ) )
			throw new Error( "Unexpected file format in: DocumentedClasses.json" );

		for( let object of objects ) {
			let _class = new DocumentedClass( object );
			this.classMap.set( _class.name, _class  );
		}
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
		this.darkCssLink = this.getElement( "darkCssLink", "link" ) as HTMLLinkElement;
		this.themeButton = this.getElement( "themeButton", "button" ) as HTMLButtonElement;

		this.indexDiv = this.getElement( "indexDiv", "div" ) as HTMLDivElement;
		this.menuButton = this.getElement( "menuButton", "button" ) as HTMLButtonElement;
		this.searchInput = this.getElement( "searchInput", "input" ) as HTMLInputElement;
		this.searchMethodsCheckbox = this.getElement( "searchMethodsCheckbox", "input" ) as HTMLInputElement;

		this.pageDiv = this.getElement( "pageDiv", "div" ) as HTMLDivElement;
	}

	bindEvents()
	{
		this.themeButton.onclick = () => this.onThemeButton();
		this.menuButton.onclick = event => this.onMenuButton();
		this.searchInput.oninput = event => this.onSearchInputChanged();
		this.searchMethodsCheckbox.onchange = event => this.onSearchInputChanged();
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

	// Open the index tree details to show the entry for the current page.

	openIndexForPage()
	{
		this.showAndCloseDetails( true );

		// Find entry with same name as page URL
		let url = window.location.pathname;
		let fileName = url.substring( url.lastIndexOf( '/' ) + 1 );
		fileName = fileName.substring( 0, fileName.lastIndexOf( '.' ) );
		let element = document.getElementById( fileName + "Entry" );
		if( !element )
			throw new Error( "HTML element not found: " + element );
		this.showWithParents( element );
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

	// ================================ Search

	onSearchInputChanged()
	{
		let searchText = this.searchInput.value.toLowerCase().trim();
		if( searchText.length == 0 ) {
			this.resetSearch();
			return;
		}

		let searchMethods = this.searchMethodsCheckbox.checked;
		this.search( searchText, searchMethods );
		this.updateIndex();
	}

	resetSearch()
	{
		this.showAllLinks( true );
		this.openIndexForPage();
	}

	showAllLinks( show: boolean )
	{
		let display = show ? "block" : "none";
		let links = this.indexDiv.getElementsByTagName( "a" );
		for( const link of links )
			link.style.display = display;
	}

	search( searchText: string, searchMethods: boolean )
	{
		this.visibleClassMap = new Map();
		for( let _class of this.classMap.values() ) {
			if( _class.matches( searchText, searchMethods ) )
				this.visibleClassMap.set( _class.name, _class );
		}
	}

	updateIndex()
	{
		this.showAndCloseDetails( false );
		this.showVisible();
	}

	showAndCloseDetails( show: boolean )
	{
		let display = show ? "block" : "none";
		let details = this.indexDiv.getElementsByTagName( "details" );
		for( const detail of details ) {
			detail.style.display = display;
			detail.open = false;
		}
	}

	showVisible()
	{
		let links = this.indexDiv.getElementsByTagName( "a" );
		for( const link of links ) {
			let className = link.textContent;
			if( this.visibleClassMap.has( className ) )
				this.showWithParents( link );
			else
				link.style.display = "none";
		}
	}

	showWithParents( element: HTMLElement )
	{
		element.style.display = "block";
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
