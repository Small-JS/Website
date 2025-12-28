import { DocumentedClass } from './DocumentedClass.js';
import { DocumentedMethod } from './DocumentedMethod.js';

import * as fs from 'fs';
import * as path from 'path';

export class ReferenceTemplate
{
	private path = '../Reference/Pages/Template.html';
	private templateText = '';
	private text = '';

	load()
	{
		this.templateText = fs.readFileSync( this.path ).toString();
	}

	// Replace internal text merged info.

	merge( _class: DocumentedClass, classes: DocumentedClass[] ): string
	{
		this.text = this.templateText;
		this.replaceField( '{class}', _class.name );
		this.replaceSuperclass( _class.superclass, classes );
		this.replaceField( '{module}', _class.module );
		this.replaceField( '{path}', _class.path );
		this.replaceField( '{classVars}', _class.classVars );
		this.replaceField( '{vars}', _class.vars );
		this.replaceComment( _class.comment );
		this.replaceMethods( '{classMethods}', _class.classMethods );
		this.replaceMethods( '{methods}', _class.methods );

		return this.text;
	}

	replaceField( fieldName: string, text: string )
	{
		let index = this.text.indexOf( fieldName );
		if( index < 0 )
			throw new Error( 'Fieldname not found in template: ' + fieldName );

		this.text = this.text.substring( 0, index ) +
			text + this.text.substring( index + fieldName.length );
	}

	replaceSuperclass( superclassName: string, classes: DocumentedClass[] )
	{
		if( superclassName == 'nil' ) {
			this.replaceField( '{superclass}', superclassName );
			return;
		}

		let superclass = classes.find( _class => _class.name == superclassName );
		if( ! superclass )
			throw Error( 'Superclass not found: ' + superclassName );

		let url = path.posix.join( '/Reference/Reference/Pages' , path.posix.dirname( superclass.path ) );
		url = path.posix.join( url, superclass.name + '.html' );
		let html = '<a href="' + url + '">' + superclass.name + '</a>';

		this.replaceField( '{superclass}', html );
	}

	// Convert newlines to <br> elements.
	replaceComment( comment: string )
	{
		let htmlComment = this.commentToHtml( comment );
		this.replaceField( '{comment}', htmlComment );
	}

	commentToHtml( comment: string ): string
	{
		return comment.replaceAll( '\r', '' )
			.replaceAll( '\t', '' )
			.replaceAll( '\n', '<br>' )
			.replaceAll( '<br> ', '<br>' );
	}

	// Group methods are grouped per cateogry

	replaceMethods( fieldName: string, methods: DocumentedMethod[] )
	{
		let html = '';
		let category = '';
		let categoryMethods: DocumentedMethod[] = [];

		for( let method of methods ) {
			if( method.category != category ) {
				html += this.categoryAndMethodsToHtml( category, categoryMethods );
				categoryMethods = [];
			}
			category = method.category;
			categoryMethods.push( method );
		}

		// Output remaining methods.
		html += this.categoryAndMethodsToHtml( category, categoryMethods );

		this.replaceField( fieldName, html );
	}

	categoryAndMethodsToHtml( category: string, methods: DocumentedMethod[] ): string
	{
		if( methods.length == 0 )
			return '';

		return this.categoryToHtml( category ) +
			this.methodsToHtml( methods );
	}

	categoryToHtml( category: string ): string
	{
		if( category == '' )
			return '';

		return '<div class="methodCategoryDiv">' +
			'Category: ' + category + '' +
			'</div>\n';
	}

	// Methods are placed in a table
	// Column 1 is the method name, column 2 is the optional comment.

	methodsToHtml( methods: DocumentedMethod[] ): string
	{
		if( methods.length < 1 )
			return '';

		let methodsHtml = '';

		for( let method of methods ) {
			methodsHtml += '<code>' + method.header + '</code></br>\n';
			let htmlComment = this.commentToHtml( method.comment );
			methodsHtml += '<div class="methodComment">' + htmlComment + '</div>\n';
		}

		return methodsHtml;
	}

}
