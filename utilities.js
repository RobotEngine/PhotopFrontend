let statuses = { 0: ["Offline", "#a4a4a4"], 1: ["Online", "#00FC65"], 2: ["In Group", "#5ab7fa"] };

let supportedImageTypes = ["png", "jpeg", "jpg", "webp", "svg+xml", "tiff", "tif", "heic", "heif"]; //, "gif"

let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

let roleTypes = {
  // Role colors are determined by selecting one prominent color from the Google version of the emoji mixed with #505068.
  "Owner": ["👑", { CanDeletePosts: true, CanDeleteChats: true, CanBanUsers: true, CanUnbanUser: true }, "#A88D48", "{user} created Photop!"],
  "Admin": ["🔨", { CanDeletePosts: true, CanDeleteChats: true, CanBanUsers: true, CanUnbanUser: true }, "#b58c42", "{user} manages the moderators and trial moderators on Photop."],
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