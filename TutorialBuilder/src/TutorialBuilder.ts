// This class builds the static HTML for the website.
// This is done this way to allow search engines to index the site,

import { TutorialIndex } from "./TutorialIndex.js";
import { TutorialPages } from "./TutorialPages.js";

// Currentlly this is only done for the pages of the Tutorial.

export class TutorialBuilder
{
	build()
	{
		let tutorialIndex = new TutorialIndex();
		tutorialIndex.load();
		tutorialIndex.save();

		let tutorialPages = new TutorialPages();
		tutorialPages.convert();
	}

}
