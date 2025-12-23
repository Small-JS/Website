// This class contains a subset of fields of CompiledClass
// that are stored in file ClassDocumentation.json.
// That file contains class information with first comments.

// This class may only have static methods to remain exportable to JSON.

import { DocumentedMethod } from './DocumentedMethod.js';

import * as fs from 'fs';

export class DocumentedClass
{
	name = '';
	path = '';
	module = '';
	superclass = '';
	classVars = '';
	vars = '';
	comment = '';

	classMethods: DocumentedMethod[] = [];
	methods: DocumentedMethod[] = [];

	static load(): DocumentedClass[]
	{
		let sourcePath = '../Reference/Pages/DocumentedClasses.json';
		let text = fs.readFileSync( sourcePath ).toString();
		let classObjects = JSON.parse( text );
		let classes: DocumentedClass[] = [];

		for( let classObject of classObjects )
		{
			let _class = Object.assign( new DocumentedClass(), classObject );

			// Now convert methods from JS objects to class instances

			_class.classMethods = [];
			for( let methodObject of <DocumentedMethod[]> classObject.classMethods )
				_class.classMethods.push(
					Object.assign( new DocumentedMethod(), methodObject ) );

			_class.methods = [];
			for( let methodObject of <DocumentedMethod[]> classObject.methods )
				_class.methods.push(
					Object.assign( new DocumentedMethod(), methodObject ) );

			classes.push( _class );
		}

		return classes;
	}
}
