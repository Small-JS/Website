// This class builds the static HTML for the website.
// This is done this way to allow search engines to index the site,

import { DocumentedClass } from "./DocumentedClass.js";
import { ReferenceIndex } from "./ReferenceIndex.js";
import { ReferencePages } from "./ReferencePages.js";


// Currentlly this is only done for the pages of the Reference.

export class ReferenceBuilder
{
	private classes: DocumentedClass[] = [];

	build()
	{
		let classes = DocumentedClass.load();
		new ReferencePages().generate( classes );
		new ReferenceIndex().generate();
	}
}
