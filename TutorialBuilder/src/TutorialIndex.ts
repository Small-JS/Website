import { TutorialEntry } from './TutorialEntry.js';

import * as fs from 'fs';
import * as path from 'path';

export class TutorialIndex
{
	root!: TutorialEntry;

	private sourcePath = '../Tutorial/Pages/-Index.json';
	private destPath = '../Tutorial/web/Tutorial/Tutorial/Pages/-Index.html';

	load()
	{
		let text = fs.readFileSync( this.sourcePath ).toString();
		let objects = JSON.parse( text );

		this.root = new TutorialEntry();
		this.root.fromObjects( objects, 1, '' );
	}

	save()
	{
		let html = this.root.toHtml();

		let destDir = path.dirname( this.destPath );
		if( ! fs.existsSync( destDir ) )
			fs.mkdirSync( destDir );

		fs.writeFileSync( this.destPath, html );
	}

}
