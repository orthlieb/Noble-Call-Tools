var SettingsPanel = require('ui/SettingsPanel');
var NavigationController = require('widgets/NavigationController');
var WebView = require('widgets/WebView');
var ButtonGrid = require('widgets/ButtonGrid');
var BibleQuote = require('ui/BibleQuote');

var log = require('helpers/logger');
var ui = require('ui');
var style = require('ui/style');

function MainWindow() {
	log.start();
};

var navController;

// Definitions for the main and courageous button grids.
var mainButtons = {
	// id: image name, label, bottom offset for label
	'conciliatory' : {
		image : 'ButtonDove',
		text : L('conciliatory_conversation'),
		offset : 5,
		url : ['ConciliatoryConversation1', 'ConciliatoryConversation2', 'ConciliatoryConversation3']
	},
	'great' : {
		image : 'ButtonFlower',
		text : L('a_great_response'),
		offset : 5,
		url : ['ComfortingConversation1', 'ComfortingConversation2', 'ComfortingConversation3', 'ComfortingConversation4', 'ComfortingConversation5', 'ComfortingConversation6', 'ComfortingConversation7', 'ComfortingConversation8']
	},
	'courageous' : {
		image : 'ButtonCrown',
		text : L('courageous_conversation'),
		offset : 5
	},
	'connecting' : {
		image : 'ButtonHearts',
		text : L('connecting_conversation'),
		offset : 5,
		url : ['ConnectingConversations', 'ConnectingConversations1', 'ConnectingConversations2', 'ConnectingConversations3', 'ConnectingConversations4', 'ConnectingConversations5', 'ConnectingConversations6', 'ConnectingConversations7', 'ConnectingConversations8', 'ConnectingConversations9']
	},
	'collaborating' : {
		image : 'ButtonScales',
		text : L('collaborating_conversation'),
		offset : 5,
		url : ['CollaboratingConversation1']
	},
	'identity' : {
		image : 'ButtonKnight',
		text : L('noble_identity'),
		offset : 11,
		url : [['NobleIdentityRememberWhoseYouAre', 'NobleIdentityRememberWhoYouAreMen', 'NobleIdentityRememberWhoYourWifeIs'], ['NobleIdentityRememberWhoseYouAre', 'NobleIdentityRememberWhoYouAreWomen', 'NobleIdentityRememberWhoYourHusbandIs']]
	},
	'character' : {
		image : 'ButtonCompass',
		text : L('character'),
		offset : 5,
		url : ['CharacterOfChrist', 'CharacterDefinitions', 'CharacterGroupings']
	},
	'armor' : {
		image : 'ButtonArmor',
		text : L('armor_of_god'),
		offset : 11,
		url : ['ArmorOfGod']
	}
};

var courageousButtons = {
	// id, image name, label, bottom offset for label
	'agreements' : {
		image : 'ButtonAgreement',
		text : L('the_two_agreements'),
		offset : 5,
		url : ['TheTwoAgreementsListener', 'TheTwoAgreementsSpeaker']
	},
	'prayers' : {
		image : 'ButtonPray',
		text : L('prayers'),
		offset : 11,
		url : [['CourageousPrayerHusbandAsListener', 'CourageousPrayerWifeAsSpeaker'], ['CourageousPrayerWifeAsListener', 'CourageousPrayerHusbandAsSpeaker']]
	},
	'questions' : {
		image : 'ButtonQuestion',
		text : L('questions'),
		offset : 11,
		url : ['CourageousConversationIntro', 'CourageousConversationQuestion1', 'CourageousConversationQuestion2', 'CourageousConversationQuestion3', 'CourageousConversationQuestion4', 'CourageousConversationQuestion5', 'CourageousConversationQuestion6', 'CourageousConversationQuestion7', 'CourageousConversationQuestion8', 'CourageousConversationQuestion9', 'CourageousConversationQuestion10']
	},
	'words' : {
		image : 'ButtonEmotions',
		text : L('emotion_words'),
		offset : 11,
		url : [['SoulInAdversityMen'], ['SoulInAdversityWomen']]
	}
};

var firstTime = true;

// Show a web view in the current nav controller.
function showWebView(/*NavigationController*/controller, /*String*/title, /*Array*/urlArray) {
	log.start();

	var wv = new WebView(title, urlArray);
	
	// Bridge between web view and the application.
	if(firstTime) {
		Ti.App.addEventListener('requestBibleQuote', function ShowQuoteListener(e) {
			log.start("Looking up verse: " + e.verse);
			var bibleVersion = Titanium.App.Properties.getString('BibleVersion', 'kjv');

			if(!Ti.Network.online) {
				var dlg = Titanium.UI.createAlertDialog({
					title : L('network_none'),
					ok : L('button_ok'),
					message : L('no_quote')
				});
				dlg.show();
			} else {
				var bq = new BibleQuote(bibleVersion, e.verse);
				bq.open(controller);
			}
		});
		firstTime = false;
	}

	wv.open(controller);
	// Push the view onto the modal stack
}

