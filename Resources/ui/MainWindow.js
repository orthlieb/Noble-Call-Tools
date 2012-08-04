var NavigationController = require('widgets/NavigationController');
var WebView = require('widgets/WebView');
var ButtonGrid = require('widgets/ButtonGrid');
var BibleQuote = require('ui/BibleQuote');

var log = require('lib/logger');
var style = require('ui/style');

function MainWindow() {
    log.start();
}

var navController;

// Definitions for the main and courageous button grids.
var mainButtons = {
    // id: image name, label, bottom offset for label
    'conciliatory' : {
        image : 'buttongrid/ButtonDove',
        text : L('conciliatory_conversation'),
        offset : 5,
        url : ['ConciliatoryConversation1', 'ConciliatoryConversation2', 'ConciliatoryConversation3']
    },
    'great' : {
        image : 'buttongrid/ButtonFlower',
        text : L('a_great_response'),
        offset : 5,
        url : ['ComfortingConversation1', 'ComfortingConversation2', 'ComfortingConversation3', 'ComfortingConversation4', 'ComfortingConversation5', 'ComfortingConversation6', 'ComfortingConversation7', 'ComfortingConversation8']
    },
    'courageous' : {
        image : 'buttongrid/ButtonCrown',
        text : L('courageous_conversation'),
        offset : 5
    },
    'connecting' : {
        image : 'buttongrid/ButtonHearts',
        text : L('connecting_conversation'),
        offset : 5,
        url : ['ConnectingConversations', 'ConnectingConversations1', 'ConnectingConversations2', 'ConnectingConversations3', 'ConnectingConversations4', 'ConnectingConversations5', 'ConnectingConversations6', 'ConnectingConversations7', 'ConnectingConversations8', 'ConnectingConversations9']
    },
    'collaborating' : {
        image : 'buttongrid/ButtonScales',
        text : L('collaborating_conversation'),
        offset : 5,
        url : ['CollaboratingConversation1']
    },
    'identity' : {
        image : 'buttongrid/ButtonKnight',
        text : L('noble_identity'),
        offset : 11,
        url : [['NobleIdentityRememberWhoseYouAre', 'NobleIdentityRememberWhoYouAreMen', 'NobleIdentityRememberWhoYourWifeIs'], ['NobleIdentityRememberWhoseYouAre', 'NobleIdentityRememberWhoYouAreWomen', 'NobleIdentityRememberWhoYourHusbandIs']]
    },
    'character' : {
        image : 'buttongrid/ButtonCompass',
        text : L('character'),
        offset : 5,
        url : ['CharacterOfChrist', 'CharacterDefinitions', 'CharacterGroupings']
    },
    'armor' : {
        image : 'buttongrid/ButtonArmor',
        text : L('armor_of_god'),
        offset : 11,
        url : ['ArmorOfGod', 'WarriorsCreed', 'BreastPlatePrayer']
    }
};

var courageousButtons = {
    // id, image name, label, bottom offset for label
    'agreements' : {
        image : 'buttongrid/ButtonAgreement',
        text : L('the_two_agreements'),
        offset : 5,
        url : ['TheTwoAgreementsListener', 'TheTwoAgreementsSpeaker']
    }, 
    'prayers' : {
        image : 'buttongrid/ButtonPray',
        text : L('prayers'),
        offset : 11,
        url : [['CourageousPrayerHusbandAsListener', 'CourageousPrayerWifeAsSpeaker'], ['CourageousPrayerWifeAsListener', 'CourageousPrayerHusbandAsSpeaker']]
    },
    'questions' : {
        image : 'buttongrid/ButtonQuestion',
        text : L('questions'),
        offset : 11,
        url : ['CourageousConversationIntro', 'CourageousConversationQuestion1', 'CourageousConversationQuestion2', 'CourageousConversationQuestion3', 'CourageousConversationQuestion4', 'CourageousConversationQuestion5', 'CourageousConversationQuestion6', 'CourageousConversationQuestion7', 'CourageousConversationQuestion8', 'CourageousConversationQuestion9', 'CourageousConversationQuestion10']
    },
    'words' : {
        image : 'buttongrid/ButtonEmotions',
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

    Ti.Analytics.featureEvent('com.noblecall.toolset.' + theButton.id);

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
            // We want a maximum of three buttons across the narrowest aspect of the device.
            var bg = new ButtonGrid({
                viewWidth: Math.min(Ti.Platform.displayCaps.platformWidth, Ti.Platform.displayCaps.platformHeight), 
                buttons: courageousButtons, 
                buttonWidth: style.buttonGrid.width,
                buttonHeight: style.buttonGrid.height,
                click: courageousButtonClick
            });
            var win = Ti.UI.createWindow({// Need a window to host the grid.
                anchorPoint: { x: 0, y: 0 },
                barColor : style.win.barColor,
                title : L('courageous_conversation')
            });
            win.add(bg.scrollview);
            navController.open(win);
 
            // Handle orientation and close events
            function relayoutCourageousWindow(e) {
                bg.relayout(Ti.Platform.displayCaps.platformWidth);
            }
            win.addEventListener('close', function courageousWindowClose(e) {
                Ti.Gesture.removeEventListener('orientationchange', relayoutCourageousWindow);
            });
            Ti.Gesture.addEventListener('orientationchange', relayoutCourageousWindow);
            setTimeout(relayoutCourageousWindow, 1000);
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
    }
}

function open() {
    log.start();

    // Construct the main window and navigation controller.
    var w = Ti.UI.createWindow({
        anchorPoint: { x: 0, y: 0 },
        title : L('app_title'),
    });
    navController = new NavigationController();

    // Create a Info button on the parent window.
    var InfoButton = require('widgets/InfoButton');
    var infoButton = new InfoButton();
    infoButton.attach(w, function mainInfoButtonClick(e) {
        var InfoPanel = require('ui/InfoPanel');
        var mainInfoPanel = new InfoPanel();   
        mainInfoPanel.open(navController);
    });
       
    // We want a maximum of three buttons across the narrowest aspect of the device.
    var mainButtonGrid = new ButtonGrid({
        viewWidth: Math.min(Ti.Platform.displayCaps.platformWidth, Ti.Platform.displayCaps.platformHeight), 
        buttons: mainButtons, 
        buttonWidth: style.buttonGrid.width,
        buttonHeight: style.buttonGrid.height,
        click: mainButtonGridClick
    });
    w.add(mainButtonGrid.scrollview);

    w.barColor = style.win.barColor;

    // Nav controller is our root.
    navController.open(w);

    // Handle orientation
    function relayoutMainWindow(e) {
        mainButtonGrid.relayout(Ti.Platform.displayCaps.platformWidth);
    }
    Ti.Gesture.addEventListener('orientationchange', relayoutMainWindow);
    
    setTimeout(relayoutMainWindow, 1000);
    
    var density = Ti.Platform.displayCaps.density;
    alert("Density: " + density + ' platformHeight: ' + Ti.Platform.displayCaps.platformHeight + ' platformWidth: ' + Ti.Platform.displayCaps.platformWidth);
}

// Exports
MainWindow.prototype.open = open;
module.exports = MainWindow;
