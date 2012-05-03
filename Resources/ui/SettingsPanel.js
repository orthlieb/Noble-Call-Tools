var log = require('helpers/logger');
var ui = require('ui/ui');
var style = require('ui/style');

function SettingsPanel() {
    return this;
}

function open(controller) {
    log.start();
    var self = this;

    var win = ui.window({
        backButtonTitle: L('button_done'),
        backgroundImage: style.findImage('Background.png'),
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
        left: 0,
        top: 0
    });
    one.add(headerImage);
 
    // Version
    var versionLabel = ui.label({
        right: ui.dim.gutter,
        bottom: ui.dim.gutter,
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        font: style.font.small,
        text: L('version_group') + version,
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
    var translucentView = ui.view({
        left: ui.dim.gutter,
        top: ui.dim.gutter,
        right: ui.dim.gutter,
        bottom: ui.dim.gutter,
        borderRadius: 5,
        borderWidth: 1,
        backgroundColor: style.win.backgroundColor,
        opacity: style.translucentView.opacity  
    });
    two.add(translucentView); 
    
    var three = Ti.UI.createView({
        left: ui.dim.gutter * 2,
        top: ui.dim.gutter * 2,
        right: ui.dim.gutter * 2,
        bottom: ui.dim.gutter * 2,
        layout: 'vertical'
    });
    
    // Paragraph describing Noble Call
    var variation = style.font.small;
    variation.fontStyle = 'italic';
    var creedText = ui.label({
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
    var emailButton = ui.button({
        top: ui.dim.gutter,
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
