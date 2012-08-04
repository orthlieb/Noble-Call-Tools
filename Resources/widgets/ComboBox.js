var log = require('lib/logger');
var style = require('ui/style');
var _ = require('lib/underscore');
// Combo box is a subclass of a textfield on iOS combined with a picker. On other platforms it is a first class combo box.
// @param {Object}  args        List of properties for the text field (size, color, etc)
// @param {Array}   data        Array of objects, each object should have an id and a text description, 
//                              E.g. [{ id: "one", title: "Partridge in a Pear Tree" }, {id: "two", title: "Two Calling Birds"}]
// @param {String}  selectedID  ID of the item to select in the picker as default. E.g. "one"
function ComboBox(/*TiUIWindow*/parent, /*TiUIcomboBoxArgs*/comboBoxArgs, /*Array*/data, /*String*/selectedID) {
    log.start();

    var self = this;
    self._uniqueID = _.uniqueId("combobox.");
    self.selectedID = selectedID;

    // Arguments for the text field
    comboBoxArgs.editable = false;
    // Don't want the user mucking with the text
    comboBoxArgs.value = "";
    // Populate the textfield first time through.
    for (var i = 0; i < data.length; i++) {
        if (data[i].id == self.selectedID) {
            // Value of the text field is the title. Sorry for the confusion.
            comboBoxArgs.value = data[i].title; 
            break;
        }
    }

    switch (Ti.Platform.osname) {
        case 'iphone':
        case 'ipad':

            // On iOS we can use the rightButton property.
            var buttonAttr = {
                right : 0,
                bottom : 0,
                width : Ti.UI.SIZE,
                height : Ti.UI.SIZE,
                style : Ti.UI.iPhone.SystemButton.DISCLOSURE,
                transform : Ti.UI.create2DMatrix().rotate(90)
            };
            var dropButton = Ti.UI.createButton(buttonAttr);

            // Create the textfield and add it to the view.
            comboBoxArgs.rightButton = dropButton;
            comboBoxArgs.rightButtonMode = Ti.UI.INPUT_BUTTONMODE_ALWAYS;
            self.view = Ti.UI.createTextField(comboBoxArgs);

            var PickerView = require('widgets/PickerView');
            var pickerView = new PickerView({
                data : data
            });
            pickerView.addEventListener('change', function PickerChange(e) {
                // e.value is the id of the object selected.
                if (self.selectedID != e.value) {
                    self.selectedID = e.value;
                    for (i = 0; i < data.length; i++) {
                        if (data[i].id == self.selectedID) {
                            // Value of the text field is the title. Sorry for the confusion.
                            self.view.value = data[i].title;
                            break;
                        }
                    }

                    self.fireEvent('change', {
                        source : self,
                        type : 'change',
                        value : self.selectedID
                    });
                }
            });

            var debounce = false;
            // Only bring up the picker once until closed/dismissed.
            pickerView.addEventListener('close', function PickerClose(e) {
                debounce = false;
            });

            dropButton.addEventListener('click', function DropButtonClick(e) {
                if (!debounce) {
                    debounce = true;
                    pickerView.open(parent, self.selectedID);
                }
            });
            break;
        case 'android':
        case 'mobileweb':
            // Create the picker and add it to the view.
            comboBoxArgs.selectionIndicator = true;
            comboBoxArgs.value = selectedID;
            self.view = Ti.UI.createPicker(comboBoxArgs);
            var rows = [], selected = 0, count = 0;

            // Create the picker rows.
            for ( i = 0; i < data.length; i++) {
                var pickerRow = Titanium.UI.createPickerRow(data[i]);
                if (selectedID == data[i].id) {
                    selected = i;
                }
                rows.push(pickerRow);
            }
            self.view.add(rows);
            self.view.setSelectedRow(0, selected);

            self.view.addEventListener('change', function PickerChange(e) {
                if (self.selectedID != data[e.rowIndex].id) {
                    self.selectedID = data[e.rowIndex].id;
                    self.fireEvent('change', {
                        source : self,
                        type : 'change',
                        value : self.selectedID
                    });
                }
            });
            break;
        default:
            log.assert(false, "ComboBox: cross platform code not implemented.");
            break;
    }

    self.view.addEventListener('postlayout', function viewPostLayout(e) {
        self.fireEvent('postlayout', {
            source : self,
            type : 'postlayout'
        });
    });

    return self;
}

function ComboBoxAddEventListener(eventname, callback) {
    Ti.App.addEventListener(this._uniqueID + ":" + eventname, callback);
}

function ComboBoxRemoveEventListener(eventname, callback) {
    Ti.App.removeEventListener(this._uniqueID + ":" + eventname, callback);
}

function ComboBoxFireEvent(eventname, data) {
    log.info(this._uniqueID + " " + eventname + " value=" + data.value);
    Ti.App.fireEvent(this._uniqueID + ":" + eventname, data);
}

// External interface
// Public Properties: view, selectedID
ComboBox.prototype.addEventListener = ComboBoxAddEventListener;
ComboBox.prototype.removeEventListener = ComboBoxRemoveEventListener;
ComboBox.prototype.fireEvent = ComboBoxFireEvent;
module.exports = ComboBox;
