let statuses = { 0: ["Offline", "#a4a4a4"], 1: ["Online", "#00FC65"], 2: ["In Group", "#5ab7fa"] };

let supportedImageTypes = ["png", "jpeg", "jpg", "webp", "svg+xml", "tiff", "tif", "heic", "heif"]; //, "gif"

let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

let roleTypes = {
  // Role colors are determined by selecting one prominent color from the Google version of the emoji mixed with #505068.
  "Owner": ["👑", { CanDeletePosts: true, CanDeleteChats: true, CanBanUsers: true, CanUnbanUser: true }, "#A88D48", "{user} created Photop!"],
  "Admin": ["🔨", { CanDeletePosts: true, CanDeleteChats: true, CanBanUsers: true, CanUnbanUser: true }, "#849AA9", "{user} manages the moderators and trial moderators on Photop."],
  "Moderator": ["🛡️", { CanDeletePosts: true, CanDeleteChats: true, CanBanUsers: true }, "#3F6479", "{user} scans posts and profiles for rule-breaking content."],
  "Trial Moderator": ["🛡️", { CanDeletePosts: true, CanDeleteChats: true }, "#888888", "{user} is a moderator in training and scans posts and profiles for rule-breaking content.", "filter: contrast(0) brightness(1.5);"],
  "Developer": ["👨‍💻", {}, "#63A835", "{user} helps develop new features and squash bugs."],
  "Contributor": ["🔧", {}, "#697F94", "{user} contributed to Photop in the past in some way."],
  "Bug Hunter": ["🐛", {}, "#849040", "{user} discovered a large vulernability in Photop and reported it to the owner."],
  "Verified": ["📢", {}, "#A2494F", "{user} is a notable, significant person."],
  "Partner": ["📷", {}, "#395568", "{user} is partnering with Photop."],
  "Tester": ["🧪", {}, "#288887", "{user} created their account during the inital testing phase."],
  "Bot": ["🤖", {}, "#8B3945", "{user} is a bot. Beep boop!"],
  "Premium": ["⭐", {}, "#d94abe", "{user} is subscribed to Photop Premium.", "background: linear-gradient(315deg, #ec24ae 25%, #d90d9a 50%, #f929b9 50%, #f16dc8 75%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"]
};
let roleKeyTypes = Object.keys(roleTypes);

let wireframes = {};
let pages = {};
let modules = {};

let convos = {};
let account = {};
let groups = {};
let homeView = "active";
let userID = null;

let mainLoadActions = [];
let subscribes = [];

let body = findC("body");
let app = findC("app");
let main = findC("main");
let pageHolder = findC("pageHolder");
let sidebarButtons = findI("sidebarButtons");

let isMobile = false;

let tempListeners = [];
function tempListen(parent, listen, runFunc, extra) {
  parent.addEventListener(listen, runFunc, extra);
  tempListeners.push({ parent: parent, name: listen, listener: runFunc });
}
function removeTempListeners() {
  for (let i = 0; i < tempListeners.length; i++) {
    let remEvent = tempListeners[i];
    if (remEvent.parent != null) {
      remEvent.parent.removeEventListener(remEvent.name, remEvent.listener);
    }
  }
}

function copyClipboardText(text) {
  navigator.clipboard.writeText(text).then(function() {
    //console.log('Async: Copying to clipboard was successful!');
  }, function(err) {
    console.error('Async: Could not copy text: ', err);
  });
}
function clipBoardRead(e) {
  e.preventDefault();
  document.execCommand('inserttext', false, e.clipboardData.getData("text/plain"));
}

function findC(name) {
  return document.getElementsByClassName(name)[0];
}
function findI(name) {
  return document.getElementById(name);
}

