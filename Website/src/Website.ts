
export class Website
{
	async start()
	{
		await this.loadIncludes();
	}

	// Replaces tags <include src="<file path>"> with referenced HTML

	async loadIncludes()
	{
		let includeNodes = document.getElementsByTagName( 'include' );
		for( let includeNode of includeNodes ) {
			let filePath = <string> includeNode.getAttribute( 'src' );
			let file = await fetch( filePath );
			let text = await file.text();
			includeNode.insertAdjacentHTML( 'afterend', text );
		}
	}

	bindElements()
	{
	}

}
