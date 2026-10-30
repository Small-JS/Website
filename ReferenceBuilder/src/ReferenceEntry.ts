
import * as path from 'path';
import * as fs from 'fs';

export class ReferenceEntry
{
	title: string = '';
	fileName: string = '';
	dir: string = '';
	level: number = 0;
	isDir = false;
	entries: ReferenceEntry[] = [];

	static baseDir = '../Reference/web/Reference/Reference/Pages';
	static skipFiles = [ 'Index.html' ];

	// Recursively read entries from filesystem directory

	fromDir( subDir: string )
	{

		// Split directory files into directories and files
		// to be able to process files first.
		// Sort the names, because the readdir order differs per platform.

		let dirs: string[] = []
		let files: string[] = [];

		let dir = path.posix.join( ReferenceEntry.baseDir, subDir );
		let dirFiles = fs.readdirSync( dir ).sort( ( a, b ) => a.localeCompare( b, 'en' ) );
		for( let dirFile of dirFiles ) {
			if( ReferenceEntry.skipFiles.includes( dirFile ) )
				continue;

			let _path = path.posix.join( dir, dirFile );
			let stat = fs.statSync( _path );
			if( stat.isDirectory() )
				dirs.push( dirFile )
			else
				files.push( dirFile )
		}

		// First process files.

		for( let dirFile of files )
		{
			let entry = new ReferenceEntry();
			entry.title = dirFile.replace( '.html', '' );
			entry.fileName = dirFile;
			entry.dir = subDir;
			entry.level = this.level + 1;
			this.entries.push( entry );
		}

		// Then process directories.

		for( let dirFile of dirs )
		{

			let entry = new ReferenceEntry();
			entry.title = dirFile;
			entry.fileName = dirFile;
			entry.dir = subDir;
			entry.level = this.level + 1;
			entry.isDir = true;
			this.entries.push( entry );

			entry.fromDir( path.posix.join( subDir, dirFile ) )
		}
	}

	// Recursively generate HTML for sub-entries.

	toHtml(): string
	{
		let html = '';

		for( let entry of this.entries ) {
			if( entry.isDir )
				html += entry.detailsHtml();
			else
				html += entry.fileEntryHtml();
		}
		return html;
	}

	fileEntryHtml(): string
	{
		let indent = '\t'.repeat( this.level - 1 );
		return indent + '<a ' +
			'id="' + this.title + 'Entry" ' +
			'class="referenceIndexEntry" ' +
			'href="/Reference/Reference/Pages/' + this.path() + '">' +
			this.title +
			'</a>\n';
	}

	detailsHtml()
	{
		let indent = '\t'.repeat( this.level - 1 );
		return indent + '<details>\n' +
			indent + '\t<summary>\n' +
			indent + '\t\t' + this.detailsEntryHtml() +
			indent + '\t</summary>\n' +
			this.toHtml() +
			indent + '</details>\n';
	}

	// The id uses the full path, because directory names are not unique, e.g. 'Base'.

	detailsEntryHtml(): string
	{
		return '<span ' +
			'id="' + this.path().replaceAll( '/', '-' ) + 'DirEntry" ' +
			'class="dirReferenceIndexEntry">' +
			this.title +
			'</span>\n';
	}

	path(): string
	{
		return path.posix.join( this.dir, this.fileName );
	}

};