let currentPage = "";
let currentPageWithSearch = window.location.search;
let currentlyLoadingPages = {};
async function setPage(name) {
  let loadedPage = currentPage;
  currentPage = name;
  app.style.width = "850px";
  if (loadedPage != name) {
    pageHolder.innerHTML = "";
  }
  removeTempListeners();
  for (let i = 0; i < subscribes.length; i++) {
    subscribes[i].close();
  }
  subscribes = [];
  if (window.closeMobileChat != null) {
    closeMobileChat();
  }
  if (wireframes[name] == null) {
    if (currentlyLoadingPages[name] != null) {
      return;
    }
    currentlyLoadingPages[name] = "";
    await loadScript("./pages/" + name + ".js");
    delete currentlyLoadingPages[name];
  }
  if (name != "home" || loadedPage != name) {
    pageHolder.innerHTML = wireframes[name];
  }
  if (pages[name] != null) {
    window.location.hash = "#" + name;
    await pages[name]();
    let title = name;
    title = name.charAt(0).toUpperCase() + name.slice(1);
    document.title = title + " | Photop";
  }
}
async function refreshPage() {
  pageHolder.innerHTML = wireframes[currentPage] || "";
  removeTempListeners();
  for (let i = 0; i < subscribes.length; i++) {
    subscribes[i].close();
  }
  subscribes = [];
  if (window.closeMobileChat != null) {
    closeMobileChat();
  }
  if (wireframes[currentPage] == null) {
    if (currentlyLoadingPages[currentPage] != null) {
      return;
    }
    currentlyLoadingPages[currentPage] = "";
    await loadScript("./pages/" + currentPage + ".js");
    delete currentlyLoadingPages[currentPage];
  }
  if (pages[currentPage] != null) {
    window.location.hash = "#" + currentPage;
    await pages[currentPage]();
    let title = currentPage;
    title = currentPage.charAt(0).toUpperCase() + currentPage.slice(1);
    document.title = title + " | Photop";
  }
}
function goBack() {
  history.back();
}

async function getModule(name) {
  if (modules[name] == null) {
    await loadScript("./modules/" + name + ".js");
  }
  return modules[name];
}

