18/03/21,
	Issues list,
		1. [Pending] Saved answer not retaining on going back & re-visiting.
		2. [Done] Multi text - Do not show already added accounts
		3. [Done] Multi text - provide remove button for selected cards
		4. [Done] Multi text - empty data validation
		5. [Pending] Tabular - empty data validation
		6. [Done] Tabular - confusing button & alerts are removed
		7. [Done] Image Capture - empty data validation
		8. [Done] Star Rating - star not visible
		9. [Done] Image Capture - After reaching max & disabling the button. If any image is removed then button is not enabled for re-capture.
		10. [Done] Background sync should trigger on app login + planned survey capture + soon any submit actions
		11. [Done] Once a survey is synced to surver, the local survey data is deleted & hence causes the day plan survey button to be visible. Instead of removing update the synced status
		12. [Done] Retailer flow broken!!!

===================================================================================================================

15/03/21,

1. Star Rating not displaying more than 5 stars.
2. Survey Image Capture API is not triggered
3. If retailer is not added then new unplanned visit retailer list is not displayed
4. Retailer after submit not redirecting on alert click.
5. Retailer image pop-up comes at top of the screen
6. Sync to be enabled for unplanned visit tab
7. Retailer validation
8. Retailer data clear after submit




1. Call these APIs only once is a day --> "Day Plan", "Survey Question" & "Account Data (Multi Text) (Dealers & Sub-Dealers)"
2. Once a survey is completed, remove it from planned or unplanned visit. 
3. Sequence of Sync
	- Day plan -- Once in a day
	- Survey Question -- Once in a day
	- Account Data (Multi Text) -- Once in a day
	- New Retailers Data
	- New Retailer - UnPlanned Survey Image Data
	- Planned Survey Data
	- Existing Retailer - UnPlanned Survey Data
	- New Retailer - UnPlanned Survey Data
	- Planned Survey Image Data
	- Existing Retailer - UnPlanned Survey Image Data


Client confirmation,
Either master data can be loaded only once then app will be non-ui blocking.
If master data has to be synced regularly then app will be ui blocking & the sync only happens on home page (planned visit screen). 


============================================================================================



1. [DONE] Testing of online submit
2. Offline, push of unsynced data to server
3. Multi text suggestions and api integration and response type
4. Tabular question with multiple options
5. Display, stock, special efforts to be tested
6. Confirmation on submit
7. Non-synced survey to be greyed out testing
8. Provide individual survey link for starting survey directly

Blocker,
	1. Day plan api still gives the submitted survey id.
	2. Image api integration
	3. 

============================================================================================


1. "Multi Text" --> response type ---> implement as per discussion
2. "Single Select Group" ---> already correct format
3. "Tabular Question" ---> already correct format


1. New API for "Sub Dealers & Sub-Dealers" <---- "Multi-Text" Component
	- Type or state or region or country
	- Persist the data
	- On component, apply filter before display [when user types show as suggestions]
	- Until api is received, make the question as optional
2. Tabular Question with multiple options to be captured & display as card to accommodate multiple data





Display --> options with score [entry based]
Stock --> options with score [entry based]
Special Efforts --> options with score [selection]


================================================================================================


13-02-2021,
	1. Confirmation on survey submit. 
	1. Different account with same survey has answers duplicated across
	2. Last question submit is not redirecting to home screen [when offline]
	3. Non-synced survey button not in green & not disabled [when offline]
	4. Feedback not retaining saved answer
	5. Slider not selected for saved value
	6. Invalid data pushed to server on submit [when online]
	7. On network availability, saved survery push to server.
	8. Provide the individual survey link for starting the survey directly.
	9. Direct survey start implementation on the app.
	10. "Multi Text" Question type - While typing, we should get the suggestion as per the Data from Database



11-02-2021,

	1. [DONE] Logout icon on top right side. On click show confirmation.
	2. On answer submit with confirmation.
	3. Submit answer api json structure - Once survey has been submitted, That surveys are not reflecting in specified accounts in salesforce
	4. On network availability, saved survery push to server.
	5. Completed survery to be in green color & non-clickable - Once you complete the survey it should display some message showing that the survey is completed/the survey red tab should be turned to green or something similar should be provided.
	6. "Single Select Group" - For the first option (VKC Pride) not able to change the option from selected good to Very good, working fine for rest of the options.
	7. "Multi Text" Question type - While typing, we should get the suggestion as per the Data from Database
	8. [DONE] [JOE] Survey should be displayed in the app based on the User and as per his dayplan, currently not getting filtered as per the User & Dayplan.
	9. [DONE] [JOE] "Feedback" - Feedback Question- Only two lines are available for text input, below lines are hidden/not able to type more than 2lines
	10. Provide the individual survey link for starting the survey directly.
	11. Direct survey start implementation on the app.
	12. [DONE] [JOE] Enable the rating label to show above the stars.
	13. [DONE] Multiple image issue still persists.
	14. [DONE] Multiple image capture is allowed till 10.
	15. [IGNORED] Is it possible to control the image size based on quality. This is to reduce the file size.



==========================================================================================




1. [DONE] On submit, app logs out
2. [DONE] If the logged in token is expired, its not redirecting to login screen [or do we have to enable refresh token?]
3. Logout is not available in app
4. Sync the data when network is back
5. Disable the survey button for completed surveys
6. Pull down to refresh option in planned visit for syncing the surveys or getting data manually.


Test below,
1. [DONE] Multiple images capture
2. Save the survery answer as accountid + surveyid --> I completed survey for kiran stores, now when I visited survey for Lakshmi stores and ckc footwear dealer or showed the filled form
3. After the survey is submitted, I went offline (switched off wifi and mobile data). It loaded the account with survey page but when I clicked on the survey which I completed last time i.e. Kiran Stores then it loaded the fresh form. I think on app load it's fetching the data and overloading it



# VKC Survey App

yarn

react-native run-android

yarn release