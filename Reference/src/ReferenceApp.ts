import { DocumentedClass } from "./DocumentedClass.js";

type ClassMap = Map<string /*className*/, DocumentedClass>;

export class ReferenceApp
{
	classMap: ClassMap = new Map();
	visibleClassMap: ClassMap = new Map();

	menuButton!: HTMLButtonElement;
	searchInput!: HTMLInputElement;
	searchMethodsCheckbox!: HTMLInputElement;
	indexDiv!: HTMLDivElement;
	pageDiv!: HTMLDivElement;
	indexPopup = false;

	async start()
	{
		await this.loadClasses();
		await this.loadIncludes();
		this.bindElements();
		this.openIndexForPage();
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
		this.menuButton = <HTMLButtonElement> document.getElementById( "menuButton" );
		this.assertClass( this.menuButton, "HTMLButtonElement" );
		this.menuButton.onclick = event => this.onMenuButton();

		this.searchInput = <HTMLInputElement> document.getElementById( "searchInput" );
		this.assertClass( this.searchInput, "HTMLInputElement" );
		this.searchInput.oninput = event => this.onSearchInputChanged();

		this.searchMethodsCheckbox = <HTMLInputElement> document.getElementById( "searchMethodsCheckbox" );
		this.assertClass( this.searchMethodsCheckbox, "HTMLInputElement" );
		this.searchMethodsCheckbox.onchange = event => this.onSearchInputChanged();

		this.indexDiv = <HTMLDivElement> document.getElementById( "indexDiv" );
		this.assertClass( this.indexDiv, "HTMLDivElement" );

		this.pageDiv = <HTMLDivElement> document.getElementById( "pageDiv" );
		this.assertClass( this.pageDiv, "HTMLDivElement" );
	}

	assertClass( object: any, className: string )
	{
		if( typeof object != "object" || object.constructor.name != className )
			throw new Error( "Class assertion failed" );
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
