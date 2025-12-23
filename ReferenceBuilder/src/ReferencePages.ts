import { ReferenceTemplate } from "./ReferenceTemplate.js";

import * as fs from 'fs';
import * as path from 'path';
import { DocumentedClass } from "./DocumentedClass.js";

// Convert JSON class info file "DocumentedClass.json"
// to static web pages is same hierarchy as their file paths,
// using the HTML page template "-Template.html"

export class ReferencePages
{
	private destDir = '../Reference/web/Reference/Reference/Pages';
	private template = new ReferenceTemplate();

	generate( classes: DocumentedClass[] )
	{
		this.template.load();

		if( ! fs.existsSync( this.destDir ) )
			fs.mkdirSync( this.destDir );

		this.copyHomePage();

		for( let _class of classes )
			this.generateClass( _class );
	}

	copyHomePage()
	{
		let fileName = 'Home.html';
		let sourceDir = '../Reference/Pages';
		let sourcePath = path.posix.join( sourceDir, fileName );
		let destPath = path.posix.join( this.destDir, fileName );
		fs.cpSync( sourcePath, destPath );
	}

	generateClass( _class: DocumentedClass )
	{
		let destDir = path.posix.join( this.destDir, path.posix.dirname( _class.path ) );
		if( ! fs.existsSync( destDir ) )
				fs.mkdirSync( destDir, { recursive: true } );

		let mergedText = this.template.merge( _class );

		let destPath = path.posix.join( destDir, _class.name + ".html" );
		fs.writeFileSync( destPath, mergedText );
	}

}
