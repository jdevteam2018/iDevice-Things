class PwnageInstance {
	constructor() {
		this._ = {
			showCredits: (evt => {
				if(evt && evt.preventDefault) {
					evt.preventDefault();
				};
				let show = document.querySelector('#credits').style.display != 'block';
				document.querySelector('#credits').style.display = 
					show ? 'block' : 'none';
			}).bind(this),
			addDevice: (evt => {
				if(evt && evt.preventDefault) {
					evt.preventDefault();
				};
				let device = navigator.usb.requestDevice({filters: []});
				device.then(()=>{
					this._.notify([
						{"color": "#070", "text": " &zwj; &zwj; Successfully added trusted device!<br/>", "bold": true},
						{"color": "#DDE", "text": "Please refresh this page to continue.", "bold": false}
					], false);
					setTimeout(()=>{
						document.location.reload();
					}, 2000);
				});
			}).bind(this),
			pwnDevice: (evt => {
				if(evt && evt.preventDefault) {
					evt.preventDefault();
				};
				// TODO: Add device detection/selection
				this.pwnDevices("k48ap");
			}).bind(this),
			sendRamdisk: (evt => {
				if(evt && evt.preventDefault) {
					evt.preventDefault();
				};
				// TODO: Add device detection/selection
				this.sendRamdisks("k48ap");
			}).bind(this),
			notify: ((arr, preserveDisp) => {
				let disp = document.querySelector('#display');
				if(!preserveDisp) disp.innerHTML = "";
				arr.forEach(elm => {
					let child = document.createElement('a');
					child.style.fontWeight = elm.bold ? "bold" : "regular";
					child.style.color = elm.color;
					child.innerHTML = elm.text;
					if('href' in elm) child.href = elm.href;
					disp.appendChild(child);
				});
			}).bind(this),
			colors: {
				"GREEN": "#090",
				"LIGHT_BLUE": "#CCF",
				"WHITE": "#DDE"
			}
		};
		this.getUI().notify([
			{"color": this.getUI().colors.GREEN, "text": " &zwj; &zwj; Fully loaded!<br/>", "bold": true},
			{"color": this.getUI().colors.WHITE, "text": "Use the buttons in the menu bar above to continue.<br/><br/><br/>", "bold": false},
			{"color": this.getUI().colors.WHITE, "text": " &zwj; &zwj; Credits: <br/>", "bold": false},
			{"color": this.getUI().colors.LIGHT_BLUE, "text": "@iPhoneGuy1101", "bold": false, "href": "https://www.twitter.com/iphoneguy1101"},
			{"color": this.getUI().colors.WHITE, "text": ": Idea, the UI, and device pairing/pwning (aka the crappy code) <br/>", "bold": false},
			{"color": this.getUI().colors.LIGHT_BLUE, "text": "@userlandkernel", "bold": false, "href": "https://www.twitter.com/userlandkernel"},
			{"color": this.getUI().colors.WHITE, "text": ": Understanding of iDevice USB protocol and the entirity of the SSH connection code (aka the good code) <br/>", "bold": false}
		], false);
	}
	getDevices() {
		return navigator.usb.getDevices();
	}
	getUI() {
		return this._;
	}
	downloadFileSync(url) {
		let xhr = new XMLHttpRequest();
		xhr.open("GET", url, false);
		xhr.send();
		return xhr.responseText;
	}
	async sendFileToDevices(data) {
		// TODO: Add check DFU vs Recovery soon
		// Split into chunks of 0x800 (2048) bytes
		// This would be 0x8000 (32768) bytes in recovery
		let chunks = data.match(/.{1,2048}/g);
		// Note: I hate promises in JavaScript
		this.getDevices().then(devices => {
			devices.forEach(async dvc => {
				await dvc.open();
				if(!dvc.configuration) {
					await dvc.selectConfiguration(1);
				};
				await dvc.claimInterface();
				// TODO: Figure out what to do here
				await device.controlTransferOut({
						requestType: 'vendor',
						recipient: 'interface',
						request: 0x01,
						value: 0x0013,
						index: 0x0001
				});
				chunks.forEach(async chunk => {
					await dvc.transferOut(dvc, chunk);
				});
				await dvc.close();
			});
		});
	}
	pwnDevices(model) {
		this.getUI().notify([
			{"color": "#DDE", "text": "Pwning DFU...<br/><br/>", "bold": false},
			{"color": "#DDE", "text": "Downloading Pwned iBSS for " + model + "...<br/>", "bold": false}
		], false);
		let iBSS = this.downloadFileSync(`pwned/${model}/iBSS.${model}.pwn.dfu`);
		this.getUI().notify([
			{"color": this.getUI().colors.GREEN, "text": `Done downloading Pwned iBSS for ${model}!<br/>`, "bold": false}
		], true);
		this.getUI().notify([
			{"color": "#DDE", "text": `Downloading Pwned iBEC for ${model}...<br/>`, "bold": false}
		], true);
		let iBEC = this.downloadFileSync(`pwned/${model}/iBEC.${model}.pwn.dfu`);
		this.getUI().notify([
			{"color": this.getUI().colors.GREEN, "text": `Done downloading Pwned iBEC for ${model}!<br/>`, "bold": false},
			{"color": this.getUI().colors.WHITE, "text": "Sending files to devices...<br/>", "bold": false}
		], true);
		this.sendFileToDevices(iBSS).then((evt=>{
			this.sendFileToDevices(iBEC).then((evt)=>{
				this.getUI().notify([
					{"color": this.getUI().colors.GREEN, "text": "Sent files to device(s)!"}
				], true);
			});
		}).bind(this));
	}
	sendRamdisks(model) {
		// TODO: Add this feature
		this.getUI().notify([
			{"color": "#DDE", "text": "Sending SSH Ramdisk...<br/><br/>", "bold": false},
			{"color": "#F22", "text": "404 Feature Not Found<br/>", "bold": false}
		], false);
		setTimeout((xD)=>{
			throw new Error("ReferenceError: You (yes, you) are not defined");
		}, 3000);
	}
}

let Pwnage;
window.onload = evt => {
	Pwnage = new PwnageInstance();
};