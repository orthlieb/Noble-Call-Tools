var log = require('lib/logger');
var _ = require('lib/underscore');
var style = require('ui/style');

/**
 * Create a Picker View which consists of a toolbar with a Cancel/Done button and a picker control.
 * @param {TiUIPickerArgs}  args    Arguments for creating the picker (location, color, etc). Should include a data property which is 
 *                                  an array of tuple objects. Each object should have an id which is the internal value of the selection,
 *                                  and a title, which is the external string to present to the user (localized).
*/
function PickerView(/*TiUIPickerArgs*/args) {
   var self = this; 
    self._uniqueID = _.uniqueId("pickerview.");
    self._data = args.data;
    
   // The picker view holds the picker and toolbar.
    self._view = Ti.UI.createView({
        left: 0,
        bottom: Ti.Platform.displayCaps.platformHeight,
        height: Ti.UI.SIZE,
        width: Ti.UI.FILL,
        backgroundColor: style.win.backgroundColor,
        layout: 'vertical'
    });
    
    // The toolbar holds a done and a cancel button.
    var toolbar = Titanium.UI.createView({
        top: 0,
        left: 0,
        width: Ti.UI.FILL,
        height: style.button.height + 2 * style.gutter.size, 
        barColor: style.win.barColor
    });
    self._view.add(toolbar);    
    
    var cancel =  Ti.UI.createButton({
        top: style.gutter.size,
        left: style.gutter.size,
        width: Ti.UI.SIZE,
        height: style.button.height,
        title: L('button_cancel')
    });
    toolbar.add(cancel);

    var done = Ti.UI.createButton({
        top: style.gutter.size,
        right: style.gutter.size,
        width: Ti.UI.SIZE,
        height: style.button.height,
        title: L('button_done')
    });
    toolbar.add(done);

    // The picker control
    self._picker = Titanium.UI.createPicker(_.extend(args,{
        top: 0,
        left: 0,
        width: Ti.UI.FILL,
        height: style.picker.height
    }));
    self._picker.selectionIndicator = true;
     // Load up the picker.
    var rows = [];
    for (var i = 0; i < self._data.length; i++) {
        var pickerRow = Titanium.UI.createPickerRow(self._data[i]);
        rows.push(pickerRow);
    }
    self._picker.add(rows);
    self._view.add(self._picker);

    done.addEventListener('click', function doneClick(e) {
        var row = self._picker.getSelectedRow(0);
        self.selectedID = row.id;
        self.fireEvent('change', { source: self, type: 'change', value: self.selectedID });
        self.close();
     });

    cancel.addEventListener('click', function cancelClick(e) { 
        self.close();
    });

    return self;    
}

/**
 * Opens the Picker View.
 * @param {TiUIWindow}  parent       Parent window of the picker.
 * @param {String}      selectedID   The initial selection id of the picker.
*/
function PickerViewOpen(/*TiUIWindow*/parent, /*string*/selectedID) {
    var selected = 0;
    var count = 0;
 
    // Select the right value in the picker.
    this.selectedID = selectedID;
    for (var i = 0; i < this._data.length; i++) {
        if (selectedID == this._data[i].id) {
            selected = i;
            break;
        }
     }
    this._picker.setSelectedRow(0, selected);

    // Animate into view.
    this._view.bottom = -this._view.size.height;
    parent.add(this._view);
    this._view.animate({ bottom: 0 });
    this.fireEvent('open', { source: this, type: 'open' });
}

function PickerViewClose() {
    this._view.animate({ bottom: -this._view.size.height });
    this._view.parent.remove(this._view);
    this.fireEvent('close', { source: this, type: 'close' });
}

function PickerViewAddEventListener(eventname, callback) {
    Ti.App.addEventListener(this._uniqueID + ":" + eventname, callback);   
}

function PickerViewRemoveEventListener(eventname, callback) {
    Ti.App.removeEventListener(this._uniqueID + ":" + eventname, callback);   
}

function PickerViewFireEvent(eventname, data) {
    log.info(this._uniqueID + " " + eventname + " value=" + data.value);
    Ti.App.fireEvent(this._uniqueID + ":" + eventname, data); 
}

// External interface
// Public Properties: selectedID
PickerView.prototype.open = PickerViewOpen;
PickerView.prototype.close = PickerViewClose;
PickerView.prototype.addEventListener = PickerViewAddEventListener;
PickerView.prototype.removeEventListener = PickerViewRemoveEventListener;
PickerView.prototype.fireEvent = PickerViewFireEvent;
module.exports = PickerView;