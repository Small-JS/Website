import { TutorialEntry } from "./TutorialEntry.js";
import { TutorialTemplate } from "./TutorialTemplate.js";

import * as fs from 'fs';
import * as path from 'path';

// Convert source pages folder to web pages folder hierarchically.
// Html source files are assumed to need the page template.
// Other files are just copied.

export class TutorialPages
{
	private sourceDir = '../Tutorial/Pages';
	private destDir = '../Tutorial/web/Tutorial/Tutorial/Pages';
	private template = new TutorialTemplate();

	convert()
	{
		this.template.load();

		if( ! fs.existsSync( this.destDir ) )
			fs.mkdirSync( this.destDir );

		let files = <string[]> fs.readdirSync( this.sourceDir, { recursive: true } );
		for( let file of files )
			this.convertFile( file );
	}

	convertFile( file: string )
	{
		// Skip tempate files
		if( file.substring( 0 , 1 ) == '-' )
			return;

		// Standardize on Unix path separators.
		file = file.replaceAll( '\\', '/' );
		let sourcePath = path.posix.join( this.sourceDir, file );

		// Create directory if not existing
		let stat = fs.statSync( sourcePath );
		if(  stat.isDirectory() ) {
			let destDir = path.posix.join( this.destDir, file );
			if( ! fs.existsSync( destDir ) )
				fs.mkdirSync( destDir );
			return;
		}

		let destPath = path.posix.join( this.destDir, file );

		// Just copy non-html files
		if( ! sourcePath.endsWith( '.html' ) ) {
			fs.cpSync( sourcePath, destPath )
			return;
		}

		// Merge source file with template
		let pageText = fs.readFileSync( sourcePath ).toString();
		let mergedText = this.template.merge( pageText );
		fs.writeFileSync( destPath, mergedText );
	}

}
