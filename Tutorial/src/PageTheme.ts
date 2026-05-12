// Manages setting dark and light mode, saved in local localStorage

export class PageTheme
{
	darkTheme: boolean = false;

	constructor()
	{
		this.load();
	}

	load()
	{
		this.darkTheme = ( localStorage.getItem( "darkTheme" ) == "true" );
	}

	save()
	{
		let darkThemeString = this.darkTheme ? "true" : "false";
		localStorage.setItem( "darkTheme", darkThemeString );
	}

	apply( darkCssLink: HTMLLinkElement )
	{
		darkCssLink.disabled = ! this.darkTheme;
	}

	toggle(  darkCssLink: HTMLLinkElement )
	{
		this.darkTheme = ! this.darkTheme;
		this.save();
		this.apply( darkCssLink );
	}

	// Hide theme button if running in an iframe

	themeButtonVisible( themeButton: HTMLButtonElement )
	{
		themeButton.hidden = this.inIframe();
	}

	inIframe(): boolean
	{
		return window.self !== window.top;
	}

}
