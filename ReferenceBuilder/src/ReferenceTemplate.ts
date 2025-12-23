import { DocumentedClass } from './DocumentedClass.js';
import { DocumentedMethod } from './DocumentedMethod.js';

import * as fs from 'fs';

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

	merge( _class: DocumentedClass ): string
	{
		this.text = this.templateText;
		this.replaceField( '{class}', _class.name );
		this.replaceField( '{superclass}', _class.superclass );
		this.replaceField( '{module}', _class.module );
		this.replaceField( '{path}', _class.path );
		this.replaceField( '{classVars}', _class.classVars );
		this.replaceField( '{vars}', _class.vars );
		this.replaceComment( '{comment}', _class.comment );
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

	// Convert newlines to <br> elements.
	replaceComment( fieldName: string, comment: string )
	{
		let htmlComment = this.commentToHtml( comment );
		this.replaceField( fieldName, htmlComment );
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

		let table = '<table class="methodTable">\n';
		for( let method of methods ) {
			let htmlComment = this.commentToHtml( method.comment );
			table +=
				'\t<tr>\n' +
				'\t\t<th><code>' + method.name + '</code></th>\n' +
				'\t\t<td>' + htmlComment + '</td>\n' +
				'\t</tr>\n';
		}
		table += '</table>\n<br>\n';

		return table;
	}

}
