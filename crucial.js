let serverURL = "https://photop.exotek.co/";
//let serverURL = "http://localhost:8080/";
let assetURL = "https://photop-content.s3.amazonaws.com/";
let exotekCDN = "https://exotekcdn.exotektechnolog.repl.co/";

const socket = new SimpleSocket({
  project_id: "61b9724ea70f1912d5e0eb11",
  project_token: "client_a05cd40e9f0d2b814249f06fbf97fe0f1d5"
});

let statuses = { 0: ["Offline", "#a4a4a4"], 1: ["Online", "#00FC65"], 2: ["In Group", "#5ab7fa"] };

let supportedImageTypes = ["png", "jpeg", "jpg", "webp", "svg+xml", "tiff", "tif", "heic", "heif"]; //, "gif"

let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

let roleTypes = {
  // Role colors are determined by selecting one prominent color from the Google version of the emoji mixed with #505068.
  "Owner": ["👑", { CanDeletePosts: true, CanDeleteChats: true, CanBanUsers: true, CanUnbanUser: true }, "#A88D48"],
  "Admin": ["🔨", { CanDeletePosts: true, CanDeleteChats: true, CanBanUsers: true, CanUnbanUser: true }, "#B54242"],
  "Moderator": ["🛡️", { CanDeletePosts: true, CanDeleteChats: true, CanBanUsers: true }, "#3F6479"],
  "Trial Moderator": ["🛡️", { CanDeletePosts: true, CanDeleteChats: true }, "#888888", "filter: contrast(0) brightness(1.5);"],
  "Developer": ["👨‍💻", {}, "#63A835"],
  "Contributor": ["🔧", {}, "#697F94"],
  "Bug Hunter": ["🐛", {}, "#849040"],
  "Verified": ["📢", {}, "#A2494F"],
  "Partner": ["📷", {}, "#395568"],
  "Tester": ["🧪", {}, "#288887"],
  "Bot": ["🤖", {}, "#8B3945"],
  "Premium": ["⭐", {}, "#d94abe", "background: linear-gradient(315deg, #ec24ae 25%, #d90d9a 50%, #f929b9 50%, #f16dc8 75%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"]
};
let roleKeyTypes = Object.keys(roleTypes);

let wireframes = {};
let pages = {};
let modules = {};

let convos = {};
let account = {};
let groups = {};
let userID = null;

let mainLoadActions = [];
let subscribes = [];

let body = findC("body");
let app = findC("app");
let main = findC("main");
let pageHolder = findC("pageHolder");
let sidebarButtons = findI("sidebarButtons");

let isMobile = false;

let connectingUI = findI("connectingDisplay");
socket.onopen = function() {
  connectingUI.style.display = "none";
  recentUsers = {};
  init();
  if (currentPage != "") {
    refreshPage();
  }
}
socket.onclose = function() {
  connectingUI.style.display = "flex";
}

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
window.addEventListener("hashchange", function() {
  let pageName = window.location.hash.substring(1);
  if (currentPage == pageName.replace(/\./g, "")) {
    return;
  }
  if (pageName[pageName.length - 1] == ".") {
    history.back();
    return;
  }
  setPage(pageName);
});

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
async function renewToken() {
  let token = getLocalStore("token");
  if (token == null) {
    return;
  }
  let sendUserID = userID || getLocalStore("userID");
  let refreshToken = await fetch(serverURL + "auth/renew", {
    method: "POST",
    headers: {
      "cache": "no-cache",
      "Content-Type": "text/plain"
    },
    body: JSON.stringify({ userid: sendUserID, refresh: JSON.parse(token).refresh })
  });
  if (refreshToken.status == 200) {
    let refreshData = JSON.parse(await refreshToken.text());
    setLocalStore("token", JSON.stringify(refreshData.token));
    account.Realtime = refreshData.realtime;
    return refreshData.token;
  } else if ([404, 401].includes(refreshToken.status)) {
    removeLocalStore("userID");
    removeLocalStore("token");
    location.reload();
  }
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
    let response = await fetch(serverURL + path, sendData);
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
      findI("backBlur" + (await getModule("modal"))("Error Reaching Server", "All no! We encountered an error sending your request through the pipes of the internet. Please try again later.", [["Retry", "var(--themeColor)", function() { location.reload(); }]])).style.zIndex = 999999;
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

let accountSubscribe;
let newPostCount = 0;
let recentUserPostID;
function fetchNewPosts(post) {
  if (post != null) {
    if (post.GroupID != getParam("group")) {
      return;
    }
  }
  if (currentPage != "group") {
    setPage("home");
  } else if (window.refreshPostsFunction != null) {
    window.refreshPostsFunction();
  } else {
    setPage("group");
  }
}
let setLocation;
function setAccountSub(location) {
  setLocation = location || setLocation;
  let query = { task: "general", location: setLocation };
  if (userID != null) {
    query.userID = userID;
    query.token = account.Realtime;
    query.groups = Object.keys(groups);
    if (account.Type) {
      query.location += account.Type;
    }
  }
  if (accountSubscribe != null) {
    accountSubscribe.edit(query);
  } else {
    accountSubscribe = socket.subscribe(query, async function(data) {
      if (data.realtime != null) {
        account.Realtime = data.realtime;
        setAccountSub();
        updateProfileSub();
        return;
      }
      switch (data.type) {
        case "newpost":
          if (data.post.UserID == userID) {
            if (recentUserPostID != data.post._id) {
              recentUserPostID = data.post._id;
              fetchNewPosts(data.post);
            }
            return;
          }
          if (account.BlockedUsers != null && account.BlockedUsers.includes(data.post.UserID) == true) {
            return;
          }
          if (data.post.GroupID != null) {
            let notifHolder = findI(data.post.GroupID + "notif");
            if (notifHolder == null) {
              let groupnotif = await getModule("groupnotif");
              groupnotif({ ...groups[data.post.GroupID], _id: data.post.GroupID });
            }
            if (currentPage != "group" || getParam("group") != data.post.GroupID) {
              return;
            }
          } else if (currentPage != "home") {
            return;
          }
          let postHolder = findC("postHolder");
          if (postHolder == null) {
            return;
          }
          if (postHolder.firstChild != null && postHolder.firstChild.getAttribute("time") != null) {
            if (parseInt(postHolder.firstChild.getAttribute("time")) >= data.post.Timestamp) {
              return;
            }
          }
          let refreshPosts = findI("refreshPosts");
          if (refreshPosts == null) {
            refreshPosts = createElement("stickyContainer", "div", postHolder);
            refreshPosts.id = "refreshPosts";
            newPostCount = 0;
          }
          if (currentPage == "group") {
            refreshPosts.style.top = "62px";
          }
          if (postHolder.firstChild != null) {
            postHolder.insertBefore(refreshPosts, postHolder.firstChild);
          }
          newPostCount += 1;
          let ending = "";
          if (newPostCount > 1) {
            ending = "s";
          }
          refreshPosts.innerHTML = "Show <b>" + newPostCount + "</b> Post" + ending;
          tempListen(refreshPosts, "click", function() { fetchNewPosts(); });
          break;
        case "checked":
          let groupSeen = groups[data._id];
          if (groupSeen == null) {
            return;
          }
          groupSeen.LastChecked = data.seen;
          let notifHolder = findI(data._id + "notif");
          if (notifHolder != null) {
            notifHolder.remove();
          }
          break;
        case "join":
          groups[data.data._id] = data.data;
          let groupDisplayHolder = findC("groupsHolder-groups");
          if (groupDisplayHolder != null) {
            let thisGroup = createElement("groupSection", "div", pageHolder);
            thisGroup.innerHTML = `${data.data.Icon != null ? `<img src="${assetURL}GroupImages/${data.data.Icon}" class="groupIcon">` : ""}<div class="groupInfo"><div class="groupName">${data.data.Name}</div></div>`;
            thisGroup.id = data.data._id;
            thisGroup.setAttribute("type", "viewgroup");
            if (groupDisplayHolder.firstChild != null) {
              groupDisplayHolder.insertBefore(thisGroup, groupDisplayHolder.firstChild);
            }
          }
          setAccountSub();
          break;
        case "group":
          let group = groups[data.data._id];
          if (group == null) {
            return;
          }
          let keys = Object.keys(data.data);
          for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            group[key] = data.data[key];
          }
          if (currentPage == "group" && getParam("group") == data.data._id) {
            refreshPage();
          }
          break;
        case "leave":
          let groupRem = groups[data.groupID];
          if (groupRem != null) {
            delete groups[data.groupID];
          }
          let groupElem = findI(data.groupID);
          if (groupElem != null) {
            groupElem.remove();
          }
          if (currentPage == "group" && getParam("group") == data.groupID) {
            setPage("groups");
          }
          setAccountSub();
      }
    });
  }
}

let postUpdate;
function setPostUpdateSub() {
  let loadedPosts = [];
  let postElements = document.getElementsByClassName("post");
  for (let i = 0; i < postElements.length; i++) {
    loadedPosts.push(postElements[i].id);
  }
  let query = { task: "post", _id: loadedPosts };
  if (postUpdate != null) {
    postUpdate.edit(query);
  } else {
    postUpdate = socket.subscribe(query, function(data) {
      let post = findI(data._id);
      if (post == null) {
        return;
      }
      switch (data.type) {
        case "chatting":
          // Set chatting counter on data._id to data.chatting
          let chatAmount = post.querySelector(".postChatChatting");
          if (chatAmount) {
            changeCounter(chatAmount.querySelector("span"), data.chatting);
          }
          break;
        case "like":
          // data.userID - userID
          // data.change - Like Change (1, -1)
          let button = post.querySelector(".postButton[type='like']");
          let likeAmount = findI("likes" + post.id);
          if (data.userID == userID) {
            let icon = button.querySelector("svg").querySelector("path");
            if (data.change == 1) {
              if (button.hasAttribute("isLiked") == true) {
                return;
              }
              button.setAttribute("isLiked", "true");
              button.parentElement.style.color = "#FF5786";
              icon.setAttribute("fill", "#FF5786");
              icon.setAttribute("stroke", "#FF5786");
            } else if (data.change == -1) {
              if (button.hasAttribute("isLiked") == false) {
                return;
              }
              button.removeAttribute("isLiked");
              button.parentElement.style.removeProperty("color");
              icon.removeAttribute("fill");
              icon.setAttribute("stroke", "#999");
            }
          }
          changeCounter(likeAmount, parseInt(likeAmount.getAttribute("realnum"),10) + data.change);
          break;
        case "delete":
          if (post.style.height == "100%" && window.closeMobileChat != null) {
            closeMobileChat();
          }
          post.remove();
          break;
        case "edit":
					post.style.opacity = "1";
					post.setAttribute('text', data.text);
					const postElem = post.querySelector(".postPost");
					const postText = postElem.querySelector(".postContent").querySelector('.postText');
					const postTime = postElem.querySelector(".postUser").querySelector(".postInfo").querySelector(".postTimestamp");
					postText.innerHTML = formatText(data.text);
					postTime.innerHTML = `${timeSince(post.getAttribute("time"), true)} <span title="${formatFullDate(data.edited)}">(edited)</span>`;
					break;
      }
    });
  }
}

