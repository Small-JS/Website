import { TutorialEntry } from "./TutorialEntry.js";
import { TutorialTemplate } from "./TutorialTemplate.js";

import * as fs from 'fs';
import * as path from 'path';

export class TutorialPages
{
	private sourceDir = '../Tutorial/Pages';
	private destDir = '../Tutorial/web/Tutorial/Tutorial/Pages';
	private template = new TutorialTemplate();

	convert( root: TutorialEntry )
	{
		this.template.load();

		this.convertEntries( root.entries );
	}

	convertEntries( entries: TutorialEntry[] )
	{
		for( let entry of entries )
			this.convertEntry( entry );
	}

	convertEntry( entry: TutorialEntry )
	{
		let sourcePath = path.posix.join( this.sourceDir, entry.dir, entry.fileName() );
		let pageText = fs.readFileSync( sourcePath ).toString();

		let mergedText = this.template.merge( pageText );

		let destDir = path.join( this.destDir, entry.dir );
		if( ! fs.existsSync( destDir ) )
			fs.mkdirSync( destDir );

		let destPath = path.join( destDir, entry.fileName() );
		fs.writeFileSync( destPath, mergedText );

		this.convertEntries( entry.entries )
	}

}
