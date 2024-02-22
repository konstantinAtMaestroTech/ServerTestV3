
let html5QrcodeScanner = new Html5QrcodeScanner(
    "reader", { fps: 10, qrbox: { width: 250, height: 250 } });

class ScanExtension extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this._onObjectTreeCreated = (ev) => this.onModelLoaded(ev.model);
        this.onScanSuccess = this.onScanSuccess.bind(this);
        this.onScanFailure = this.onScanFailure.bind(this);
    }

    load() {
        this.viewer.addEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, this._onObjectTreeCreated)
        return true;
    }

    unload() {
        this.viewer.addEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, this._onObjectTreeCreated)
        return true;
    }

    onModelLoaded(model) {}

    createToolbarButton(buttonId, buttonIconUrl, buttonTooltip) {
        let group = this.viewer.toolbar.getControl('dashboard-toolbar-group');
        if (!group) {
            group = new Autodesk.Viewing.UI.ControlGroup('dashboard-toolbar-group');
            this.viewer.toolbar.addControl(group);
        }
        const button = new Autodesk.Viewing.UI.Button(buttonId);
        button.setToolTip(buttonTooltip);
        group.addControl(button);
        const icon = button.container.querySelector('.adsk-button-icon');
        if (icon) {
            icon.style.backgroundImage = `url(${buttonIconUrl})`; 
            icon.style.backgroundSize = `24px`; 
            icon.style.backgroundRepeat = `no-repeat`; 
            icon.style.backgroundPosition = `center`; 
        }
        return button;
    }

    removeToolbarButton(button) {
        const group = this.viewer.toolbar.getControl('dashboard-toolbar-group');
        group.removeControl(button);
    }

    onToolbarCreated() {
        this._button = this.createToolbarButton('scan-button', "https://img.icons8.com/wired/64/qr-code.png", 'Turn on/off Scanning Mode');
        this._button.onClick = () => {
                $('#myModal').modal('show');
                html5QrcodeScanner.render(this.onScanSuccess, this.onScanFailure);
        };
    }

    async selectScannedElement(decodedText) {
        try {
            let idDict = await new Promise(resolve => {
                this.viewer.model.getExternalIdMapping(data => resolve(data));
            });
            let dynamicKey = decodedText;
            let objectID = idDict[dynamicKey];
    
            this.viewer.isolate(objectID);
            this.viewer.fitToView(objectID);
            console.log(`Element detected: ${objectID}`);
    
            // Select the scanned element
            let selectionName = Array();
            let selectionValue = Array();
            let selectionCategory = Array();
    
            // Select the scanned element
            this.viewer.select(objectID);
            this.viewer.getProperties(objectID, function (props) {
            // Show the native Autodesk property panel
            /* var newDiv = document.createElement("propertyPanel");
            var currentDiv = document.getElementById("div1");  */

            const propertyPanel = new Autodesk.Viewing.UI.PropertyPanel(document.getElementsByClassName("adsk-viewing-viewer touch quality-text light-theme")[0], 'PropertyPanel', 'Properties'); // This will show the property panel
            for (var i = 0; i < props.properties.length; i++) {
                propertyPanel.addProperty(props.properties[i].displayName, props.properties[i].displayValue, props.properties[i].displayCategory);
            }
            console.log(propertyPanel);
            let panel = document.getElementById('PropertyPanel');
            panel.style.display = 'block';

            let button = document.createElement('button');
            let header = document.querySelector('#header');

            button.textContent = 'Associated File';
            button.onclick = function(e) {
            // Open the file associated with the QR code in a new tab
                let popup = window.open("", "_blank");
                let imageUrl = `/temp/Saviola/Labels/${decodedText}.png`
                popup.document.write(`<img src="${imageUrl}" alt="Image for imageUrl ${imageUrl}">`);
            };
            header.appendChild(button);
            });
        } catch (err) {
            alert('Could not select element. See the console for more details.');
            console.error(err);
        }
    }
    
    onScanSuccess(decodedText, decodedResult) {
        // Handle the scanned code as you like, for example:
        console.log(`QR Code detected: ${decodedText}`);
    
        this.selectScannedElement(decodedText).then(() => {
            html5QrcodeScanner.clear().then(() => {
                // Scanner stopped, close the modal
                $('#myModal').modal('hide');
            }).catch((error) => {
                // Failed to stop the scanner, handle error
                console.log(`QR Code stop error: ${error}`);
            });
        }).catch((error) => {
            // Failed to stop the scanner, handle error
            console.log(`QR Code stop error: ${error}`);
        });
    }
        
    onScanFailure(error) {
        // You can choose to ignore failures, as they may be due to the QR code
        // not being in the frame, or other reasons like light conditions.
        console.log(`QR Code scan error: ${error}`);
    }

    
}

Autodesk.Viewing.theExtensionManager.registerExtension('ScanExtension', ScanExtension);