function decideProfilePic(data) {
  let ending = "DefaultProfilePic";
  if (data != null && data.Settings != null && data.Settings.ProfilePic != null) {
    ending = data.Settings.ProfilePic;
  }
  return assetURL + "ProfileImages/" + ending;
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

async function auth() {
  let [code, response] = await sendRequest("GET", "me?ss=" + socket.secureID);
  if (code != 200) {
    return;
  }
  updateToSignedIn(response);
}

findI("logoutB").addEventListener("click", function() {
  showPopUp("Are You Sure?", "Are you sure you want to log out?", [["Logout", "var(--themeColor)", async function() {
    let token = getLocalStore("token");
    if (token == null) {
      return;
    }
    let [code, response] = await sendRequest("POST", "auth/logout", { refresh: JSON.parse(token).refresh });
    if (code == 200) {
      removeLocalStore("userID");
      removeLocalStore("token");
      location.reload();
    }
  }], ["Cancel", "var(--grayColor)"]]);
});

async function loadNeededModules() {
  window.showPopUp = await getModule("modal");
  window.webModal = await getModule("webmodal");
  window.showDropdown = await getModule("dropdown");
  window.showPreview = await getModule("profilepreview");
}

let alreadyInit = false;
async function init() {
  loadNeededModules();
  if (getParam("code")) {
    await loadNeededModules();
    await handleOAuthEvents(getParam("code"), getParam("state"));
    modifyParams("code");
    modifyParams("state");
  }
  if (getLocalStore("token") != null) {
    await auth();
  }
  if (alreadyInit == true) {
    updateProfileSub();
    setAccountSub();
    return;
  }
  alreadyInit = true;

  await loadNeededModules();

  if (getParam("connect") != null && userID == null) {
    openLoginModal("signin", "Sign In");
  }

	if (getParam("gift") != null && userID == null) {
		openLoginModal("signin", "Sign In");
	}
  
  if (userID != null) {
    if (currentPage == "") {
      if (getParam("group") != null) {
        setPage("group");
      } else if (getParam("post") != null) {
        showPost(getParam("post"));
      } else if (getParam("chat") != null) {
        showChat(null, getParam("chat"));
      } else if (getParam("user") != null) {
        setPage("profile");
      } else if (getParam("j") != null) {
        setPage("group");
      } else if (window.location.hash == "") {
        setPage("home");
      } else {
        setPage(window.location.hash.substring(1));
      }
    }
    updateProfileSub();
    setAccountSub("home");
    if (account.Settings != null && account.Settings.Display != null) {
      setLocalStore("display", JSON.stringify(account.Settings.Display));
    }
  } else {
    let sidebarButtonsChilds = sidebarButtons.children;
    for (let i = 0; i < sidebarButtonsChilds.length; i++) {
      if (sidebarButtonsChilds[i].innerText != "Home") {
        sidebarButtonsChilds[i].classList.add("hidden");
      }
    }
    if (getParam("post") != null) {
      showPost(getParam("post"));
    } else if (getParam("chat") != null) {
      showChat(null, getParam("chat"));
    } else if (getParam("user") != null) {
      setPage("profile");
    } else if (getParam("j") != null || getParam("group") != null) {
      setPage("group");
    } else if (window.location.hash == "#migrate") {
      setPage("migrate");
    } else if (window.location.hash == "#tos") {
      setPage("tos");
    } else {
      setPage("home");
    }
    let signInUpBar = createElement("stickyContainer", "div", main);
    signInUpBar.id = "signInUpBar";
    signInUpBar.innerHTML = `
    <span class="signInUpText">Ready to Join the Hangout?</span>
    <button class="signUpButton">
      Sign Up
    </button>
    <button class="signInButton">
      Sign In
    </button>
    `;
    findC("signUpButton").addEventListener("click", function() {
      openLoginModal("signup", "Create Account");
    });
    findC("signInButton").addEventListener("click", function() {
      let modalCode = showPopUp("Sign In", `<button class="exotekLoginBtn" id="exotekLoginBtn"><image src="https://exotek.co/images/favicon.png" class="btnImg"><div style="flex: 1">Exotek</div></button><div style="text-align: center"><br>Have an old Photop account?<br><a href="#migrate" target="_blank">Migrate Account</a></div>`, [["Cancel", "var(--grayColor)"]]);
      findI("exotekLoginBtn").addEventListener("click", function () {
        openLoginModal("signin", "Sign In");
        findI("backBlur" + modalCode).style.opacity = 0;
        findI("backBlur" + modalCode).children[0].style.transform = "scale(0.9)";
        setTimeout(function () {
          findI("backBlur" + modalCode).remove();
        }, 199);
      });
    });
    if (findC("pageHolder") != null) {
      main.insertBefore(signInUpBar, findC("pageHolder"));
    }
  }

  // FasLoad TM
  (await getModule("actions"))();
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
  window.loginWindow = (await getModule("webmodal"))("https://exotek.co/login?client_id=62f8fac716d8eb8d2f6562ef&redirect_uri=" + encodeURIComponent(window.location.href) + "&response_type=code&scope=userinfo&state=" + randomStr + "#" + page, title);
}

/*
let signInPopUp;
async function signIn() {
  let [code, response] = await sendRequest("POST", "temp/signin?ss=" + socket.secureID, { username: findI("signInUsername").value, password: findI("signInPassword").value });
  if (code == 200) {
    if (findI("backBlur" + signInPopUp) != null) {
      findI("backBlur" + signInPopUp).remove();
    }
    updateToSignedIn(response);
  } else {
    showPopUp("Couldn't Sign In", response, [["Okay", "var(--grayColor)"]]);
  }
}
function signInModal(user) {
  signInPopUp = showPopUp("Sign In", `
  <input class="signInInput" id="signInUsername" placeholder="Username" value="${(user || "")}">
  <input class="signInInput" id="signInPassword" placeholder="Password" type="password">`, [["Sign In", "var(--signInColor)", signIn, true], ["Sign Up", "var(--signUpColor)", signUpModal], ["Close", "var(--grayColor)"]]);
  findI("signInUsername").focus();
}
let captchaKey = null;
async function signUpModal() {
  let signUpPopUp = showPopUp("Sign Up", `
  <input class="signInInput" id="signUpEmail" placeholder="Your Email" type="email">
  <input class="signInInput" id="signUpUsername" placeholder="Your Username">
  <input class="signInInput" id="signUpPassword" placeholder="Your Password" type="password">
  <div id="captchaHolder"></div>
  <div class="tosAgreeText">By clicking "Sign Up" you are agreeing to our <a href="https://app.photop.live/#tos" target="_blank">Terms of Use</a>, <a href="https://app.photop.live/#privacy" target="_blank">Privacy Policy</a>, and <a href="https://app.photop.live/#rules" target="_blank">Rules</a>.</div>
  `,
    [["Sign Up", "var(--signUpColor)", async function() {
      let email = findI("signUpEmail").value;
      let username = findI("signUpUsername").value;
      let password = findI("signUpPassword").value;

      const verifyEmailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (verifyEmailRegex.test(email) == false) {
        showPopUp("Invalid Email", "Emails must be... well, emails.", [["Okay", "var(--themeColor)"]]);
        return;
      }
      if (verifyUsername(username) == false) {
        showPopUp("Invalid Username", "Usernames must be 3-20 characters, and can only include letters, numbers, underscores, and dashes.", [["Okay", "var(--themeColor)"]]);
        return;
      }
      if (password.length < 8) {
        showPopUp("Invalid Password", "Passwords must be at least 8 characters long.", [["Okay", "var(--grayColor)"]]);
        return;
      }
      if (password.replace(/[^0-9]/g, "").length < 1) {
        showPopUp("Invalid Password", "Passwords must contain at least one number.", [["Okay", "var(--grayColor)"]]);
        return;
      }
      if ((/[ !@#$%^&*()+\-_=\[\]{};':"\\|,.<>\/?]/).test(password.toLowerCase()) == false) {
        showPopUp("Invalid Password", "Passwords must contain at least one symbol.", [["Okay", "var(--grayColor)"]]);
        return;
      }
      if (captchaKey == null) {
        showPopUp("Complete the Captcha", "You must verify that you're not a bot.", [["Okay", "var(--grayColor)"]]);
        return;
      }

      let signUpBody = { email: email, username: username, password: password, captcha: captchaKey };
      if (getParam("affiliate") != null) {
        signUpBody.affiliate = getParam("affiliate");
      }
      let [code, response] = await sendRequest("POST", "temp/signup?ss=" + socket.secureID, signUpBody);
      if (code == 200) {
        findI("backBlur" + signUpPopUp).remove();
        updateToSignedIn(response);
      } else {
        showPopUp("Couldn't Sign Up", response, [["Okay", "var(--grayColor)"]]);
      }
    }, true], ["Sign In", "var(--signInColor)", signInModal], ["Close", "var(--grayColor)"]]);
  findI("signUpEmail").focus();
  await loadScript("https://hcaptcha.com/1/api.js");
  hcaptcha.render("captchaHolder", { sitekey: "1f803f5f-2da5-4f83-b2c6-d9a8e00ba2d3", theme: "dark", callback: "setCaptchaKey", "expired-callback": "setCaptchaExpired" });
}
function setCaptchaKey(key) {
  captchaKey = key;
}
function setCaptchaExpired() {
  if (typeof hcaptcha != "undefined") {
    captchaKey = null;
    hcaptcha.reset();
  }
}
*/

async function handleOAuthEvents(authCode, authState) {
  if (authCode != null && authState != null) {
    if (authState.length == 20) {
      if (authState != getLocalStore("state")) {
        return;
      }
      removeLocalStore("state");
      let [code, response] = await sendRequest("POST", "auth?ss=" + socket.secureID, { code: authCode });
      if (code == 200) {
        updateToSignedIn(response);
      } else {
        showPopUp("An Error Occured", response, [["Okay", "var(--grayColor)"]]);
      }
    } else if (authState == "transferlogin") {
      window.transferLoginCode = authCode;
      showPopUp("Complete Transfer", "To complete the process, login to the new Exotek account you wish to use when signing in.", [["Authenticate", "var(--themeColor)", async function() {
        window.loginWindow = (await getModule("webmodal"))("https://exotek.co/login?client_id=62f8fac716d8eb8d2f6562ef&redirect_uri=" + encodeURIComponent(window.location.href) + "&response_type=code&scope=userinfo&state=transferfinish", "Transfer Exotek Account (New Account)");
      }], ["Cancel", "var(--grayColor)"]]);
    } else if (authState == "transferfinish") {
      if (window.transferLoginCode) {
        let [code, response] = await sendRequest("POST", "auth/transfer", { old: window.transferLoginCode, new: authCode });
        if (code == 200) {
          let data = JSON.parse(response);
          account.Email = data.Email;
          account.Exotek = data.Exotek;
          account.Premium = data.Premium;
          refreshPage();
          showPopUp("Trasfered Accounts", "You will now use your Exotek account:</br><b>" + account.Exotek.user + "</b> <i>(" + account.Email + ")</i></br>when logging into Photop.", [["Okay", "var(--grayColor)"]]);
        } else {
          showPopUp("An Error Occured", response, [["Okay", "var(--grayColor)"]]);
        }
        delete window.transferLoginCode;
      }
    }
  }
}
window.addEventListener("message", async (event) => {
  if (event.data == "oauth_embed_integration") {
    event.source.postMessage("subscribe_oauth_finish", "*");
  } else if (event.origin === "https://exotek.co") {
    let parsedData = JSON.parse(event.data);
    if (parsedData.type == "oauth_finish") {
      window.loginWindow.close();
      handleOAuthEvents(parsedData.code, parsedData.state);
    }
  }
});

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

async function updateToSignedIn(response) {
  let data = JSON.parse(response);
  account = data.user;
  groups = data.groups || {};
  userID = account._id;
  await loadNeededModules();
  if (account.Onboarding) {
    let modalCode = showPopUp("Complete Sign Up", `<span class="settingsTitle">Profile Picture</span><div class="groupIconCreate" id="exotekPfpHolder">
          <img class="groupIconCreateHolder" src="${account.Exotek.image || assetURL + "ProfileImages/DefaultProfilePic"}" id="exotekPfp">
          <div class="settingsUploadButton"></div>
        </div><input id="inputOnboardPfp" type="file" accept="image/*" hidden="true"><span class="settingsTitle">Username</span><input type="text" placeholder="Username" class="settingsInput" id="inputName" value="${account.Exotek.user || ""}">`, [["Sign Up", "var(--signUpColor)", async function () {
      let formData = new FormData();
      formData.append("user", findI("inputName").value);
      formData.append("auth", userID + ";" + data.token.session);
      if (getParam("affiliate") != null) {
        formData.append("affiliate", getParam("affiliate"));
      }
      if (findI("inputOnboardPfp").files.length > 0) {
        let imgSRC = findI("exotekPfp").src;
        await fetch(imgSRC).then(async function(file) {
          formData.append("image", await file.blob());
          URL.revokeObjectURL(imgSRC);
        });
      }
      let [code, suresponse] = await sendRequest("POST", "auth/signup", formData, true);
      if (code == 200) {
        let signUpData = JSON.parse(suresponse);
        delete data.user.Onboarding;
        delete data.user.OnboardExpires;
        data.user.AccountID = data.user.AwaitAccountID;
        delete data.user.AwaitAccountID;
        data.user.User = signUpData.User;
        if (signUpData.ProfilePic) {
          data.user.Settings = data.user.Settings || {};
          data.user.Settings.ProfilePic = signUpData.ProfilePic;
        }
        updateToSignedIn(JSON.stringify(data));
        findI("backBlur" + modalCode).style.opacity = 0;
        findI("backBlur" + modalCode).children[0].style.transform = "scale(0.9)";
        setTimeout(function () {
          findI("backBlur" + modalCode).remove();
        }, 200);
      } else {
        showPopUp("An Error Occured", suresponse, [["Okay", "var(--grayColor)"]]);
      }
    }, true],["Cancel", "var(--grayColor)"]]);
    tempListen(findI("exotekPfpHolder"), "click", function () {
      findI("inputOnboardPfp").click();
    });
    if (account.Exotek.image != null) {
      findI("exotekPfp").style.display = "unset";
    }
    tempListen(findI("inputOnboardPfp"), "change", function(e) {
      let imageHolder = findI("exotekPfp");
        let file = e.target.files[0];
        if (file.type.substring(0, 6) == "image/") {
          if (supportedImageTypes.includes(file.type.replace(/image\//g, "")) == true) {
            let premium = hasPremium();
            if (file.size < 2097153 || (file.size < 2097153 * 2 && premium)) { // 2 MB
              if (imageHolder.src != null) {
                URL.revokeObjectURL(imageHolder.src);
              }
              let blob = URL.createObjectURL(file);
              imageHolder.src = blob;
              imageHolder.style.display = "unset";
            } else {
              if (file.size > 2097153 && !premium) {
                showPopUp("Too big!", "Your image must be under 2MB.", [["Okay", "var(--grayColor)"]]);
              } else {
                if (file.size > 2097153 * 2 && premium) {
                  showPopUp("Too big!", "Your image file size must be under 4MB.", [["Okay", "var(--grayColor)"]]);
                }
              }
            }
          } else {
            showPopUp("Invalid Image Type", "Photop only accepts images of the following types: <i style='color: #bbb'>" + (supportedImageTypes.join(", ")) + "</i>", [["Okay", "var(--grayColor)"]]);
          }
        } else {
          showPopUp("Must be an Image", "Only image files can be uploaded to Photop.", [["Okay", "var(--grayColor)"]]);
        }
      });
    return;
  }
  if (data.token && data.user) {
    // If function was called from signin/signup:
    setLocalStore("userID", data.user._id);
    setLocalStore("token", JSON.stringify(data.token));
    let sidebarButtonsChilds = sidebarButtons.children;
    for (let i = 0; i < sidebarButtonsChilds.length; i++) {
      sidebarButtonsChilds[i].classList.remove("hidden");
    }
    updateProfileSub();
    setAccountSub("home");
    let signInUpBar = findI("signInUpBar");
    if (signInUpBar != null) {
      signInUpBar.remove();
    }
    if (data.affiliate != null) {
      showPopUp("Following " + data.affiliate.user, `Welcome to Photop! You joined with <span type="user" userid="${data.affiliate._id}" class="mention" tabindex="0">@${data.affiliate.user}</span>'s invite link and are now following them!`, [["Cool!", "var(--themeColor)"], ["Unfollow", "#FF5C5C", function() {
        sendRequest("DELETE", "user/unfollow?userid=" + data.affiliate._id);
      }]]);
    }
  }
  findC("accountInfoPic").src = decideProfilePic(account);
  findC("accountInfoName").textContent = account.User;
  findI("accountInfo").style.display = "flex";
  account.Settings = account.Settings || {};
  account.Settings.Display = account.Settings.Display || {};
  account.Settings.Display.Theme = account.Settings.Display.Theme || "Dark";
  updateDisplay(account.Settings.Display.Theme);
  updateBackdrop(account.Settings.Backdrop);
  setLocalStore("display", JSON.stringify(account.Settings.Display));
  setLocalStore("backdrop", account.Settings.Backdrop);
  if (data.restored != null) {
    showPopUp("Account Restored!", "Your Photop account has been restored. <b>Welcome Back!</b>", [["Okay", "var(--grayColor)"]]);
  }
  findC("sidebarNotifHolder").innerHTML = "";
  let groupnotif = await getModule("groupnotif");
  let groupsArr = Object.keys(groups);
  for (let i = 0; i < groupsArr.length; i++) {
    let group = groups[groupsArr[i]];
    if (group.LastChecked < group.LastContent) {
      groupnotif({ ...group, _id: groupsArr[i] });
    }
  }
	if (getParam("gift") != null) {
		(await getModule("gift"))(getParam("gift"));
		modifyParams("gift");
	}
  if (getParam("connect") == null) {
    refreshPage();
  } else if (currentPage != "settings") {
    setPage("settings");
  }
}

// Track Affiliate Clicks:
if (getParam("affiliate") != null && getLocalStore("userID") == null) {
  sendRequest("POST", "analytics/affiliate", { type: "click", userid: getParam("affiliate") });
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

sidebarButtons.addEventListener("click", function(e) {
  let path = e.path || (e.composedPath && e.composedPath());
  let button = path[0].closest(".sidebarButton");
  if (button != null) {
    if (button.innerText == "Post") {
      if (currentPage != "home") {
        setPage("home")
      }
      findI("newPostArea").focus();
    } else {
      if (button.innerText == "Profile") {
        modifyParams("user", userID);
      }
      setPage(button.innerText.toLowerCase());
    }
  }
});

let bb = function(isPost) {
  let o7 = this;
  let token_match = /{[A-Z_]+[0-9]*}/ig;
  let tokens = {
    'URL': '(((http|https)://)(www.)?[a-zA-Z0-9@:%._\\+~#?&//=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*))',
    'TEXT': '(.*?)',
    'SIMPLETEXT': '[a-zA-Z0-9-_ ]\b',
    'HEX': '([0-9abcdef]+)',
		'PREM': '([a-z0-9]+)'
  };
  let hddmatches = [];
  let hdtpls = [];
  let hdmatches = [];
  let hddtpls = [];
  let odRegEx = function(str) {
    let matches = str.match(token_match);
    let nrmatches = matches.length;
    let i = 0;
    let replacement = '';
    if (nrmatches <= 0) {
      return new RegExp(preg_quote(str), 'g');
    }
    for (; i < nrmatches; i += 1) {
      let token = matches[i].replace(/[{}0-9]/g, '');
      if (tokens[token]) {
        replacement += preg_quote(str.substr(0, str.indexOf(matches[i]))) + tokens[token];
        str = str.substr(str.indexOf(matches[i]) + matches[i].length);
      }
    }
    replacement += preg_quote(str);
    return new RegExp(replacement, 'gi');
  };
  let odTpls = function(str) {
    let matches = str.match(token_match);
    let nrmatches = matches.length;
    let i = 0;
    let replacement = '';
    let positions = {};
    let next_position = 0;

    if (nrmatches <= 0) {
      return str;
    }
    for (; i < nrmatches; i += 1) {
      let token = matches[i].replace(/[{}0-9]/g, '');
      let position;
      if (positions[matches[i]]) {
        position = positions[matches[i]];
      } else {
        next_position += 1;
        position = next_position;
        positions[matches[i]] = position;
      }
      if (tokens[token]) {
        replacement += str.substr(0, str.indexOf(matches[i])) + '$' + position;
        str = str.substr(str.indexOf(matches[i]) + matches[i].length);
      }
    }
    replacement += str;
    return replacement;
  };
  o7.ad = function(hddmatch, hddtpl) {
    hddmatches.push(odRegEx(hddmatch));
    hdtpls.push(odTpls(hddtpl));
    hdmatches.push(odRegEx(hddtpl));
    hddtpls.push(odTpls(hddmatch));
  };
  o7.bbh = function(str) {
    let nrbbcmatches = hddmatches.length;
    let i = 0;
    for (; i < nrbbcmatches; i += 1) {
      str = str.replace(hddmatches[i], hdtpls[i]);
    }
    return str;
  };
  function preg_quote(str, delimiter) {
    return (str + '').replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '') + '-]', 'g'), '\\$&');
  }
  o7.ad('(!{TEXT})', '<b>{TEXT}</b>');
  o7.ad('(*{TEXT})', '<i>{TEXT}</i>');
  o7.ad('(_{TEXT})', '<u>{TEXT}</u>');
  o7.ad('(-{TEXT})', '<strike>{TEXT}</strike>');
  o7.ad('(`{TEXT})', '<span style="font-family:monospace;border-radius:5px;padding:0 5px;background-color:var(--pageColor);">{TEXT}</span>');
  o7.ad('(^{TEXT})', '<sup>{TEXT}</sup>');
  o7.ad('https://app.photop.live/?gift={PREM}', '<span type="giftlink" giftid="{PREM}" class="gift-link" tabindex="0">Claim Gift!</span>');
  o7.ad('{URL}', '<a href="{URL}" target="_blank" class="link" title="{URL}">{URL}</a>');
  o7.ad('@{HEX}"{TEXT}" ', '<span type="user" userid="{HEX}" class="mention" tabindex="0">@{TEXT}</span> ');
  o7.ad('@{HEX}"{TEXT}"\n', '<span type="user" userid="{HEX}" class="mention" tabindex="0">@{TEXT}</span>\n');
  o7.ad('/Post_{HEX} ', '<span type="postlink" postid="{HEX}" class="post-embed" tabindex="0">/Post_{HEX}</span> ');
  o7.ad('/Post_{HEX}\n', '<span type="postlink" postid="{HEX}" class="post-embed" tabindex="0">/Post_{HEX}</span>\n');
  o7.ad('/Chat_{HEX} ', '<span type="chatlink" chatid="{HEX}" class="chat-embed" tabindex="0">/Chat_{HEX}</span> ');
  o7.ad('/Chat_{HEX}\n', '<span type="chatlink" chatid="{HEX}" class="chat-embed" tabindex="0">/Chat_{HEX}</span>\n');
  o7.ad('/Gift_{PREM} ', '<span type="giftlink" giftid="{PREM}" class="gift-link" tabindex="0">Claim Gift!</span> ');
  o7.ad('/Gift_{PREM}\n', '<span type="giftlink" giftid="{PREM}" class="gift-link" tabindex="0">Claim Gift!</span>\n');
  //o7.ad('#{TEXT} ', '<span type="hashtag" hashtag="{TEXT}" class="hashtag" tabindex="0">#{TEXT}</span> ');
  //o7.ad('#{TEXT}\n', '<span type="hashtag" hashtag="{TEXT}" class="hashtag" tabindex="0">#{TEXT}</span>\n');
};
let fe = new bb(false);
let newPostRender = new bb(true);
function formatText(str) {
  let formatted = fe.bbh(cleanString(str) + "\n) ");
  if (formatted.endsWith(") ") == true) {
    formatted = formatted.substring(0, formatted.length - 3);
  } else {
    formatted = formatted.substring(0, formatted.length - 2);
  }
  return formatted;
}

function cleanString(str) {
  return str.replace(/\>/g, "&#62;").replace(/\</g, "&#60;");
}

let formating = {
  "http://": '<span type="link" class="link">{TEXT}</span>',
  "https://": '<span type="link" class="link">{TEXT}</span>',
  "www.": '<span type="link" class="link">{TEXT}</span>',

  "@": '<span type="mention" class="mention">{TEXT}</span>',
  "/Post_": '<span type="post" class="post-embed">{TEXT}</span>',
  "/Chat_": '<span type="chat" class="chat-embed">{TEXT}</span>',
  "/User_": '<span type="user" class="user-embed">{TEXT}</span>',
  "/Gift_": '<span type="gift" class="gift-embed">{TEXT}</span>',

  "(!": "<b>{TEXT}</b>",
  "(*": "<i>{TEXT}</i>",
  "(_": "<u>{TEXT}</u>",
  "(-": "<strike>{TEXT}</strike>",
  "(`": '<span style="font-family:monospace;border-radius:5px;padding:0 5px;background-color:var(--pageColor);">{TEXT}</span>',
  "(^": "<sup>{TEXT}</sup>"
}
let formatingKeys = Object.keys(formating);
function postCreateFormat(text) {
  let hasFormating = false;
  for (let i = 0; i < formatingKeys.length; i++) {
    let key = formatingKeys[i];
    let start = -1;
    while (true) {
      start = text.indexOf(key, start);
      if (text[start - 1] == ">") { // Must be inside SPAN
        start += 1;
      } else {
        break;
      }
    }
    if (start > -1) {
      // Does have formating:
      hasFormating = true;
      let end = text.length - 1;
      let parenEnd = text.indexOf(")", start);
      if (parenEnd > -1 && parenEnd < end) {
        end = parenEnd;
      }
      if (key[0] != "(") {
        let spaceEnd = text.indexOf(" ", start);
        if (spaceEnd > -1 && spaceEnd < end) {
          end = spaceEnd;
        }
        spaceEnd = text.indexOf("\u00A0", start);
        if (spaceEnd > -1 && spaceEnd < end) {
          end = spaceEnd;
        }
      } else {
        end++;
      }
      let data = formating[key];
      let replaceWith = data.replace(/{TEXT}/g, text.substring(start, end));
      //text = text.substring(0, start) + data.replace(/{TEXT}/g, "#" + text.substring(start + 1, end)) + text.substring(end);
      text = text.substring(0, start) + replaceWith + text.substring(end);
    }
  }
  if (hasFormating == true) {
    return postCreateFormat(text);
  } else {
    return text.replace(/\n/g, "</br>");
  }
}
function preFormat(text) {
  let result = postCreateFormat(cleanString(text) + " ");
  return result.substring(0, result.length - 1);
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

async function showPost(postID, noAnim) {
  if (postID == null) {
    showPopUp("Post Not Found", "That post wasn't found! It may have been removed or never sent at all.", [["Okay", "var(--grayColor)"]]);
  }
  let post = findI(postID);
  if (post == null) {
    let data = postID;
    if (noAnim != null) {
      data += "," + noAnim.toString();
    }
    modifyParams("post", data);
    await setPage("viewpost");
  } else {
    /*
    window.scrollTo({
      top: post.offsetTop + (post.scrollTop || document.documentElement.scrollTop) + post.clientTop - 8,
      behavior: "smooth"
    });
    */
    if (noAnim != true) {
      post.style.backgroundColor = "#C95EFF";
    }
    post.scrollIntoView();
    setPostUpdateSub();
    setupPostChats();
    await sleep(1000);
    post.style.backgroundColor = "";
  }
}

let activePostListeners = {};
async function showChat(postID, chatID) {
  if (chatID == null) {
    showPopUp("Chat Not Found", "That chat wasn't found! It may have been removed or never sent at all.", [["Back", "var(--grayColor)"]]);
  }
  async function runAnim(chat, noAnim) {
    chat.style.backgroundColor = "#2AF5B5";
    let scrollData = {
      top: chat.offsetTop - 42
    };
    if (noAnim != true) {
      scrollData.behavior = "smooth";
    }
    chat.parentElement.parentElement.scrollTo(scrollData);
    await sleep(1000);
    chat.style.backgroundColor = "";
  }
  function checkIfFound(noAnim) {
    let chat = findI(chatID);
    if (chat != null) {
      runAnim(chat, noAnim);
      return true;
    }
    return false;
  }
  if (checkIfFound() == true) {
    return;
  }

  let renderChat = await getModule("chat");

  let [code, response] = await sendRequest("GET", "chats?chatid=" + chatID);
  if (code == 200) {
    let data = JSON.parse(response);
    let chat = data.chats[0];
    if (chat == null) {
      showPopUp("Chat Not Found", "That chat wasn't found! It may have been removed or never sent at all.", [["Back", "var(--grayColor)"]]);
      return;
    }
    let post = findI(postID);
    if (post == null) {
      postID = chat.PostID;
      await showPost(postID, true);
    } else {
      post.scrollIntoView();
    }
    post = findI(postID);
    if (post == null) {
      return;
    }
    post.setAttribute("loading", "");
    if (post.querySelector(".chatHolder") != null) {
      detatchListeners(post);
      post.removeAttribute("allUpChatsLoaded");
      post.removeAttribute("allDownChatsLoaded");
      post.querySelector(".chatHolder").remove();
      if (post.querySelector(".scrollToBottom") != null) {
        post.querySelector(".scrollToBottom").remove()
      }
    }
    attachListeners(post);
    createElement("chatHolder", "div", post.querySelector(".postChatHolder"));
    let replyAdd = post.querySelector(".postChatReply");
    if (replyAdd != null) {
      replyAdd.remove();
    }
    let [code2, response2] = await sendRequest("GET", "chats?postid=" + postID + "&before=" + chat.Timestamp);
    if (code2 == 200) {
      let beforeData = JSON.parse(response2);
      let [code3, response3] = await sendRequest("GET", "chats?postid=" + postID + "&after=" + chat.Timestamp);
      if (code3 == 200) {
        let afterData = JSON.parse(response3);
        let allChats = beforeData.chats.reverse().concat(data.chats, afterData.chats);
        let users = getObject(afterData.users.concat(data.users, beforeData.users), "_id");
        let replies = getObject(afterData.replies.concat(data.replies, beforeData.replies), "_id");
        for (let i = 0; i < allChats.length; i++) {
          let chat = allChats[i];
          let reply = replies[chat.ReplyID];
          if (reply != null) {
            reply.user = users[reply.UserID];
          }
          renderChat(post.querySelector(".chatHolder"), chat, users[chat.UserID], reply);
        }
        if (beforeData.chats.length < 20) {
          post.setAttribute("allUpChatsLoaded", "");
        }
        if (afterData.chats.length < 20) {
          post.setAttribute("allDownChatsLoaded", "");
        } else {
          createScrollToBottom(post);
        }
        post.removeAttribute("loading");
        post.querySelector(".loadingChatsInfo").style.display = "none";
      }
    }
    checkIfFound(true);
  } else {
    showPopUp("Chat Not Found", "That chat wasn't found! It may have been removed or never sent at all.", [["Back", "var(--grayColor)"]]);
  }
}
function createScrollToBottom(post) {
  let scrollToBottom = createElement("scrollToBottom", "div", post.querySelector(".postChatNew"));
  scrollToBottom.setAttribute("title", "Scroll To Bottom");
  scrollToBottom.innerHTML = "&#9660;";
  scrollToBottom.addEventListener("click", function(e) {
    let post = e.target.closest(".post");
    if (post == null) {
      return;
    }
    if (post.hasAttribute("allDownChatsLoaded") == true) {
      post.querySelector(".postChatHolder").scrollTo({
        top: post.querySelector(".postChatHolder").scrollHeight,
        behavior: "smooth"
      });
    } else {
      detatchListeners(post);
      post.removeAttribute("allUpChatsLoaded");
      post.removeAttribute("allDownChatsLoaded");
      post.querySelector(".chatHolder").remove();
      setupPostChats();
    }
    post.querySelector(".scrollToBottom").remove();
  });
}
async function attachListeners(post) {
  let renderChat = await getModule("chat");

  let postChatHolder = post.querySelector(".postChatHolder");
  let chatHolder = postChatHolder.querySelector(".chatHolder");
  async function handleChatScroll() {
    if (post.hasAttribute("loading") == true) {
      return;
    }
    if (postChatHolder != null) {
      if (postChatHolder.scrollTop + postChatHolder.clientHeight + 1000 < postChatHolder.scrollHeight) {
        if (post.querySelector(".scrollToBottom") == null) {
          createScrollToBottom(post);
        }
      } else if (post.querySelector(".scrollToBottom") != null && post.hasAttribute("allDownChatsLoaded") == true) {
        post.querySelector(".scrollToBottom").remove()
      }
      if (post.hasAttribute("allUpChatsLoaded") == false && postChatHolder.scrollTop < 200 && chatHolder.childElementCount > 24) {
        // Load more chats:
        post.setAttribute("loading", "");
        let groupIDAddOn = "";
        let groupID = getParam("group");
        if (groupID != null) {
          groupIDAddOn += "&groupid=" + groupID;
        }
        let [code, response] = await sendRequest("GET", "chats?postid=" + post.id + "&before=" + chatHolder.firstChild.getAttribute("time") + groupIDAddOn);
        if (code == 200) {
          let data = JSON.parse(response);
          let chats = data.chats;
          let replies = getObject(data.replies, "_id");
          let users = getObject(data.users, "_id");
          for (let i = 0; i < chats.length; i++) {
            let chat = chats[i];
            let reply = replies[chat.ReplyID];
            if (reply != null) {
              reply.user = users[reply.UserID];
            }
            renderChat(chatHolder, chat, users[chat.UserID], reply, false, { addTop: true });
          }
          if (chats.length < 25) {
            post.setAttribute("allUpChatsLoaded", "");
          }
          post.removeAttribute("loading");
        }
      } else if (post.hasAttribute("allDownChatsLoaded") == false && postChatHolder.scrollTop + postChatHolder.clientHeight + 200 > postChatHolder.scrollHeight && chatHolder.childElementCount > 24) {
        // Load more chats:
        post.setAttribute("loading", "");
        let groupIDAddOn = "";
        let groupID = getParam("group");
        if (groupID != null) {
          groupIDAddOn += "&groupid=" + groupID;
        }
        let [code, response] = await sendRequest("GET", "chats?postid=" + post.id + "&after=" + chatHolder.lastChild.getAttribute("time") + groupIDAddOn);
        if (code == 200) {
          let data = JSON.parse(response);
          let chats = data.chats;
          let replies = getObject(data.replies, "_id");
          let users = getObject(data.users, "_id");
          for (let i = 0; i < chats.length; i++) {
            let chat = chats[i];
            let reply = replies[chat.ReplyID];
            if (reply != null) {
              reply.user = users[reply.UserID];
            }
            renderChat(chatHolder, chat, users[chat.UserID], reply);
          }
          if (chats.length < 25) {
            post.setAttribute("allDownChatsLoaded", "");
          }
          post.removeAttribute("loading");
        }
      }
    }
  }
  activePostListeners[post.id] = handleChatScroll;
  postChatHolder.addEventListener("scroll", handleChatScroll);
}
function detatchListeners(post) {
  post.querySelector(".postChatHolder").removeEventListener("scroll", activePostListeners[post.id]);
  delete activePostListeners[post.id];
}
async function setupPostChats() {
  let renderChat = await getModule("chat");

  let posts = pageHolder.querySelectorAll(".post");
  let connectPosts = [];
  let getChatsPost = [];
  let getChatting = [];
  for (let i = 0; i < posts.length; i++) {
    let post = posts[i];
    let rect = post.getBoundingClientRect();
    if ((rect.y) + (post.offsetHeight) > 0 && rect.y < (window.innerHeight || document.documentElement.clientHeight)) {
      connectPosts.push(post.id);
      if (post.querySelector(".chatHolder") == null) {
        createElement("chatHolder", "div", post.querySelector(".postChatHolder"));
        post.setAttribute("loading", "");
        attachListeners(post);
        getChatsPost.push(post.id);
        let replyAdd = post.querySelector(".postChatReply");
        if (replyAdd != null) {
          replyAdd.remove();
        }
      }
      let embedHolder = post.querySelector(".embedHolder");
      if (embedHolder != null && embedHolder.querySelector("iframe") == null) {
        embedHolder.innerHTML = "Loading..." + embedHolder.getAttribute("iframe");
        embedHolder.querySelector("iframe").src = embedHolder.getAttribute("iframeurl");
      }
    } else if (post.querySelector(".chatHolder") != null) {
      detatchListeners(post);
      post.removeAttribute("allUpChatsLoaded");
      post.removeAttribute("allDownChatsLoaded");
      post.removeAttribute("loading");
      post.querySelector(".chatHolder").remove();
      post.querySelector(".loadingChatMsg").textContent = "Loading Chats...";
      post.querySelector(".loadingChatsInfo").style.display = "flex";
      if (post.querySelector(".scrollToBottom") != null) {
        post.querySelector(".scrollToBottom").remove()
      }
      let embedHolder = post.querySelector(".embedHolder");
      if (embedHolder != null) {
        embedHolder.innerHTML = "Loading...";
      }
    }
    if (post.querySelector(".postChatChatting").textContent == "") {
      getChatting.push(post.id);
    }
  }
  if (getChatsPost.length < 1) {
    return;
  }
  let endpoint = "chats/connect";
  let groupID = getParam("group");
  if (groupID != null) {
    endpoint += "?groupid=" + groupID;
  }
  let [code, response] = await sendRequest("POST", endpoint, { ssid: socket.secureID, connect: connectPosts, posts: getChatsPost });
  if (code == 200) {
    let data = JSON.parse(response);
    let chats = data.chats.reverse();
    let replies = getObject(data.replies, "_id");
    let users = getObject(data.users, "_id");
    for (let i = 0; i < chats.length; i++) {
      let chat = chats[i];
      let parent = findI(chat.PostID);
      if (parent != null) {
        let reply = replies[chat.ReplyID];
        if (reply != null) {
          reply.user = users[reply.UserID];
        }
        renderChat(parent.querySelector(".chatHolder"), chat, users[chat.UserID], reply);
      }
    }
    for (let i = 0; i < getChatsPost.length; i++) {
      let post = findI(getChatsPost[i]);
      if (post != null) {
        post.removeAttribute("loading");
        post.setAttribute("allDownChatsLoaded", "");
        if (post.querySelector(".chatHolder").childElementCount > 0) {
          post.querySelector(".loadingChatsInfo").style.display = "none";
        } else {
          post.querySelector(".loadingChatMsg").textContent = "Start The Hangout?"
        }
        post.querySelector(".postChatHolder").scrollTo({
          top: post.querySelector(".postChatHolder").scrollHeight
        });
      }
    }
  }
}
let includePremiumEmbedCode;
let premiumSubscribe;
function processGiftLinks() {
  let premiumEmbeds = pageHolder.querySelectorAll(".gift-link");
  let premiumEmbedCodes = [];
  for (let i = 0; i < premiumEmbeds.length; i++) {
    premiumEmbedCodes.push(premiumEmbeds[i].getAttribute("giftid"));
  }
  if (includePremiumEmbedCode != null && premiumEmbedCodes.includes(includePremiumEmbedCode) == false) {
    premiumEmbedCodes.push(includePremiumEmbedCode);
  }
  let query = { task: "gift", code: premiumEmbedCodes };
  if (premiumSubscribe != null) {
    premiumSubscribe.edit(query);
  } else if (premiumEmbedCodes.length > 0) {
    premiumSubscribe = socket.subscribe(query, async function(data) {
      switch (data.type) {
        case "claim":
					const embedElem = document.querySelector(`.embed[giftCode="${data.code}"]`);
					if (embedElem) {
						embedElem.innerHTML = `
							<div style="display:flex;">
								<img style="width:45px;height:45px;filter:grayscale(100%);" src="./icons/gift.svg">
								<div style="margin:auto 0px auto 8px;">
									<div style="font-weight:bold;font-size:16px;">This Gift was Claimed!</div>
									<div style="margin-top:4px;">Sorry slowpoke, someone got this gift!</div>
								</div>
							</div>
						`
					}
          break;
        case "solve":
          const solvingText = document.querySelector(`#claimPremiumSolving[giftid="${data.code}"]`);
          if(solvingText){
						const counter = solvingText.querySelector(".solvingCounter");
						const userIden = solvingText.querySelector(".usersIdentify");
						if (data.solving == 1) {
							userIden.innerText = "user is";
						} else {
							userIden.innerText = "users are";
						}
            changeCounter(counter, data.solving);
          }
      }
    });
  }
}
async function updateChatting(posts) {
  /*
  if (posts.length > 0) {
    async function chattingThread() {
      let postIDs = posts.map(function(x) { return x._id });
      let [code2, response2] = await sendRequest("GET", "chats/chatting?postid=" + postIDs.join(","));
      if (code2 == 200) {
        let data = JSON.parse(response2);
        for (let i = 0; i < postIDs.length; i++) {
          let post = findI(postIDs[i]);
          if (post != null) {
            let chatting = data[i];
            post.querySelector(".postChatChatting").textContent = chatting + " Chatting";
            if (chatting > 0) {
              post.querySelector(".postChatLiveCircle").style.animation = "liveCircle 1s linear infinite";
            }
          }
        }
      }
    }
    chattingThread();
  }
  */

  let foundEmbeds = pageHolder.querySelectorAll(".post-embed:not([embeding='']), .chat-embed:not([embeding='']), .link:not([embeding='']), .gift-link:not([embeding=''])");
  let requestEmbeds = [];
  let linkEmbeds = [];
  for (let i = 0; i < foundEmbeds.length; i++) {
    // Add to linkEmbeds if it's a non video/stream/gif embed
    let embed = foundEmbeds[i];
    if (embed.closest(".postContent") != null && embed.closest(".embed") == null) {
      switch (embed.getAttribute("type")) {
        case "postlink":
          requestEmbeds.push({ type: "post", value: embed.getAttribute("postid") });
          embed.setAttribute("embeding", "");
          break;
        case "chatlink":
          requestEmbeds.push({ type: "chat", value: embed.getAttribute("chatid") });
          embed.setAttribute("embeding", "");
          break;
        case "giftlink":
          requestEmbeds.push({ type: "premium", value: embed.getAttribute("giftid") });
					embed.setAttribute("embeding", "");
					break;
        default:
          let link = embed.textContent.replace('"', "");
          let videoEmbed;
          let embedLink;
          account.Settings = account.Settings || {};
          if ((link.startsWith("https://www.youtube.com/watch?v=") || link.startsWith("https://youtube.com/watch?v=")) && account.Settings.Display["Embed YouTube Videos"]) {
            videoEmbed = `<iframe class="iframeembed" allowfullscreen></iframe>`;
            embedLink = "https://youtube.com/embed/" + (new URLSearchParams(new URL(link).search)).get("v") + "?autoplay=1&mute=1";
          } else if (link.startsWith("https://youtu.be") && account.Settings.Display["Embed YouTube Videos"]) {
            let urlData = new URL(link);
            let endSlash = urlData.pathname.indexOf("/", 1);
            if (endSlash < 0) {
              endSlash = urlData.pathname.length;
            }
            videoEmbed = `<iframe class="iframeembed" allowfullscreen></iframe>`;
            embedLink = "https://youtube.com/embed/" + urlData.pathname.substring(1, endSlash) + "?autoplay=1&mute=1";
          }account.Settings.Display = account.Settings.Display || { "Embed YouTube Videos": true, "Embed Twitch Streams": true };
          if ((link.startsWith("https://www.youtube.com/watch?v=") || link.startsWith("https://youtube.com/watch?v=")) && account.Settings.Display["Embed YouTube Videos"]) {
            videoEmbed = `<iframe class="iframeembed" allowfullscreen></iframe>`;
            embedLink = "https://youtube.com/embed/" + (new URLSearchParams(new URL(link).search)).get("v") + "?autoplay=1&mute=1";
          } else if (link.startsWith("https://youtu.be") && account.Settings.Display["Embed YouTube Videos"]) {
            let urlData = new URL(link);
            let endSlash = urlData.pathname.indexOf("/", 1);
            if (endSlash < 0) {
              endSlash = urlData.pathname.length;
            }
            videoEmbed = `<iframe class="iframeembed" allowfullscreen></iframe>`;
            embedLink = "https://youtube.com/embed/" + urlData.pathname.substring(1, endSlash) + "?autoplay=1&mute=1";
          } else if ((link.startsWith("https://twitch.tv/") || link.startsWith("https://www.twitch.tv/")) && account.Settings.Display["Embed Twitch Streams"]) {
            let urlData = new URL(link);
            let endSlash = urlData.pathname.indexOf("/", 1);
            if (endSlash < 0) {
              endSlash = urlData.pathname.length;
            }
            videoEmbed = `<iframe class="iframeembed" allowfullscreen></iframe>`;
            embedLink = "https://player.twitch.tv?channel=" + urlData.pathname.substring(1, endSlash) + "&parent=" + window.location.host + "&muted=true";
          } else if (link.endsWith(".gif") && account.Settings.Display["Embed GIFs"]) {
            videoEmbed = "";
            let embedHolder = createElement("embedMedia", "img", embed.parentElement.parentElement);
            embedHolder.src = exotekCDN + encodeURIComponent(link);
            embedHolder.setAttribute("type", "imageenlarge");
          }
          if (videoEmbed == null) {
            linkEmbeds.push({ type: "link", value: link });
          } else if (videoEmbed != "" && embed.parentElement.parentElement.querySelector(".embedHolder") == null) {
            let embedHolder = createElement("embedHolder", "div", embed.parentElement.parentElement);
            embedHolder.setAttribute("iframe", videoEmbed);
            embedHolder.setAttribute("iframeurl", embedLink);
            embedHolder.textContent = "Loading...";
          }
          embed.textContent = link.replace(/https:\/\/www./g, "").replace(/https:\/\//g, "").replace(/http:\/\//g, "");
          embed.setAttribute("embeding", "");
      }
    }
  }
  if (requestEmbeds.length > 0) {
    processGiftLinks();
    let endpoint = "posts/embeds";
    let groupID = getParam("group");
    if (groupID) {
      endpoint += "?groupid=" + groupID;
    }
    let [code, response] = await sendRequest("POST", endpoint, requestEmbeds);
    if (code == 200) {
      let data = JSON.parse(response);
      let embeds = data.embeds;
      let users = getObject(data.users, "_id");
      for (let i = 0; i < foundEmbeds.length; i++) {
        let embed = foundEmbeds[i];
        let postContent = embed.closest(".postContent");
        if (postContent != null && embed.closest(".embed") == null) {
          let user;
          switch (embed.getAttribute("type")) {
            case "postlink":
              let post = embeds[embed.getAttribute("postid")];
              if (post == null) {
                continue;
              }
              user = users[post.UserID];
              let thisEmbed = createElement("embed", "div", postContent);
              thisEmbed.innerHTML = `<div class="embedUser"><img class="embedProfilePic"><div class="embedInfo"><div class="embedUsername"></div><div class="embedTimestamp"></div></div></div><div class="embedContent"><div class="embedText"></div></div>`;
              thisEmbed.querySelector(".embedUser").id = "post" + post._id + user._id;
              thisEmbed.querySelector(".embedProfilePic").src = decideProfilePic(user);
              thisEmbed.querySelector(".embedUsername").innerHTML = getRoleHTML(user) + user.User;
              thisEmbed.querySelector(".embedTimestamp").innerHTML = `${timeSince(post.Timestamp, true)} ${post.Edited ? `<span title="${formatFullDate(post.Edited)}">(edited)</span>` : ""}`;
              thisEmbed.querySelector(".embedTimestamp").title = formatFullDate(post.Timestamp);
              thisEmbed.querySelector(".embedText").innerHTML = formatText(post.Text);
              thisEmbed.setAttribute("type", "postlink");
              thisEmbed.setAttribute("postid", post._id);
              if (post.Media != null && post.Media.ImageCount > 0) {
                let postImages = createElement("postImages", "div", thisEmbed.querySelector(".embedContent"));
                for (let i = 0; i < post.Media.ImageCount; i++) {
                  let image = createElement("postImage", "img", postImages);
                  image.src = assetURL + "PostImages/" + post._id + i;
                  image.setAttribute("type", "imageenlarge");
                  image.setAttribute("tabindex", 0);
                }
              }
              break;
            case "chatlink":
              let chat = embeds[embed.getAttribute("chatid")];
              if (chat == null) {
                continue;
              }
              user = users[chat.UserID];
              let thisChatEmbed = createElement("embed", "div", postContent);
              thisChatEmbed.style.fontSize = "13px";
              thisChatEmbed.style.display = "flex";
              thisChatEmbed.innerHTML = `<img class="chatPfp" style="border-radius: 6px"><div class="chatTextArea"><div class="chatAttr" style="font-size: 14px"><span class="chatUser" type="user"></span> <span class="chatTime"></span></div><span class="chatText" style="font-size: 13.5px"></span></div>`;
              thisChatEmbed.querySelector(".chatPfp").src = decideProfilePic(user);
              thisChatEmbed.querySelector(".chatUser").innerHTML = getRoleHTML(user) + user.User;
              thisChatEmbed.querySelector(".chatTime").title = formatFullDate(chat.Timestamp);
              thisChatEmbed.querySelector(".chatTime").innerHTML = `${timeSince(chat.Timestamp, false)} ${chat.Edited ? `<span title="${formatFullDate(chat.Edited)}">(edited)</span>` : ""}`
              thisChatEmbed.querySelector(".chatText").innerHTML = formatText(chat.Text);
              let thisChatOverlay = createElement("profileChatOverlay", "div", thisChatEmbed);
              thisChatOverlay.setAttribute("type", "chatlink");
              thisChatOverlay.setAttribute("chatid", chat._id);
							break;
						case "giftlink":
							let gift = embeds[embed.getAttribute("giftid")];
              if (gift == null) {
                continue;
              }
							let thisGiftEmbed = createElement("embed", "div", postContent);
							thisGiftEmbed.setAttribute("giftCode", embed.getAttribute("giftid"))
							user = users[gift.UserID];
							if (gift.Claimed) {
								thisGiftEmbed.innerHTML = `
									<div style="display:flex;">
										<img style="width:45px;height:45px;filter:grayscale(100%);" src="./icons/gift.svg">
										<div style="margin:auto 0px auto 8px;">
											<div style="font-weight:bold;font-size:16px;">This Gift was Claimed!</div>
											<div style="margin-top:4px;">Sorry slowpoke, someone got this gift!</div>
										</div>
									</div>
								`;
							} else {
								thisGiftEmbed.innerHTML = `
								<div style="display:flex;">
									<img class="activeGiftIcon" src="./icons/gift.svg">
									<div style="margin:auto 0px auto 8px;">
											<div style="font-weight:800;">Claim this Premium Gift!</div>
											<div style="font-size:14px;margin-top:4px;"><b>${user.User}</b> has sent a <b>${gift.Length} month</b> gift!</div>
									</div>
									<button class="embedClaimButton shine" type="claimgift" giftid=${embed.getAttribute("giftid")} style="padding:8px;margin:auto 0px auto auto;background-color:var(--premiumColor);overflow:hidden;width:40px;">Claim</button>
								<div>
								`;
							}
              break; 
					}
        }
      }
    }
  }
  if (linkEmbeds.length > 0) {
    let [codeLink, responseLink] = await sendRequest("POST", "posts/embeds", linkEmbeds);
    if (codeLink == 200) {
      let data = JSON.parse(responseLink);
      let foundLinkEmbeds = pageHolder.querySelectorAll(".link:not([rendered=''])");
      for (let i = 0; i < foundLinkEmbeds.length; i++) {
        let embed = foundLinkEmbeds[i];
        let postContent = embed.closest(".postContent");
        if (postContent != null && embed.closest(".embed") == null) {
          let siteData = data.embeds[embed.href] || data.embeds[embed.href.slice(0, -1)];
          if (siteData == null) {
            continue;
          }
          if (siteData.site != null) {
            embed.setAttribute("rendered", "");
            let thisSiteEmbed = createElement("linkEmbed", "div", postContent);
            let embedHTML = "";
            if (siteData.video != null && account.Settings.Display["Embed GIFs"]) {
              embedHTML += `<video class="embedVideo" loop autoplay></video>`;
            }
            if (siteData.image != null) {
              embedHTML += `<img class="embedImage" type="imageenlarge"></img>`;
            }
            embedHTML += `<div class="embedInfoHolder"><div class="embedTitle"></div><div class="embedDesc"></div></div><a class="profileChatOverlay" target="_blank"></a>`;
            thisSiteEmbed.innerHTML = embedHTML;
            thisSiteEmbed.querySelector(".embedTitle").textContent = siteData.title || siteData.site || "";
            thisSiteEmbed.querySelector(".embedDesc").textContent = siteData.description || "";
            thisSiteEmbed.querySelector(".profileChatOverlay").setAttribute("href", embed.href);
            thisSiteEmbed.querySelector(".profileChatOverlay").setAttribute("title", embed.href);
            if (siteData.video != null && account.Settings.Display["Embed GIFs"]) {
              thisSiteEmbed.querySelector(".embedVideo").src = siteData.video;
            }
            if (siteData.image != null) {
              thisSiteEmbed.querySelector(".embedImage").src = siteData.image;
            }
          }
        }
      }
    }
  }
}
let scrollTimeout = null;
window.addEventListener("scroll", function() {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(setupPostChats, 200);
});

socket.remotes.account = async function(data) {
	switch(data.type) {
		case "message":
			let message = data.message;
			console.log(data)
			if(convos[message.ConvID]) {
				convos[message.ConvID].messages.splice(49, 1);
				convos[message.ConvID].messages.push(message)
			}
			if(currentPage != "messages" || document.querySelector(".message[active]").getAttribute("convid") != message.ConvID) return;
			
			let renderMessage = await getModule("message");
			let dms = document.querySelector("#dms");
			let users = getObject(data.users, "_id");
			if (data.reply != null) {
				data.reply.user = users[data.reply.UserID];
			}
			renderMessage(dms, message, users[message.UserID], data.reply);

			if (dms.lastElementChild != null && (dms.scrollTop + dms.clientHeight + dms.lastElementChild.clientHeight + 50 > dms.scrollHeight)) {
				let scrollToParams = { top: dms.scrollHeight };
				if (viewingTab == true) {
					scrollToParams.behavior = "smooth";
				}
				dms.scrollTo(scrollToParams);
			}
			break;
	}
}
socket.remotes.stream = async function(data) {
  let renderChat = await getModule("chat");

  switch (data.type) {
    case "chat":
      let chat = data.chat;
      if (account.BlockedUsers != null && account.BlockedUsers.includes(chat.UserID) == true) {
        return;
      }
      let parent = findI(chat.PostID);
      if (parent != null) {
        if (parent.hasAttribute("allDownChatsLoaded") == false) {
          return;
        }
        parent.querySelector(".loadingChatsInfo").style.display = "none";
        parent.querySelector(".postChatLiveCircle").style.animation = "liveCircle 1s linear infinite";
        let users = getObject(data.users, "_id");
        if (chat.UserID == userID) {
          let sendingChats = parent.querySelectorAll("[sending='']");
          for (let i = 0; i < sendingChats.length; i++) {
            sendingChats[i].remove();
          }
        }
        if (data.reply != null) {
          data.reply.user = users[data.reply.UserID];
        }
        let postChatHolder = parent.querySelector(".postChatHolder");
        let chatHolder = postChatHolder.querySelector(".chatHolder");
        renderChat(chatHolder, chat, users[chat.UserID], data.reply);
        if (chatHolder.lastElementChild != null && (postChatHolder.scrollTop + postChatHolder.clientHeight + chatHolder.lastElementChild.clientHeight + 50 > postChatHolder.scrollHeight)) {
          let scrollToParams = { top: postChatHolder.scrollHeight };
          if (viewingTab == true) {
            scrollToParams.behavior = "smooth";
          }
          postChatHolder.scrollTo(scrollToParams);
        }
        let chatCount = findI("chats" + chat.PostID);
        if (chatCount != null) {
          changeCounter(chatCount, parseInt(chatCount.getAttribute("realnum"),10)+1);
        }
      }
      break;
    case "chatdelete":
      let delChat = findI(data.chatID);
      if (delChat == null) {
        return;
      }
      let oldChat = delChat.nextElementSibling;
      if (oldChat != null && oldChat.className == "minifyChat" && (delChat.previousElementSibling == null || delChat.previousElementSibling.getAttribute("userid") != delChat.getAttribute("userid"))) {
        let convertChat = createElement("chat", "div", delChat.parentElement);
        delChat.parentElement.insertBefore(convertChat, delChat);
        convertChat.id = oldChat.id;
        convertChat.setAttribute("type", "chat");
        convertChat.setAttribute("text", oldChat.getAttribute("text"));
        convertChat.setAttribute("userid", oldChat.getAttribute("userid"));
        convertChat.setAttribute("user", oldChat.getAttribute("user"));
        convertChat.setAttribute("time", oldChat.getAttribute("time"));
        let lastCheckChat = delChat;
        while (delChat.parentElement != null) {
          if (lastCheckChat != null && lastCheckChat.className == "chat") {
            break;
          }
          lastCheckChat = lastCheckChat.previousElementSibling;
        }
        convertChat.innerHTML = `<img class="chatPfp" type="user"><div class="chatTextArea"><div class="chatAttr"><span class="chatUser" type="user"></span> <span class="chatTime"></span></div><span class="chatText"></span></div>`;
        convertChat.querySelector(".chatPfp").src = lastCheckChat.querySelector(".chatPfp").src;
        convertChat.querySelector(".chatUser").innerHTML = lastCheckChat.querySelector(".chatUser").innerHTML; // Used to get entire thing including roles.
        convertChat.querySelector(".chatTime").title = formatFullDate(parseInt(oldChat.getAttribute("time")));
        convertChat.querySelector(".chatTime").textContent = oldChat.querySelector(".chatMinfiyTime").textContent;
        convertChat.querySelector(".chatText").innerHTML = oldChat.querySelector(".chatMinfiyText").innerHTML;
        oldChat.remove();
      }
      if (delChat.parentElement.childElementCount == 1) {
        delChat.parentElement.parentElement.querySelector(".loadingChatsInfo").style.display = "flex";
        delChat.parentElement.parentElement.querySelector(".loadingChatMsg").textContent = "Start The Hangout?"
      }
      let chatCount = delChat.closest(".post").querySelector(".postChatCount");
      if (chatCount != null) {
        changeCounter(chatCount, parseInt(chatCount.getAttribute("realnum"),10)-1);
      }
      delChat.remove();
      break;
    case "chatedit":
      const chatElement = findI(data.chatID);
      if (chatElement) {
        const text = chatElement.querySelector(".chatText, .chatMinfiyText");
				chatElement.setAttribute('text', data.text);
        text.innerHTML = `${formatText(data.text)} <span class="chatEditedTitle" title="${formatFullDate(data.edited)}">(edited)</span>`

				const post = findI(chatElement.closest('.post').id);
        
				if (post) {
					const replies = Array.from(document.querySelectorAll(`.chatReplyHolder[replyid="${data.chatID}"]`));
          for(let i = 0; i < replies.length; i++){
            replies[i].lastChild.innerText = data.text.replace(/@([^"]+)"([^"]+)"/g, "@$1");
          }
				}
      }
      break;
  }
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
function getRoleHTML(roleUser, max) {
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
    roleHTML += `<span class="roleEmoji" style="background: linear-gradient(315deg, #505068, ${roleTypes[roles[i]][2]})" title="${roles[i]}"><span style="${roleTypes[roles[i]][3] || ""}">${roleTypes[roles[i]][0]}</span></span> `;
    /*
    roleHTML += `<span class="roleEmoji" title="${roles[i]}"><img src = "../Images/RoleIcons/${roles[i]
      }.png" class = "profileRole"></span> `;
    */
  }
  return roleHTML;
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
  showPopUp("It's Better Together", desc, [["Sign Up", "var(--signUpColor)", function() { openLoginModal("signup", "Create Account"); }], ["Sign In", "var(--signInColor)", function() { openLoginModal("signin", "Sign In"); }], ["Later", "var(--grayColor)"]]);
}

let socialLinkData = {
  twitter: ["Twitter", "#1DA1F2", "https://twitter.com/USERNAME_GOES_HERE"],
  youtube: ["YouTube", "#FF0000", "https://www.youtube.com/channel/USERID_GOES_HERE"],
  twitch: ["Twitch", "#6441A4", "https://www.twitch.tv/USERNAME_GOES_HERE"],
  discord: ["Discord", "#5865F2", "PROMPT_USERNAME"],
  instagram: ["Instagram", "#E1306C", "https://www.instagram.com/USERNAME_GOES_HERE"],
  reddit: ["Reddit", "#FF4500", "https://www.reddit.com/user/USERNAME_GOES_HERE", "u/"],
  //facebook: ["Facebook", "#4267B2", "https://www.facebook.com/search/top?q=USERNAME_GOES_HERE"],
  pinterest: ["Pinterest", "#E60023", "https://www.pinterest.com/USERNAME_GOES_HERE"],
  tiktok: ["TikTok", "#FF0050", "https://www.tiktok.com/@USERID_GOES_HERE"],
  //xbox: ["Xbox", "#107C10", "OAUTH_URL_HERE"],
  github: ["GitHub", "#4078C0", "https://github.com/USERNAME_GOES_HERE"]
};

window.addEventListener("keydown", async function(e) {
  if (e.key == "Enter") {
    if (e.target.className == "postChatInput") {
      e.target.parentElement.querySelector(".postChatButton").click();
      e.preventDefault();
    } else if (e.target.id == "signInPassword") {
      signIn();
    } else if (e.target.id == "signInUsername") {
      findI("signInPassword").focus();
    }
  } /*else if (e.keyCode == 38) {
		if (e.target.className == "postChatInput") {
			//finish if you want idk how to make the chat edit by using action.js - abooby
			const mainEle = e.target.parentElement.parentElement
			const chatHolder = mainEle.querySelector(".postChatHolder").querySelector(".chatHolder");
			let chats = chatHolder.querySelectorAll(`.chat[userid="${userID}"], .minifyChat[userid="${userID}"]`);

			let lastChat = chats[chats.length - 1];
			lastChat.click();
		}
	}*/
});
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

function reportContent(id, name, userid, type) {
  let reportReasons = ["Inappropriate Content", "Inappropriate Username", "Threats or Endangerment", "Hate Speech, Harassment, or Abuse", "Evading Bans, Mutes, or Blocks", "Spamming", "Spreading Rumors or False Information", "Posting Malicious Content or Links", "May be Inflicting Physical Harm", "Other"];
  let popUpCode = showPopUp("Report Content", `Please select a reason why <b>${name}</b> is breaking the rules.`, [["Report", "#FFCB70", async function() {
    let selectedReason = popUpText.querySelector('input[name="report"]:checked');
    if (selectedReason == null) {
      showPopUp("Nothing Selected", "Please select why this user is breaking the rules.", [["Okay", "var(--grayColor)"]]);
      return;
    }
    findI("backBlur" + popUpCode).remove();
    selectedReason = selectedReason.value;
    let inputtedReason = popUpText.querySelector("#reportContext").textContent;
    let popUpCode2 = showPopUp("Sending Report...", "Your report is being sent to the Photop moderators. Please wait...", null);
    if (inputtedReason.length > 200) {
      showPopUp("Report Context Too Long", "You can only enter 200 characters in the report context. Please try to make it a little more concise.", [["Okay", "var(--grayColor)"]])
    } else {
      let [code, response] = await sendRequest("PUT", "mod/report?type=" + type + "&contentid=" + id, { reason: selectedReason, report: inputtedReason });
      findI("backBlur" + popUpCode2).remove();
      if (code == 200) {
        showPopUp("Report Sent", `Your report was sent to the Photop Moderators. Thank you for helping to keep Photop safe. If you'd like, you can also <b>block</b> ${name} so their content will be hidden from you.`, [["Block", "#FF8652", async function() {
          let [code] = await sendRequest("PUT", "user/block?userid=" + userid);
          if (code == 200) {
            if (currentPage != "profile") {
              refreshPage();
            } else {
              setPage("home");
            }
          }
        }], ["Close", "var(--grayColor)"]]);
      } else {
        showPopUp("An Error Occured", response, [["Okay", "var(--grayColor)"]]);
      }
    }
  }, true], ["Wait, no", "var(--grayColor)"]]);
  let popUpText = findI("modalText" + popUpCode);
  //let reportSelector = createElement("reportSelect", "div", popUpText);
  for (let i = 0; i < reportReasons.length; i++) {
    popUpText.innerHTML += `<input type="radio" name="report" value="${reportReasons[i]}" id="${reportReasons[i].replace(/\s/g, "")}"><label for="${reportReasons[i].replace(/\s/g, "")}" class="radioLabel report">${reportReasons[i]}</label>`
  }
  popUpText.innerHTML += `<div class="reportContextTitle">Additional Context <i>(Optional):</i></div><div id="reportContext" contenteditable="true" placeholder="200 Max Characters" class="textArea"></div>`;
}
function formatDate(time) {
  let d = new Date(time + epochOffset);
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

findI("settingsB").addEventListener("click", function() {
  setPage("settings");
});
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

let viewingTab = true;
document.addEventListener("visibilitychange", function() {
  if (document.visibilityState == "visible") {
    viewingTab = true;
  } else {
    viewingTab = false;
  }
});

let scrollingEnabled = true;
body.addEventListener("touchmove", function(e) {
  if (scrollingEnabled == false && e.target.closest(".postChat") == null) {
    e.preventDefault();
  }
}, { passive: false });

// MOBILE RESIZE
function isTouchDevice() {
  return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
}
if (isTouchDevice() == true && screen.width < 550 || getParam("embed") == "mobile") {
  if (getParam("embed") != "desktop") {
    isMobile = true;

    app.style.minWidth = "unset";
    let sidebar = findC("sidebar");
    sidebar.style.position = "fixed";
    sidebar.style.height = "100%";
    sidebar.style.left = "-200px";
    sidebar.style.top = "0px";
    sidebar.style.padding = "8px";
    sidebar.style.zIndex = "950";
    sidebar.style.transition = ".35s";

    let sidebarShowButton = createElement("sidebarShowButton", "div", sidebar);
    sidebarShowButton.innerHTML = `<svg height="30" viewBox="0 0 706 491" fill="none" xmlns="http://www.w3.org/2000/svg"> <rect x="10" y="64" width="267" height="70" rx="35" fill="var(--themeColor)"/> <rect x="10" y="162" width="267" height="70" rx="35" fill="var(--themeColor)"/> <rect x="10" y="260" width="267" height="70" rx="35" fill="var(--themeColor)"/> <rect x="10" y="358" width="267" height="70" rx="35" fill="var(--themeColor)"/> <path d="M505 415L665.515 254.485C670.201 249.799 670.201 242.201 665.515 237.515L505 77" stroke="var(--themeColor)" stroke-width="72" stroke-linecap="round"/> </svg>`;
    sidebarShowButton.addEventListener("mousedown", function() {
      if (sidebar.style.left == "-200px") {
        sidebar.style.left = "0px";
      } else if (sidebar.style.left == "0px") {
        sidebar.style.left = "-200px";
      }
    });
    app.addEventListener("mousedown", async function(e) {
      if (e.target.closest(".sidebarShowButton") != null) {
        return;
      }
      if (sidebar.style.left == "0px") {
        sidebar.style.left = "-200px";
      }
    });

    findC("main").style.width = "100%";
    findC("main").style.marginLeft = "0px";
  }
}

let particles = null;
function updateDisplay(type) {
  setCSSVar("--sidebarBG", isMobile ? "var(--pageColor)" : "transparent");
  switch (type) {
    case "Light":
      setCSSVar("--leftSidebarColor", "#E8E8E8");
      setCSSVar("--pageColor", "#E6E9EB");
      setCSSVar("--pageColor2", "var(--pageColor)");
      setCSSVar("--contentColor", "#DFDFE6");
      setCSSVar("--contentColor2", "#D9D9E4");
      setCSSVar("--contentColor3", "#D2D2E0");
      setCSSVar("--fontColor", "#000000");
      setCSSVar("--themeColor", "#5AB7FA");
      particles = null;
      break;
    /*
    case "Pride":
      setCSSVar("--leftSidebarColor", "#262630");
      setCSSVar("--pageColor", "linear-gradient(to bottom, red, orange, yellow, green, blue, purple)");
      setCSSVar("--contentColor", "#EBEBEB");
      setCSSVar("--contentColor2", "#E3E3E3");
      setCSSVar("--contentColor3", "#D9D9D9");
      setCSSVar("--borderColor", "#323242");
      setCSSVar("--fontColor", "black");
      setCSSVar("--themeColor", "tomato");
      break;
      */
    case "Hacker":
      setCSSVar("--leftSidebarColor", "black");
      setCSSVar("--pageColor", "black");
      setCSSVar("--pageColor2", "var(--pageColor)");
      setCSSVar("--contentColor", "black");
      setCSSVar("--contentColor2", "black");
      setCSSVar("--contentColor3", "black");
      setCSSVar("--fontColor", "white");
      setCSSVar("--themeColor", "lime");
      particles = null;
      break;
    case "Blood Moon":
      setCSSVar("--leftSidebarColor", "black");
      setCSSVar("--pageColor", "linear-gradient(to bottom, #5c0701, black)");
      setCSSVar("--pageColor2", "var(--pageColor)");
      setCSSVar("--contentColor", "#831100");
      setCSSVar("--contentColor2", "#942200");
      setCSSVar("--contentColor3", "#a52300");
      setCSSVar("--fontColor", "white");
      setCSSVar("--themeColor", "tomato");
      particles = null;
      break;
    case "Under The Sea":
      setCSSVar("--leftSidebarColor", "black");
      setCSSVar("--pageColor", "linear-gradient(to bottom, #4ecbef, #0062fe)");
      setCSSVar("--pageColor2", "var(--pageColor)");
      setCSSVar("--contentColor", "#0056d6");
      setCSSVar("--contentColor2", "#0061fe");
      setCSSVar("--contentColor3", "#3a87fe");
      setCSSVar("--fontColor", "white");
      setCSSVar("--themeColor", "#52d6fc");
      particles = null;
      break;
    case "Bootop":
      setCSSVar("--leftSidebarColor", "#262630");
      setCSSVar("--pageColor", "#151617");
      setCSSVar("--pageColor2", "var(--pageColor)");
      setCSSVar("--contentColor", "#1f1f28");
      setCSSVar("--contentColor2", "#24242e");
      setCSSVar("--contentColor3", "#2a2a37");
      setCSSVar("--fontColor", "#ffffff");
      setCSSVar("--themeColor", "#eb6123");
      particles = null;
      break;
    case "Snowtop":
      setCSSVar("--leftSidebarColor", "#262630");
      setCSSVar("--pageColor", "url('/Images/Holidays/FunSnowPile.png')");
      setCSSVar("--pageColor2", "#151617");
      if (isMobile) {
        setCSSVar("--sidebarBG", "var(--pageColor2)");
      } else {
        setCSSVar("--sidebarBG", "transparent");
      }
      setCSSVar("--contentColor", "#1f1f28");
      setCSSVar("--contentColor2", "#24242e");
      setCSSVar("--contentColor3", "#2a2a37");
      setCSSVar("--fontColor", "#ffffff");
      setCSSVar("--themeColor", "#f13333");
      particles = "snow";
      document.body.classList.add('snowtop');
      break;
    case "Midnight Haze":
      setCSSVar("--leftSidebarColor", "black");
      setCSSVar("--pageColor", "linear-gradient(135deg, #0c1762, #650f9b, #780f31)");
      setCSSVar("--pageColor2", "var(--pageColor)");
      setCSSVar("--contentColor", "#1F1F59");
      setCSSVar("--contentColor2", "#421f59");
      setCSSVar("--contentColor3", "#611f59");
      setCSSVar("--fontColor", "white");
      setCSSVar("--themeColor", "#78ddd4");
      particles = null;
      break;
    case "Moss Green":
      setCSSVar("--leftSidebarColor", "black");
      setCSSVar("--pageColor", "radial-gradient(ellipse at bottom, #658d65, #0d2c0a)");
      setCSSVar("--pageColor2", "var(--pageColor)");
      setCSSVar("--contentColor", "#334e33");
      setCSSVar("--contentColor2", "#395839");
      setCSSVar("--contentColor3", "#426042");
      setCSSVar("--fontColor", "white");
      setCSSVar("--themeColor", "#78dd8a");
      particles = null;
      break;
    case "Ourple 😂":
      setCSSVar("--leftSidebarColor", "black");
      setCSSVar("--pageColor", "#4638a1");
      setCSSVar("--pageColor2", "var(--pageColor)");
      setCSSVar("--contentColor", "#5a4cb1");
      setCSSVar("--contentColor2", "#6459ab");
      setCSSVar("--contentColor3", "#6c62af");
      setCSSVar("--fontColor", "white");
      setCSSVar("--themeColor", "#bab3e9");
      particles = null;
      break;
    case "Peachy Mist":
      setCSSVar("--leftSidebarColor", "black");
      setCSSVar("--pageColor", "linear-gradient(315deg, #f0b980, pink)");
      setCSSVar("--pageColor2", "var(--pageColor)");
      setCSSVar("--contentColor", "#f9e5e8");
      setCSSVar("--contentColor2", "#f9dad7");
      setCSSVar("--contentColor3", "#f3c2d4");
      setCSSVar("--fontColor", "#46261b");
      setCSSVar("--themeColor", "#ed3950");
      particles = null;
      break;
    case "Faded":
      setCSSVar("--leftSidebarColor", "black");
      setCSSVar("--pageColor", "linear-gradient(295deg, #336264, #3a4048)");
      setCSSVar("--pageColor2", "var(--pageColor)");
      setCSSVar("--contentColor", "#497287");
      setCSSVar("--contentColor2", "#5a8399");
      setCSSVar("--contentColor3", "#6a91a5");
      setCSSVar("--fontColor", "white");
      setCSSVar("--themeColor", "#a9cfe9");
      particles = null;
      break;
    case "Into the Light":
      setCSSVar("--leftSidebarColor", "black");
      setCSSVar("--pageColor", "radial-gradient(circle at 30% 70%, #fbe286, #4caed3)");
      setCSSVar("--pageColor2", "var(--pageColor)");
      setCSSVar("--contentColor", "#e9e8c2");
      setCSSVar("--contentColor2", "#e3ddca");
      setCSSVar("--contentColor3", "#d9d4c4");
      setCSSVar("--fontColor", "#152c46");
      setCSSVar("--themeColor", "#1199dd");
      particles = null;
      break;
    case "Canyon":
      setCSSVar("--leftSidebarColor", "black");
      setCSSVar("--pageColor", "radial-gradient(ellipse at bottom, #d5610f, #581703)");
      setCSSVar("--pageColor2", "var(--pageColor)");
      setCSSVar("--contentColor", "#783715");
      setCSSVar("--contentColor2", "#7c3d1c");
      setCSSVar("--contentColor3", "#85401b");
      setCSSVar("--fontColor", "white");
      setCSSVar("--themeColor", "#e5986a");
      particles = null;
      break;
    case "Spocco":
      setCSSVar("--leftSidebarColor", "black");
      setCSSVar("--pageColor", "linear-gradient(180deg, #ededed 20%, #bbb8b8 80%)");
      setCSSVar("--pageColor2", "var(--pageColor)");
      setCSSVar("--contentColor", "#f1f1f1");
      setCSSVar("--contentColor2", "#ebedef");
      setCSSVar("--contentColor3", "#dce3e9");
      setCSSVar("--fontColor", "#242c32");
      setCSSVar("--themeColor", "#0db7c1");
      particles = null;
      break;
    case "Into the Night":
      setCSSVar("--leftSidebarColor", "black");
      setCSSVar("--pageColor", "radial-gradient(circle at 50% 20%, #3e5a72, #000)");
      setCSSVar("--pageColor2", "var(--pageColor)");
      setCSSVar("--contentColor", "#0b1218");
      setCSSVar("--contentColor2", "#0d151c");
      setCSSVar("--contentColor3", "#141f28");
      setCSSVar("--fontColor", "white");
      setCSSVar("--themeColor", "#758691");
      particles = null;
      break;
    default:
      setCSSVar("--leftSidebarColor", "#262630");
      setCSSVar("--pageColor", "#151617");
      setCSSVar("--pageColor2", "var(--pageColor)");
      setCSSVar("--contentColor", "#1f1f28");
      setCSSVar("--contentColor2", "#24242e");
      setCSSVar("--contentColor3", "#2a2a37");
      setCSSVar("--fontColor", "#ffffff");
      setCSSVar("--themeColor", "#5AB7FA");
      particles = null;
      break;
  }
}
function updateBackdrop(imageID) {
  if (imageID != null && hasPremium()) {
    findI("backdrop").style.backgroundImage = `url("https://photop-content.s3.amazonaws.com/Backdrops/${imageID}")`;
    findI("backdrop").style.opacity = 0.3;
  } else {
    findI("backdrop").style.opacity = 0;
  }
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

function createParticle() {
  if (particles == null || !viewingTab) {
    return;
  }
  let thisParticle = createElement("particle-" + particles, "div", findC("body"));
  thisParticle.style.left = (Math.random()*100) + "%";
  setTimeout(function () {
    thisParticle.remove();
  }, 15000);
}
setInterval(createParticle, (isMobile ? 1500 : 500));

if (getLocalStore("display") != null) {
  account.Settings = { Display: JSON.parse(getLocalStore("display")) };
  updateDisplay(account.Settings.Display.Theme);
  updateBackdrop(account.Settings.Backdrop);
}
/*
if (getLocalStore("lastUpdateView") != "PhotopRevamp") {
  let zoomedImageBlur = createElement("backBlur", "div", document.body);
  let zoomedImageHolder = createElement("zoomedImageHolder", "div", zoomedImageBlur);
  createElement("zoomedImage", "img", zoomedImageHolder).src = "./icons/revampnotif.svg";
  createElement("zoomedImageClose", "div", zoomedImageHolder).innerHTML = "&times;";
  zoomedImageBlur.style.animation = "imageBlurIn 0.2s";
  zoomedImageBlur.style.opacity = 1;
  zoomedImageHolder.style.transform = "scale(1)";
  zoomedImageBlur.addEventListener("click", function(event){
    zoomedImageBlur.style.opacity = 0;
    zoomedImageHolder.style.transform = "scale(0.9)";
    setTimeout(function () {
      event.target.closest(".backBlur").remove();
    }, 200);
  });
  setLocalStore("lastUpdateView", "PhotopRevamp");
}
*/

/*
if (Object.hasOwn(groups, "64572dc4a0d6c5cc756e73b8")) {
	document.addEventListener("keydown", ev => {
		if (ev.key.toLowerCase() == "p" && ev.ctrlKey) {
			e.preventDefault();
			
			showPopUp("it wrokss");
		}
	});
}
*/

showPopUp("Photop Script Menu", "It works!", [[ "Ok", "var(--themeColor" ]]);
