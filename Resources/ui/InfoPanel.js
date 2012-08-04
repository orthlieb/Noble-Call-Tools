var log = require('lib/logger');
var style = require('ui/style');

function SettingsPanel() {
    return this;
}

function open(controller) {
    log.start();
    var self = this;

    var win = Ti.UI.createWindow({
        backButtonTitle: L('button_done'),
        backgroundImage : style.findImage('BackgroundTile.png'),
        backgroundRepeat: true,
        barColor: style.win.barColor,
        title : L('settings'),
        layout: 'vertical'
    });

    var one = Ti.UI.createView({
       left: 0,
       top: 0,
       width: Ti.UI.FILL,
       height: Ti.UI.SIZE,
       layout: 'absolute'
    });

    // Banner
    var headerImage = Ti.UI.createImageView({
        image: style.findImage('Header.png'),
        center: { x: '50%' },
        top: style.gutter.size,
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE
    });
    one.add(headerImage);
 
    // Version
    var versionLabel = Ti.UI.createLabel({
        right: style.gutter.size,
        bottom: style.gutter.size,
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        font: style.font.small,
        text: L('version_group') + L('version_number'),
        textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
        color: style.label.color
    });
    one.add(versionLabel);
    win.add(one);

    var two = Ti.UI.createView({
       left: 0,
       top: 0,
       right: 0,
       bottom: 0,
       width: Ti.UI.FILL,
       height: Ti.UI.FILL,
       layout: 'absolute' 
    });

     // Nice opaque effect in the background.
    var translucentView = Ti.UI.createView({
        left: style.gutter.size,
        top: style.gutter.size,
        right: style.gutter.size,
        bottom: style.gutter.size,
        borderRadius: 5,
        borderWidth: 1,
        backgroundColor: style.win.backgroundColor,
        opacity: style.translucentView.opacity  
    });
    two.add(translucentView); 
    
    var three = Ti.UI.createView({
        left: style.gutter.size * 2,
        top: style.gutter.size * 2,
        right: style.gutter.size * 2,
        bottom: style.gutter.size * 2,
        layout: 'vertical'
    });
    
    // Paragraph describing Noble Call
    var variation = style.font.small;
    variation.fontStyle = 'italic';
    var creedText = Ti.UI.createLabel({
        left: 0,
        top: 0,
        right: 0,
        height: Ti.UI.SIZE,
        color: style.label.color,
        font: variation,
        text: L('creed_text')
    });
    three.add(creedText);

    // Email suggestions
    function emailButtonClick(e) {
        var emailDialog = Ti.UI.createEmailDialog();
        emailDialog.subject = L('email_subject');
        emailDialog.toRecipients = ['noblecall@orthlieb.com'];
        emailDialog.messageBody = L('email_body');
        emailDialog.open();
    }
    var emailButton = Ti.UI.createButton({
        top: style.gutter.size,
        center: { x: '50%' },
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        title : L('button_bug')       
    }, emailButtonClick);
    three.add(emailButton);

    two.add(three);
    win.add(two);

        // Handle orientation.  
    function relayoutSettingsPanel(e) {
        headerImage.updateLayout({
            left: 0,
            top: 0,
            image: style.findImage('Header.png') 
        });
    }
    win.addEventListener("close", function settingsPanelClose(e) {
        Ti.Gesture.removeEventListener("orientationchange", relayoutSettingsPanel);
    });
    Ti.Gesture.addEventListener("orientationchange", relayoutSettingsPanel);

     controller.open(win);
}

SettingsPanel.prototype.open = open;
module.exports = SettingsPanel;