function courageousButtonClick(e) {
	var theButton = e.source;
	log.start('Button pressed ' + theButton.id);

	var dlg;

	Titanium.Analytics.featureEvent('com.noblecall.toolset.' + theButton.id);

	switch (theButton.id) {
		case 'agreements':
		case 'questions':
			showWebView(navController, courageousButtons[theButton.id].text, courageousButtons[theButton.id].url);
			break;
		case 'prayers':
			// There are 2 paths through identity. We need to ask the user whether they are a man or a woman.
			dlg = Ti.UI.createOptionDialog({
				title : L('question_listener'),
				options : [L('button_listener'), L('button_speaker'), L('button_cancel')],
				cancel : 2
			});
			dlg.addEventListener('click', function(e) {
				if(e.index != 2) {
					showWebView(navController, courageousButtons[theButton.id].text, courageousButtons[theButton.id].url[e.index]);
				}
			});
			dlg.show();
			break;
		case 'words':
			// There are 2 paths through words. We need to ask the user whether they are a man or a woman.
			dlg = Ti.UI.createOptionDialog({
				title : L('question_man'),
				options : [L('button_man'), L('button_woman'), L('button_cancel')],
				cancel : 2
			});
			dlg.addEventListener('click', function(e) {
				if(e.index != 2) {
					showWebView(navController, courageousButtons[theButton.id].text, courageousButtons[theButton.id].url[e.index]);
				}
			});
			dlg.show();
			break;
		default:
			dlg = Ti.UI.createAlertDialog({
				title : 'Alert',
				message : "Button " + theButton.id + " is not implemented!",
				buttonNames : ['Ok']
			});
			dlg.show();
			break;
	}
}

function mainButtonGridClick(e) {
	var theButton = e.source;
	var dlg;

	log.info(theButton.id + ' button pressed (' + e + ')');

	Titanium.Analytics.featureEvent('com.noblecall.toolset.' + theButton.id);

	switch (theButton.id) {
		case 'armor':
		case 'great':
		case 'character':
		case 'conciliatory':
		case 'connecting':
		case 'collaborating':
		case 'test':
			showWebView(navController, mainButtons[theButton.id].text, mainButtons[theButton.id].url);
			break;
		case 'courageous':
			var bg = new ButtonGrid(Ti.Platform.displayCaps.platformWidth, courageousButtons, courageousButtonClick);
			var win = ui.window({// Need a window to host the grid.
				backButtonTitle : L('button_done'),
				backgroundColor : style.color.backgroundColor,
				backgroundImage : style.image.portrait.courageousView,
				barColor : style.color.navBar,
				orientationModes : [Ti.UI.PORTRAIT],
				title : L('courageous_conversation')
			});

			win.add(bg.scrollview);
			navController.open(win);
			// Add to the Nav controller.
			bg.relayout(Ti.Platform.displayCaps.platformWidth);	
			
			// Handle orientation
			function relayoutCourageousWindow(e) {
				bg.relayout(Ti.Platform.displayCaps.platformWidth);
			};		
			win.addEventListener('close', function courageousWindowClose(e) {
				Ti.Gesture.removeEventListener('orientationchange', relayoutCourageousWindow);
			});
			Ti.Gesture.addEventListener('orientationchange', relayoutCourageousWindow);			
			break;
		case 'identity':
			// There are 2 paths through identity. We need to ask the user whether they are a man or a woman.
			dlg = Ti.UI.createOptionDialog({
				title : L('question_man'),
				options : [L('button_man'), L('button_woman'), L('button_cancel')],
				cancel : 2
			});
			dlg.addEventListener('click', function(e) {
				if(e.index != 2) {
					showWebView(navController, mainButtons[theButton.id].text, mainButtons[theButton.id].url[e.index]);
				}
			});
			dlg.show();
			break;
		default:
			dlg = Ti.UI.createAlertDialog({
				title : 'Alert',
				message : "Button " + theButton.id + " is not implemented!",
				buttonNames : ['Ok']
			});
			dlg.show();
			break;
	};
};

function open() {
	log.start();

	// Construct the main window and navigation controller.
	var w = ui.window({
		title : L('app_title'),
		backgroundColor : style.color.backgroundColor,
		backgroundImage : style.image.portrait.mainWindow,
		orientationModes : [Ti.UI.PORTRAIT]
	});
	navController = new NavigationController();

	// Create a Settings button on the parent window.
	var mainSettingsPanel = new SettingsPanel();
	var mainSettingsButton = ui.button({
		id : 'info',
		systemButton : Ti.UI.iPhone.SystemButton.INFO_LIGHT
	});
	mainSettingsButton.addEventListener('click', mainSettingsPanel.open);
	w.rightNavButton = mainSettingsButton;

	var mainButtonGrid = new ButtonGrid(Ti.Platform.displayCaps.platformWidth, mainButtons, mainButtonGridClick);
	// Must have a window to host the button grid.
	w.add(mainButtonGrid.scrollview);
	w.barColor = style.color.navBar;
	// Nav controller is our root.
	navController.open(w);

	// Handle orientation
	function relayoutMainWindow(e) {
		mainButtonGrid.relayout(Ti.Platform.displayCaps.platformWidth);
	}
	w.addEventListener('open', relayoutMainWindow);
	Ti.Gesture.addEventListener('orientationchange', relayoutMainWindow);
};

// Exports
MainWindow.prototype.open = open;
module.exports = MainWindow;
