// This class builds the static HTML for the website.
// This is done this way to allow search engines to index the site,

import { TutorialIndex } from "./TutorialIndex.js";
import { TutorialPages } from "./TutorialPages.js";

// Currentlly this is only done for the pages of the Tutorial.

export class TutorialBuilderApp
{
	start()
	{
		this.generatePages();
	}

	generatePages()
	{
		console.log( 'Generating tutorial pages...' );

		let tutorialIndex = new TutorialIndex();
		tutorialIndex.load();

		// Convert pages before saving the index,
		// because converting clears the destination folder.
		let tutorialPages = new TutorialPages();
		tutorialPages.convert();

		tutorialIndex.save();

		console.log( 'Completed.' );
	}

}

