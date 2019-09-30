READ ME:

Version: 1.0.0

Installation:
Open Chrome > Navigate to chrome://extensions/ > Top right corner turn on Developer Mode > Click Load unpacked > Select Chris-Extension folder.

Before using on pages make sure that the page has loaded after enabling the plugin. If you can an error of please wait for page to load refresh the page/


Places to change JSON Data link:
 - content.js line 12 
 - popup.js line 7
 - Or find and replace this text https://raw.githubusercontent.com/Chrystophs/cjExtension/master/data.json


DATA JSON
data.json file is an example of the structure and may be used as a template. Host this file that is accessible with an ajax request and provide link in the locations state above.


Quick Link Buttons do nothing by default. To remove Delete popup.html lines 26 - 34 this will leave you with the Quick Text button.

content.js is the bar that get placed on the page. All functionality is there.

background.js receives messages from popup.js and operates on the webpage.

popup.js send messages to background.js and only operates in the extension.


To create an action on the page from the extension there must be a message sent from the popup to the browsers active tab.

Questions? 

Contact me at Chrystophs@gmail.com

My website: https://chrystophs.com