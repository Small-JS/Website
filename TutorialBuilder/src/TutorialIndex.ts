import { TutorialEntry } from './TutorialEntry.js';

import * as fs from 'fs';
import * as path from 'path';

export class TutorialIndex
{
	root!: TutorialEntry;

	private destPath = '../Tutorial/web/Tutorial/Tutorial/Pages/-Index.html';

	load()
	{
		this.root = new TutorialEntry();
		this.root.fromDir( '', 1 );
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
