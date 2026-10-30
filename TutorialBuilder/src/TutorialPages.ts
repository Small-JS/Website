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

		// Clear destination, so pages that were removed or renamed disappear.
		fs.rmSync( this.destDir, { recursive: true, force: true } );
		fs.mkdirSync( this.destDir, { recursive: true } );

		let files = <string[]> fs.readdirSync( this.sourceDir, { recursive: true } );
		for( let file of files )
			this.convertFile( file );
	}

	convertFile( file: string )
	{
		// Standardize on Unix path separators.
		file = file.replaceAll( '\\', '/' );

		// Skip template and index files, and folders, in any subfolder.
		if( file.split( '/' ).some( part => part.startsWith( '-' ) ) )
			return;

		let sourcePath = path.posix.join( this.sourceDir, file );

		// Create directory if not existing
		let stat = fs.statSync( sourcePath );
		if(  stat.isDirectory() ) {
			let destDir = path.posix.join( this.destDir, file );
			fs.mkdirSync( destDir, { recursive: true } );
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
