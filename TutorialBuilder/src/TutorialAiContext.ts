import * as fs from 'fs';

export class TutorialAiContext
{
	generate()
	{
		let outputFileName = '../Tutorial/web/Tutorial/Tutorial/Pages/smalljs.txt';
		let outputFd = fs.openSync( outputFileName, "w" );

		this.appendFiles( '../../SmallJS/Smalltalk/**/Test/*.st', outputFd );
		this.appendFiles( '../../SmallJS/Examples/**/*.st', outputFd );
		this.appendFiles( '../../SmallJS/Documentation/**/*.md', outputFd );

		fs.closeSync( outputFd );
	}

	appendFiles( pattern: string, outputFd: number )
	{
		let fileNames = fs.globSync( pattern );
		for( let fileName of fileNames ) {
			let text = fs.readFileSync( fileName );
			fs.writeSync( outputFd, text );
		}
	}

}

