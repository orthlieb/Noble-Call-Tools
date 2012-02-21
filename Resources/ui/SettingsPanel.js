var log = require('helpers/logger');

function SettingsPanel() {
}

function open() {
	log.start();

    var dlg = Ti.UI.createAlertDialog({title: L('noble_call_tools'), message: "www.noblecall.org\nBuild: " + version,
		buttonNames: [L('button_suggest'), L('button_ok')]});
	    dlg.addEventListener('click', function (e) {
		if (e.index == 0) {
		    var emailDialog = Ti.UI.createEmailDialog();
		    emailDialog.subject = "Noble Call Tools Bug or Suggestion";
		    emailDialog.toRecipients = ['noblecall@orthlieb.com'];
		    emailDialog.messageBody = 'Please detail your suggestion or bug report below:';
		    emailDialog.open();
		}
    });
    dlg.show();  
};

SettingsPanel.prototype.open = open;

module.exports = SettingsPanel;
