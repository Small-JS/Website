// This class contains a subset of fields of CompiledClass
// that are stored in file ClassDocumentation.json.

// This class may only have static methods to remain importable to JSON.

import { DocumentedMethod } from "./DocumentedMethod.js";

export class DocumentedClass
{
	name = "";
	path = "";
	module = "";
	superclass = "";
	classVars = "";
	vars = "";
	comment = "";

	classMethods: DocumentedMethod[] = [];
	methods: DocumentedMethod[] = [];

	constructor( object: any )
	{
		// Object.assign() is not used here
		// because we want real class instances for the methods.

		this.name = object.name;
		this.path = object.path;
		this.module = object.module;
		this.superclass = object.superclass;
		this.classVars = object.classVars;
		this.vars = object.vars;
		this.comment = object.comment;

		this.classMethods = [];
		for( let classMethodObject of object.classMethods )
			this.classMethods.push( new DocumentedMethod( classMethodObject ) );

		this.methods = [];
		for( let methodObject of object.methods )
			this.methods.push( new DocumentedMethod( methodObject ) );
	}

	matches( searchText: string, searchMethods: boolean ): boolean
	{
		if( searchText.length == 0 )
				return true;

		if( !searchMethods )
			return this.name.toLowerCase().includes( searchText );

		for( let classMethod of this.classMethods )
			if( classMethod.matches( searchText ) )
				return true;

		for( let method of this.methods )
			if( method.matches( searchText ) )
				return true;

		return false;
	}

}