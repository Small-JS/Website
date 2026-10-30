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
		if( ! fs.existsSync( jsonIndexPath ) )
			throw new Error( "File not found: " + jsonIndexPath + ". " +
				"A folder with the same name as a page holds its subpages, so it must contain a '-Index.json' file." );

		let text = fs.readFileSync( jsonIndexPath  ).toString();
		let objects = JSON.parse( text );
		if( ! Array.isArray( objects ) )
			throw new Error( "File " + jsonIndexPath + ": Must start with an array." );

		let baseNames = new Map<string, string>();
		for( let title of objects ) {
			if( typeof title !== 'string' )
				throw new Error( "File " + jsonIndexPath + ": Array elements must be strings." );

			let entry = new TutorialEntry();
			entry.title = title;
			entry.level = level;
			entry.dir = dir;

			// Titles are reduced to word characters for file names, so different titles can clash.
			let baseName = entry.baseName();
			if( baseName == '' )
				throw new Error( "File " + jsonIndexPath + ": Title '" + title + "' has no word characters for a file name." );
			let otherTitle = baseNames.get( baseName );
			if( otherTitle !== undefined )
				throw new Error( "File " + jsonIndexPath + ": Titles '" + otherTitle + "' and '" + title + "' " +
					"both have file name '" + entry.fileName() + "'." );
			baseNames.set( baseName, title );

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
			'class="' + _class + '" ' +
			'href="/Tutorial/Tutorial/Pages/' + this.path() + '">' +
			this.escapedTitle() +
			'</a>\n';
	}

	escapedTitle(): string
	{
		return this.title
			.replaceAll( '&', '&amp;' )
			.replaceAll( '<', '&lt;' )
			.replaceAll( '>', '&gt;' );
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

