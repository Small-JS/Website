import { ReferenceEntry } from './ReferenceIndexEntry.js';

import * as fs from 'fs';
import * as path from 'path';

// Generate the navigation index from the genereated HTML pages

export class ReferenceIndex
{
	destPath = '../Reference/web/Reference/Reference/Pages/Index.html';
	root!: ReferenceEntry;

	generate()
	{
		this.load();
		this.save();
	}

	load()
	{
		this.root = new ReferenceEntry();

		this.root.fromDir( '.' );
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