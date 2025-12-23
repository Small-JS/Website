
import * as path from 'path';
import * as fs from 'fs';

export class TutorialEntry
{
	title: string = '';
	entries: TutorialEntry[] = [];
	level: number = 0;
	dir: string = '';

	// Recursively add entries from JSON format
	// It must start with an array.

	fromObjects( objects: any[], level: number, dir: string )
	{
		let entry: TutorialEntry;

		for( let object of objects ) {
			if( typeof object === 'string' ) {
				entry = new TutorialEntry();
				entry.title = object;
				entry.level = level;
				entry.dir = dir;
				this.entries.push( entry );
			}
			if( object instanceof Array ) {
				let newDir = path.join( dir, entry!.baseName() );
				entry!.fromObjects( object, level + 1, newDir );
			}
		}
	}

	// Recursively generate HTML for sub-entries

	toHtml(): string
	{
		let html = '';
		for( let entry of this.entries ) {
			if( entry.entries.length == 0 )
				html += entry.entryHtml();
			else
				html += entry.detailsHtml();
		}
		return html;
	}

	entryHtml(): string
	{
		if( !fs.existsSync( this.filePath() ) )
			throw new Error( '-Index.json: Page file not found: ' + this.filePath() );

		let indent = '\t'.repeat( this.level - 1 );
		return indent + '<a ' +
			'id="' + this.baseName() + 'Entry" ' +
			'class="tutorialIndexEntry" ' +
			'href="/Tutorial/Tutorial/Pages/' + this.path() + '">' +
			this.title +
			'</a><br>\n';
	}

	detailsHtml()
	{
		let indent = '\t'.repeat( this.level - 1 );
		return indent + '<details>\n' +
			indent + '\t<summary>\n' +
			'\t\t' + this.entryHtml() +
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

	filePath(): string
	{
		return "../Tutorial/Pages/" + this.path();
	}
};

