import * as path from 'path';
import * as fs from 'fs';

export class TutorialEntry
{
	title: string = '';
	entries: TutorialEntry[] = [];
	level: number = 0;
	dir: string = '';

	// Recursively add entries in JSON file: "-Index.json"
	// It must start with an array.

	fromDir( dir: string, level: number )
	{
		let jsonIndexPath = path.posix.join( "../Tutorial/Pages", dir, "-Index.json" );
		let text = fs.readFileSync( jsonIndexPath  ).toString();
		let objects = JSON.parse( text );
		if( ! Array.isArray( objects ) )
			throw new Error( "File '-Index.json': Must start with an array." );

		for( let title of objects ) {
			if( typeof title !== 'string' )
				throw new Error( "File '-Index.json': Array elements must be strings." );

			let entry = new TutorialEntry();
			entry.title = title;
			entry.level = level;
			entry.dir = dir;
			this.entries.push( entry );

			let newDir = path.posix.join( entry.dir, entry.baseName() );
			let newFileDir = path.posix.join( entry.fileDir(), entry.baseName() );
			if( fs.existsSync( newFileDir ) )
				if( fs.lstatSync( newFileDir ).isDirectory() )
					entry.fromDir( newDir, level + 1 );
		}

	}

	// Recursively generate HTML for sub-entries

	toHtml(): string
	{
		let html = '';
		for( let entry of this.entries ) {
			if( entry.entries.length == 0 )
				html += entry.entryHtml( false);
			else
				html += entry.detailsHtml();
		}
		return html;
	}

	entryHtml( isBranch: boolean ): string
	{
		if( !fs.existsSync( this.filePath() ) )
			throw new Error( '-Index.json: Page file not found: ' + this.filePath() );

		let indent = '\t'.repeat( this.level - 1 );
		let _class= isBranch ? 'tutorialIndexEntryBranch' : 'tutorialIndexEntry';
		return indent + '<a ' +
			'id="' + this.baseName() + 'Entry" ' +
			'class="' + _class + '" ' +
			'href="/Tutorial/Tutorial/Pages/' + this.path() + '">' +
			this.title +
			'</a>\n';
	}

	detailsHtml()
	{
		let indent = '\t'.repeat( this.level - 1 );
		return indent + '<details>\n' +
			indent + '\t<summary>\n' +
			'\t\t' + this.entryHtml( true ) +
			indent + '\t</summary>\n' +
			this.toHtml() +
			indent + '</details>\n';
	}

	baseName(): string
	{
		return this.title.replace( /\W/g, '' );
	}

	fileName(): string
	{
		return this.baseName() + ".html";
	}

	path(): string
	{
		return path.posix.join( this.dir, this.fileName() );
	}

	fileDir(): string
	{
		return path.posix.join( "../Tutorial/Pages", this.dir );
	}

	filePath(): string
	{
		return path.posix.join( this.fileDir(), this.fileName() );
	}
};