function createElement(name, type, parent, attributes) {
  if (attributes == null) {
    attributes = [];
  }

  if (parent == null) {
    return null;
  } else {
    if (typeof parent === "string" || typeof parent === "number") {
      parent = findC(parent);
    }
  }

  let newElement = document.createElement(type);

  if (parent === null) {
    document.body.appendChild(newElement);
  } else {
    parent.appendChild(newElement);
  }

  let setStyle = "";
  let keys = Object.keys(attributes);
  for (let i = 0; i < keys.length; i++) {
    setStyle += keys[i] + ": " + attributes[keys[i]] + "; ";
  }
  newElement.setAttribute("style", setStyle);
  newElement.setAttribute("class", name);

  return newElement;
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getScript(url) {
  return document.querySelector("[src='" + url + "'");
}
async function loadScript(url) {
  return new Promise(function(resolve) {
    let loaded = getScript(url);
    if (loaded) {
      if (loaded.hasAttribute("done")) {
        resolve(loaded);
      } else {
        loaded.addEventListener("load", function() {
          resolve(loaded);
        });
      }
      return;
    }
    let newScript = document.createElement('script');
    newScript.addEventListener("load", function() {
      newScript.setAttribute("done", "");
      resolve(newScript);
    });
    newScript.src = url;
    document.body.appendChild(newScript);
  });
}

function getParam(key) {
  let queryString = window.location.search;
  let urlParams = new URLSearchParams(queryString);
  return urlParams.get(key);
}
function modifyParams(key, value) {
  const Url = new URL(window.location);
  if (value != null) {
    Url.searchParams.set(key, value);
  } else {
    Url.searchParams.delete(key);
  }
  window.history.pushState({}, '', Url);
}

let localDataStore = {};
function setLocalStore(key, data) {
  localDataStore[key] = data;
  try {
    localStorage.setItem(key, data);
  } catch {}
}
function getLocalStore(key) {
  let result = localDataStore[key];
  try {
    result = localStorage.getItem(key);
  } catch {}
  return result;
}
function removeLocalStore(key) {
  if (localDataStore[key]) {
    delete localDataStore[key];
  }
  try {
    localStorage.removeItem(key);
  } catch {}
}

let epochOffset = 0;
function getEpoch() {
  return Date.now() + epochOffset;
}

let sentFirstReq = false;
async function sendRequest(method, path, body, noFileType) {
	if (account.banned == true && path != "mod/appeal") {
		return [0, "Account Banned"];
	}
	let hadSentFirst = sentFirstReq;
	sentFirstReq = true;
	try {
		let sendData = {
			method: method,
			headers: {
				"cache": "no-cache"
			}
		};
		if (noFileType != true) {
			sendData.headers["Content-Type"] = "text/plain";
		}
		if (body != null) {
			if (typeof body == "object" && body instanceof FormData == false) {
				body = JSON.stringify(body);
			}
			sendData.body = body;
		}
		let token = getLocalStore("token");
		if (token != null) {
			token = JSON.parse(token);
			if (token.expires < Math.floor(getEpoch() / 1000)) {
				token = await renewToken() || token;
			}
			let sendUserID = userID || getLocalStore("userID");
			if (sendUserID != null) {
				sendData.headers.auth = sendUserID + ";" + token.session;
			}
		}
		let response = await fetch(config.server + path, sendData);
		if (response.headers.has("date") == true) {
			let serverTimeMillisGMT = new Date(response.headers.get("date")).getTime();
			let localMillisUTC = new Date().getTime();
			epochOffset = serverTimeMillisGMT - localMillisUTC;
		}
		switch (response.status) {
			case 401:
				await renewToken();
				break;
			case 429:
				(await getModule("modal"))("Rate Limited", await response.text(), [["Okay", "var(--grayColor)"]]);
				break;
			case 418:
				account.banned = true;
				let data = JSON.parse(await response.text());
				(await getModule("modal"))("Account Banned", `Oh no! It appears you have broken a Photop rule resulting in your account being banned.<br><br><b>Account:</b> ${data.account}<br><b>Reason:</b> ${data.reason}<br><b>Expires:</b> ${(data.expires == "Permanent" ? "Permanent" : formatFullDate(data.expires * 1000))}${(data.terminated == true ? "<br><b>Terminated:</b> Yes" : "")}${!data.appealed ? `<br><div id="banAppealInput" contenteditable class="textArea" placeholder="Appeal your Ban"></div><button id="submitAppealButton">Submit</button>` : ""}`);
				let appealSend = findI("submitAppealButton");
				if (appealSend != null) {
					appealSend.addEventListener("click", async function() {
						let appealInput = findI("banAppealInput");
						if (appealInput.textContent.length < 1) {
							(await getModule("modal"))("Write an Appeal", "You must write an appeal before submitting it.", [["Okay", "var(--grayColor)"]]);
							return;
						}
						let [code] = await sendRequest("POST", "mod/appeal", { appeal: appealInput.textContent.substring(0, 250) });
						if (code == 200) {
							appealInput.remove();
							appealSend.remove();
							(await getModule("modal"))("Appeal Sent", "We've recieved your appeal and will review it as soon as possible.", [["Okay", "var(--grayColor)"]]);
						}
					});
				}
				break;
			default:
				return [response.status, await response.text()];
		}
		return [0, "Request Refused"];
	} catch (err) {
		if (hadSentFirst == false) {
			findI("backBlur" + (await getModule("modal"))("Error Reaching Server", "Oh no! We encountered an error sending your request through the pipes of the internet. Please try again later.", [["Retry", "var(--themeColor)", function() { location.reload(); }]])).style.zIndex = 999999;
		}
		console.log("FETCH ERROR: " + err);
		return [0, "Fetch Error"];
	}
}

function getObject(arr, field) {
	if (arr == null) {
		return {};
	}
	let returnObj = {};
	for (let i = 0; i < arr.length; i++) {
		let setObject = arr[i];
		returnObj[setObject[field]] = setObject;
	}
	return returnObj;
}
function handleIntersection(entries, observer) {
	 entries.forEach(entry => {
		if (entry.isIntersecting) {
			entry.target.style.visibility = 'visible';
		} else {
			entry.target.style.visibility = 'hidden';
		}
	});
}

function decideProfilePic(data) {
	let ending = "DefaultProfilePic";
	if (data != null && data.Settings != null && data.Settings.ProfilePic != null) {
		ending = data.Settings.ProfilePic;
	}
	return config.assets + "ProfileImages/" + ending;
}
function changeCounter(el, num) {
	let _x = el;
	let oldNum = parseInt(_x.getAttribute("realnum"), 10);
	num = parseInt(num, 10);
	_x.setAttribute("realnum", num);
	_x.setAttribute("title", num.toLocaleString());
	if (abbr(oldNum) != num) {
		_x.innerHTML = (oldNum < num ? abbr(oldNum) + "<br>" + abbr(num) : abbr(num) + "<br>" + abbr(oldNum));
		_x.style.marginTop = (oldNum < num ? "0" : "-15px");
		setTimeout(function () {
			_x.style.transition = "0.2s";
			_x.style.marginTop = (oldNum < num ? "-15px" : "0");
			setTimeout(function () {
				_x.innerHTML = abbr(num);
				_x.style.transition = "0s";
				setTimeout(function () {
					_x.style.marginTop = "0";
				}, 16);
			}, 200);
		}, 16);
	}
}

async function loadNeededModules() {
	window.showPopUp = await getModule("modal");
	window.webModal = await getModule("webmodal");
	window.showDropdown = await getModule("dropdown");
	window.showPreview = await getModule("profilepreview");
}

function randomString(l) {
	var s = "";
	var randomchar = function () {
		var n = Math.floor(Math.random() * 62);
		if (n < 10) return n; //1-10
		if (n < 36) return String.fromCharCode(n + 55); //A-Z
		return String.fromCharCode(n + 61); //a-z
	};
	while (s.length < l) s += randomchar();
	return s;
}
async function openLoginModal(page, title) {
	let randomStr = randomString(20);
	setLocalStore("state", randomStr);
	window.loginWindow = (await getModule("webmodal"))("https://exotek.co/login?client_id=" + config.exotek_id + "&redirect_uri=" + encodeURIComponent(window.location.href) + "&response_type=code&scope=userinfo&state=" + randomStr + "#" + page, title);
}

function hasPremium() {
	if (account.Premium != null && Math.floor(getEpoch() / 1000) < account.Premium.Expires) {
		if (!supportedImageTypes.includes("gif")) {
			supportedImageTypes.push("gif");
		}
		return true;
	}
	if (supportedImageTypes.includes("gif")) {
		supportedImageTypes.splice(supportedImageTypes.indexOf("gif"), 1);
	}
	return false;
}
function timeSince(time, long) {
	let calcTimestamp = Math.floor((Date.now() - time) / 1000);
	if (calcTimestamp < 1) {
		calcTimestamp = 1;
	}
	let amountDivide = 1;
	let end = (long ? 'Second' : 's');
	if (calcTimestamp > 31536000 - 1) {
		amountDivide = 31536000;
		end = (long ? 'Year' : 'y');
	} else if (calcTimestamp > 2592000 - 1) {
		amountDivide = 2592000;
		end = (long ? 'Month' : 'mo');
	} else if (calcTimestamp > 604800 - 1) {
		amountDivide = 604800;
		end = (long ? 'Week' : 'w');
	} else if (calcTimestamp > 86400 - 1) {
		amountDivide = 86400;
		end = (long ? 'Day' : 'd');
	} else if (calcTimestamp > 3600 - 1) {
		amountDivide = 3600;
		end = (long ? 'Hour' : 'h');
	} else if (calcTimestamp > 60 - 1) {
		amountDivide = 60;
		end = (long ? 'Minute' : 'm');
	}
	let timeToSet = Math.floor(calcTimestamp / amountDivide);
	if (timeToSet > 1 && long) {
		end += 's';
	}
	if (long == true) {
		return timeToSet + " " + end + " Ago";
	} else {
		return timeToSet + end;
	}
}

function cleanString(str) {
	return str.replace(/\>/g, "&#62;").replace(/\</g, "&#60;");
}

/* Maintain Cursor Position */
function createRange(node, chars, range) {
	if (!range) {
		range = document.createRange()
		range.selectNode(node);
		range.setStart(node, 0);
	}

	if (chars.count === 0) {
		range.setEnd(node, chars.count);
	} else if (node && chars.count > 0) {
		if (node.nodeType === Node.TEXT_NODE) {
			if (node.textContent.length < chars.count) {
				chars.count -= node.textContent.length;
			} else {
				range.setEnd(node, chars.count);
				chars.count = 0;
			}
		} else {
			for (let lp = 0; lp < node.childNodes.length; lp++) {
				range = createRange(node.childNodes[lp], chars, range);
				if (chars.count === 0) {
					break;
				}
			}
		}
	}

	return range;
};
function setCurrentCursorPosition(element, chars) {
	let selection = window.getSelection();
	let range = null;
	if (chars == "END") {
		range = createRange(element.lastChild);
	} else {
		range = createRange(element, { count: chars });
	}
	if (range != null) {
		range.collapse(false);
		selection.removeAllRanges();
		selection.addRange(range);
	}
};
function getCurrentCursorPosition(element) {
	let position = 0;
	const isSupported = typeof window.getSelection !== "undefined";
	if (isSupported) {
		const selection = window.getSelection();
		if (selection.rangeCount !== 0) {
			const range = window.getSelection().getRangeAt(0);
			const preCaretRange = range.cloneRange();
			preCaretRange.selectNodeContents(element);
			preCaretRange.setEnd(range.endContainer, range.endOffset);
			position = preCaretRange.toString().length;
			if (preCaretRange.endContainer.textContent == "") {
				position = "END";
			}
		}
	}
	return position;
}

function setUsernameRole(textHolder, userData, fontSize, limitSingleBadge) {
	if (textHolder == null) {
		return;
	}
	let fullString = "";
	let roles = [];
	if (userData.Role != null) {
		roles = userData.Role;
	}
	if (Array.isArray(roles) == false) {
		roles = [roles];
	}
	if (userData.Premium != null && Math.floor(getEpoch() / 1000) < userData.Premium.Expires) {
		roles.push("Premium");
	}
	if (fontSize != null) {
		fullString += "<div style='display: flex; align-items: center; white-space: pre'>";
	}
	if (fontSize == null || limitSingleBadge == true) {
		roles = [roles[0]];
	}
	for (let i = 0; i < roles.length; i++) {
		let RoleName = roles[i];
		let AddRole = roleTypes[RoleName];
		if (AddRole != null) {
			let SetString = "";
			//let RoleIconURL = "./Images/RoleIcons/" + RoleName + ".png";
			if (fontSize == null) {
				//FontSize = getCSS(TextHolder, "font-size").replace(/px/g, "");
				//SetString = "<span style='height: " + (FontSize-4) + "px; padding: 0px 2px 0px 2px; margin-right: 3px; border-radius: 6px; content: url(" + RoleIconURL + ")' title='" + RoleName + "'></span>";
				SetString = "<span style='background-color: #505068; padding: 0px 2px 0px 2px; margin-right: 6px; border-radius: 6px' title='" + RoleName + "'>" + AddRole[0] + "</span>";
			} else {
				SetString = "<span style='background-color: #505068; padding: 0px 2px 0px 2px; margin-right: 6px; border-radius: 6px; font-size: " + fontSize + "' title='" + RoleName + "'>" + AddRole[0] + "</span>";
			}
			fullString += SetString;
		}
	}
	fullString += userData.User;
	if (fontSize != null) {
		fullString += "</div>";
	}
	textHolder.innerHTML = fullString;
}
function getRoleHTML(roleUser, max, isProfile) {
	let roleHTML = "";
	let roles = [];
	let maxRoles = (max || 1);
	if (roleUser.Role != null) {
		roles = roleUser.Role;
	}
	if (Array.isArray(roles) == false) {
		roles = [roles];
	}
	roles = [...roles];
	if (roleUser.Premium != null && Math.floor(getEpoch() / 1000) < roleUser.Premium.Expires) {
		roles.push("Premium");
	}
	for (let i = 0; i < Math.min(roles.length, maxRoles); i++) {
		roleHTML += addRole(roles[i], isProfile);
		/*
		roleHTML += `<span class="roleEmoji" title="${roles[i]}"><img src = "../Images/RoleIcons/${roles[i]
			}.png" class = "profileRole"></span> `;
		*/
	}
	return roleHTML;
}
function addRole(type, isProfile) {
	var thisRandom = Math.random();
	return `<span class="roleEmoji${isProfile ? " onProfile" : ""}" style="background: linear-gradient(315deg, #505068, ${roleTypes[type][2]})" title="${type}" id="${"role" + thisRandom}"><span style="${roleTypes[type][4] || ""}" onclick="if (${isProfile}) {showPopUp('${type}', '${roleTypes[type][3]}'.replace(\'{user}\', findI(\'profileUsername\').textContent), [['Okay', 'var(--grayColor)']])}">${roleTypes[type][0]}</span></span> `;
}
function checkPermision(roles, permision) {
	if (roles != null && permision != null) {
		let permisions = {};
		if (Array.isArray(roles) == true) {
			for (let i = 0; i < roles.length; i++) {
				let roleData = roleTypes[roles[i]];
				if (roleData != null) {
					roleData = roleData[1];
					let keys = Object.keys(roleData);
					for (let p = 0; p < keys.length; p++) {
						if (permisions[keys[p]] == null || permisions[keys[p]] == false) {
							permisions[keys[p]] = roleData[keys[p]];
						}
					}
				}
			}
		} else {
			permisions = roleTypes[roles][1];
		}
		return permisions[permision] == true;
	}
	return false;
}

function promptLogin(desc) {
	showPopUp(
		"It's Better Together",
	 	desc,
		[
		["Login", "var(--signInColor)", function() {
			openLoginModal("signin", "Login");
		}
		], ["Later", "var(--grayColor)"]]
	);
}

function abbr(num) {
	let x;
	if (num >= 100000000000) {
		return Math.floor(num / 1000000000) + "B";
	} else if (num >= 10000000000) {
		x = Math.floor((num / 1000000000) * 10) / 10;
		return x.toPrecision(3) + "B";
	} else if (num >= 1000000000) {
		x = Math.floor((num / 1000000000) * 100) / 100;
		return x.toPrecision(3) + "B";
	} else if (num >= 100000000) {
		return Math.floor(num / 1000000) + "M";
	} else if (num >= 10000000) {
		x = Math.floor((num / 1000000) * 10) / 10;
		return x.toPrecision(3) + "M";
	} else if (num >= 1000000) {
		x = Math.floor((num / 1000000) * 100) / 100;
		return x.toPrecision(3) + "M";
	} else if (num >= 100000) {
		return Math.floor(num / 1000) + "K";
	} else if (num >= 10000) {
		x = Math.floor((num / 1000) * 10) / 10;
		return x.toPrecision(3) + "K";
	} else if (num >= 1000) {
		x = Math.floor((num / 1000) * 100) / 100;
		return x.toPrecision(3) + "K";
	} else {
		return num;
	}
}

function createTooltip(parent, text) {
	let tooltip = createElement("tooltip", "div", parent);
	tooltip.textContent = text;
}

function blockUser(id, name) {
	showPopUp(`Block ${name}?`, `Blocking ${name} will prevent you from seeing their content. It won't prevent ${name} from seeing yours.`, [["Block", "#FF8652", async function() {
		let [code, response] = await sendRequest("PUT", "user/block?userid=" + id);
		if (code == 200) {
			if (currentPage != "profile") {
				refreshPage();
			} else {
				setPage("home");
			}
		} else {
			showPopUp("An Error Occured", response, [["Okay", "var(--grayColor)"]]);
		}
	}], ["Wait, no", "var(--grayColor)"]]);
}

function formatDate(time) {
	let d = new Date(time + epochOffset);
	return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}
function formatUsername(input) {
	return input.replace(/[^A-Za-z0-9_\-]/g, "").substring(0, 20);
}
function verifyUsername(input) {
	let premium = hasPremium();
	let limit = premium ? 1 : 3
	return ((formatUsername(input).length >= limit) && formatUsername(input) == input);
}
function setCSSVar(variable, newValue) {
	let root = document.documentElement;
	root.style.setProperty(variable, newValue);
}

function formatAMPM(date) {
	let hours = date.getHours();
	let minutes = date.getMinutes();
	let ampm = hours >= 12 ? 'PM' : 'AM';
	hours = hours % 12;
	hours = hours ? hours : 12;
	minutes = minutes.toString().padStart(2, '0');
	let strTime = hours + ':' + minutes + ' ' + ampm;
	return strTime;
}
function formatFullDate(time) {
	let date = new Date(time + epochOffset);
	let splitDate = date.toLocaleDateString().split("/");
	return week[date.getDay()] + ", " + months[splitDate[0] - 1] + " " + splitDate[1] + ", " + splitDate[2] + " at " + formatAMPM(date);
}
function premiumPerk(text) {
	return `<div class="premiumPerkAd">
	<div>
		<img src="https://exotek.co/images/photop/premium.svg" class="premiumPerkIcon">
	</div>
	<div style="margin-left: 5px;">
		<div class="premiumPerkTitle">Premium Perk</div>
		<div class="premiumPerkDesc">${text}</div>
		<button class="premiumAdAction" onclick="setPage('premium');findC('backBlur').remove();">Learn More</button>
	</div>
	</div>`;
}