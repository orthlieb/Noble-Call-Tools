var log = require('lib/logger');
var style = require('ui/style');

function InfoPanel() {
    return this;
}

function open(controller) {
    log.start();
    var self = this;

    var win = Ti.UI.createWindow({
        backButtonTitle: L('button_done'),
        backgroundImage : style.findBackground('bkgnd/Info.png'),
        barColor: style.win.barColor,
        title : L('settings'),
        layout: 'absolute'
    });

    // Version
    var versionLabel = Ti.UI.createLabel({
        right: style.gutter.size,
        top: style.gutter.size,
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        font: style.font.small,
        text: L('version_group') + ' ' + L('version_number'),
        textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
        color: style.label.color
    });
    win.add(versionLabel);

    // Email suggestions  
    var emailButton = Ti.UI.createButton({
        bottom: style.gutter.size,
        center: { x: '50%' },
        width: '40%',
        height: style.button.height,
        title : L('button_bug')       
    });
    emailButton.addEventListener('click', function emailButtonClick(e) {
        var emailDialog = Ti.UI.createEmailDialog();
        emailDialog.subject = L('email_subject');
        emailDialog.toRecipients = ['noblecall@orthlieb.com'];
        emailDialog.messageBody = L('email_body');
        emailDialog.open();
    });
    win.add(emailButton);

    // Handle orientation.  
    function relayoutInfoPanel(e) {
        win.backgroundImage = style.findBackground('bkgnd/Info.png');
    }
    win.addEventListener("close", function InfoPanelClose(e) {
        Ti.Gesture.removeEventListener("orientationchange", relayoutInfoPanel);
    });
    Ti.Gesture.addEventListener("orientationchange", relayoutInfoPanel);

     controller.open(win);
}

InfoPanel.prototype.open = open;
module.exports = InfoPanel;
