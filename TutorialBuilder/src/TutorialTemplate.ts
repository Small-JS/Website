import * as fs from 'fs';

export class TutorialTemplate
{
	private path = '../Tutorial/Pages/-Template.html';
	private searchString = '{tutorialPage}';
	private text = '';
	private matchIndex = -1;

	load()
	{
		this.text = fs.readFileSync( this.path ).toString();
		this.matchIndex = this.text.indexOf( this.searchString );
		if( this.matchIndex < 0 )
			throw new Error( 'Template file: ' + this.path + ': ' +
				'Cannot find search string: "' + this.searchString + '"' );
	}

	// Return template text with search string replaced by argument text

	merge( text: string ): string
	{
		return this.text.substring( 0, this.matchIndex ) +
			text +
			this.text.substring( this.matchIndex + this.searchString.length );
	}
}
