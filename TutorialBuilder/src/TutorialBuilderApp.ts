// This class builds the static HTML for the website.
// This is done this way to allow search engines to index the site,

import { TutorialAiContext } from "./TutorialAiContext.js";
import { TutorialIndex } from "./TutorialIndex.js";
import { TutorialPages } from "./TutorialPages.js";

// Currentlly this is only done for the pages of the Tutorial.

export class TutorialBuilderApp
{
	start()
	{
		this.generatePages();
		this.generateAiContext();
	}

	generatePages()
	{
		console.log( 'Generating tutorial pages...' );

		let tutorialIndex = new TutorialIndex();
		tutorialIndex.load();
		tutorialIndex.save();

		let tutorialPages = new TutorialPages();
		tutorialPages.convert();

		console.log( 'Completed.' );
	}

	async generateAiContext()
	{
		console.log( 'Generating AI context file...' );

		new TutorialAiContext().generate();

		console.log( 'Completed.' );
	}
}

