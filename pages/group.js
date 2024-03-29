wireframes.group = `
<div class="groupMembersHolder">
  <button class="groupMembersX">&times;</button>
  <div class="groupMembers"></div>
</div>
<div class="groupMainHolder">
  <div class="stickyContainer" id="groupTopBar">
    <button class="backButton" onclick="goBack()" id="groupBackButton">
      <svg height="80%" viewBox="0 0 149 135" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M139.58 57.9155C144.551 57.9155 148.58 61.945 148.58 66.9155V66.9155C148.58 71.8861 144.551 75.9155 139.58 75.9155L14.4797 75.9155V57.9155L139.58 57.9155Z" fill="var(--themeColor)"/> <path d="M59.8825 6.94142C63.5745 3.61341 69.0479 4.09106 72.1076 8.00827V8.00827C75.1674 11.9255 74.6548 17.7989 70.9628 21.1269L16.5707 70.1564L5.49049 55.9709L59.8825 6.94142Z" fill="var(--themeColor)"/> <path d="M59.8825 127.989C63.5745 131.317 69.0479 130.839 72.1076 126.922V126.922C75.1674 123.005 74.6548 117.132 70.9628 113.804L16.5707 64.774L5.49049 78.9595L59.8825 127.989Z" fill="var(--themeColor)"/> <ellipse cx="14.1039" cy="67.4041" rx="14.7752" ry="13.7539" transform="rotate(90 14.1039 67.4041)" fill="var(--themeColor)"/> </svg>
      <span id="backButtonArrow">Back</span>
    </button>
    <span id="groupInfo"></span>
    <div class="groupToolbar">
      <button class="groupToolbarButton" id="groupInvite">
        <svg viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg"> <g clip-path="url(#clip0_217_35)"> <path d="M242 260C242 272.368 232.248 285.987 211.038 297.105C190.3 307.976 160.958 315 128 315C95.0417 315 65.6996 307.976 44.9615 297.105C23.7515 285.987 14 272.368 14 260C14 247.632 23.7515 234.013 44.9615 222.895C65.6996 212.024 95.0417 205 128 205C160.958 205 190.3 212.024 211.038 222.895C232.248 234.013 242 247.632 242 260Z" stroke="var(--themeColor)" stroke-width="20"></path> <circle cx="128" cy="105" r="63" stroke="var(--themeColor)" stroke-width="20"></circle> <path d="M161.215 33.3877C161.213 33.4024 161.211 33.4167 161.21 33.4304C161.196 33.4321 161.182 33.4339 161.167 33.4356C160.504 33.5131 159.56 33.5195 157.839 33.5195H146.98C146.864 33.5195 146.749 33.5195 146.636 33.5195C144.199 33.519 142.54 33.5187 141.084 33.7332C132.355 35.0195 125.5 41.8745 124.214 50.6039C123.999 52.0593 124 53.7188 124 56.1551C124 56.2684 124 56.3833 124 56.5C124 56.6167 124 56.7316 124 56.8449C124 59.2812 123.999 60.9407 124.214 62.3961C125.5 71.1255 132.355 77.9805 141.084 79.2668C142.54 79.4813 144.199 79.481 146.636 79.4805C146.749 79.4805 146.864 79.4805 146.98 79.4805H157.839C159.56 79.4805 160.504 79.4869 161.167 79.5644C161.182 79.5661 161.196 79.5679 161.21 79.5696C161.211 79.5833 161.213 79.5976 161.215 79.6123C161.292 80.2758 161.299 81.2191 161.299 82.9402V94.0195C161.299 94.1362 161.299 94.2512 161.299 94.3645C161.298 96.8007 161.298 98.4602 161.512 99.9156C162.799 108.645 169.654 115.5 178.383 116.786C179.839 117.001 181.498 117 183.934 117C184.048 117 184.163 117 184.279 117C184.396 117 184.511 117 184.624 117C187.06 117 188.72 117.001 190.175 116.786C198.905 115.5 205.76 108.645 207.046 99.9156C207.261 98.4602 207.26 96.8007 207.26 94.3645C207.26 94.2512 207.26 94.1362 207.26 94.0195V82.9844C207.26 81.2407 207.266 80.2849 207.346 79.6134C207.347 79.599 207.349 79.5851 207.351 79.5716C207.364 79.5699 207.378 79.5682 207.393 79.5665C208.064 79.487 209.02 79.4805 210.764 79.4805H222.02C222.136 79.4805 222.251 79.4805 222.364 79.4805C224.801 79.481 226.46 79.4813 227.916 79.2668C236.645 77.9805 243.5 71.1255 244.786 62.3961C245.001 60.9407 245 59.2812 245 56.845C245 56.7317 245 56.6167 245 56.5C245 56.3833 245 56.2683 245 56.155C245 53.7188 245.001 52.0593 244.786 50.6039C243.5 41.8745 236.645 35.0195 227.916 33.7332C226.46 33.5187 224.801 33.519 222.364 33.5195C222.251 33.5195 222.136 33.5195 222.02 33.5195H210.764C209.02 33.5195 208.064 33.513 207.393 33.4335C207.378 33.4318 207.364 33.4301 207.351 33.4284C207.349 33.4149 207.347 33.401 207.346 33.3866C207.266 32.7151 207.26 31.7593 207.26 30.0156V18.9805C207.26 18.8638 207.26 18.7488 207.26 18.6355C207.26 16.1993 207.261 14.5398 207.046 13.0844C205.76 4.35497 198.905 -2.5 190.175 -3.78633C188.72 -4.0008 187.06 -4.00049 184.624 -4.00004C184.511 -4.00002 184.396 -4 184.279 -4C184.163 -4 184.048 -4.00002 183.934 -4.00004C181.498 -4.00049 179.839 -4.0008 178.383 -3.78633C169.654 -2.5 162.799 4.35497 161.512 13.0844C161.298 14.5398 161.298 16.1993 161.299 18.6355C161.299 18.7488 161.299 18.8638 161.299 18.9805V30.0598C161.299 31.7809 161.292 32.7242 161.215 33.3877ZM207.26 79.4804L207.26 79.4804L207.26 79.4804Z" fill="var(--themeColor)" stroke="var(--contentColor)" stroke-width="20"></path> </g> <defs> <clipPath id="clip0_217_35"> <rect width="256" height="256" fill="white"></rect> </clipPath> </defs> </svg>
      </button>
      <button class="groupToolbarButton" id="groupPins">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="20 3 160 160" fill="none">
          <rect x="93.9883" y="47.3272" width="52.0932" height="40.631" transform="rotate(40 93.9883 47.3272)" stroke="var(--themeColor)" stroke-width="10"></rect>
          <rect x="99.7234" y="5.48206" width="96.4131" height="35.1738" rx="11.5" transform="rotate(40 99.7234 5.48206)" stroke="var(--themeColor)" stroke-width="10"></rect>
          <rect x="50.526" y="64.1133" width="96.4131" height="24.2398" rx="11.5" transform="rotate(40 50.526 64.1133)" stroke="var(--themeColor)" stroke-width="10"></rect>
          <path d="M63.5714 106.931L77.968 119.011L52.5087 149.352C50.2012 152.102 46.1013 152.461 43.3513 150.154L38.9132 146.43C36.1633 144.122 35.8046 140.022 38.1121 137.272L63.5714 106.931Z" stroke="var(--themeColor)" stroke-width="10"></path>
        </svg>
      </button>
      <button class="groupToolbarButton" id="groupSettings">
        <svg viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M126.5 149C138.374 149 148 139.374 148 127.5C148 115.626 138.374 106 126.5 106C114.626 106 105 115.626 105 127.5C105 139.374 114.626 149 126.5 149Z" fill="var(--themeColor)"></path> <path d="M101 64L108.972 12.846C109.048 12.3591 109.467 12 109.96 12H144.04C144.533 12 144.952 12.3591 145.028 12.846L153 64" stroke="var(--themeColor)" stroke-width="20"></path> <path d="M153 192L145.028 243.154C144.952 243.641 144.533 244 144.04 244H109.96C109.467 244 109.048 243.641 108.972 243.154L101 192" stroke="var(--themeColor)" stroke-width="20"></path> <path d="M84.5744 182.517L36.2877 201.19C35.8281 201.367 35.3074 201.184 35.061 200.757L18.0211 171.243C17.7747 170.816 17.876 170.274 18.2598 169.964L58.5744 137.483" stroke="var(--themeColor)" stroke-width="20"></path> <path d="M169.426 73.4833L217.712 54.8103C218.172 54.6326 218.693 54.8162 218.939 55.243L235.979 84.757C236.225 85.1838 236.124 85.7265 235.74 86.0357L195.426 118.517" stroke="var(--themeColor)" stroke-width="20"></path> <path d="M195.426 137.483L235.74 169.964C236.124 170.274 236.225 170.816 235.979 171.243L218.939 200.757C218.693 201.184 218.172 201.367 217.712 201.19L169.426 182.517" stroke="var(--themeColor)" stroke-width="20"></path> <path d="M58.5744 118.517L18.2598 86.0357C17.876 85.7265 17.7747 85.1838 18.0211 84.757L35.061 55.243C35.3074 54.8162 35.8281 54.6326 36.2877 54.8103L84.5744 73.4833" stroke="var(--themeColor)" stroke-width="20"></path> <path d="M194 128C194 165.003 164.003 195 127 195C89.9969 195 60 165.003 60 128C60 90.9969 89.9969 61 127 61C164.003 61 194 90.9969 194 128Z" stroke="var(--themeColor)" stroke-width="20"></path> </svg>
      </button>
      <button class="groupToolbarButton" id="groupMenu">
        <svg viewBox="0 0 41.915 41.915"><g fill="var(--themeColor)"><path style="" id="Svg" d="M11.214,20.956c0,3.091-2.509,5.589-5.607,5.589C2.51,26.544,0,24.046,0,20.956c0-3.082,2.511-5.585,5.607-5.585 C8.705,15.371,11.214,17.874,11.214,20.956z"></path><path d="M26.564,20.956c0,3.091-2.509,5.589-5.606,5.589c-3.097,0-5.607-2.498-5.607-5.589c0-3.082,2.511-5.585,5.607-5.585 C24.056,15.371,26.564,17.874,26.564,20.956z"></path><path d="M41.915,20.956c0,3.091-2.509,5.589-5.607,5.589c-3.097,0-5.606-2.498-5.606-5.589c0-3.082,2.511-5.585,5.606-5.585 C39.406,15.371,41.915,17.874,41.915,20.956z"></path></g></svg>
      </button>
    </div>
  </div>
</div>
`;

pages.group = async function() {
  app.style.width = "1038px";

  let renderPost = await getModule("post");
  let createpost = await getModule("createpost");

  const groupMembersHolder = findC("groupMembersHolder");
  const groupMembers = findC("groupMembers");
  const mainHolder = findC("groupMainHolder");

  let paramID = getParam("group") || getParam("j");
  let groupID = paramID;
  let group = groups[groupID];
  if (group == null) {
    let [code, response] = await sendRequest("GET", "groups?groupid=" + groupID);
    if (code == 200) {
      group = JSON.parse(response);
      if (groups[group._id] != null) {
        groupID = group._id;
      }
      modifyParams("j");
      modifyParams("group", groupID);
    } else {
      showPopUp("Loading Group Failed", response, [["Back", "var(--grayColor)", goBack]]);
    }
  }
  if (group._id == null) {
    group._id = groupID;
  }
  group.LastChecked = Date.now();

  setAccountSub("home");

  tempListen(findC("groupMembersX"), "click", function(e) {
    groupMembersHolder.style.opacity = 0;
    groupMembersHolder.style.transform = "scale(0.95)";
    setTimeout(function () {
      groupMembersHolder.style.display = "none";
      groupMembersHolder.style.removeProperty("position");
    }, 200);
  });

  let notifHolder = findI(groupID + "notif");
  if (notifHolder != null) {
    notifHolder.remove();
  }
  let groupIcon = "";
  if (group.Icon != null) {
    groupIcon = `<img src="${config.assets}GroupImages/${group.Icon}" class="groupIconInGroup" type="imageenlarge">`;
  }
  findI("groupInfo").innerHTML = `<div class="groupInfoInGroup">${groupIcon}<div class="groupName" style="font-size: 20px; color: var(--fontColor)">${group.Name}</div></div>`;

  let pinsButton = findI("groupPins")
  pinsButton.addEventListener("click", async function() {
    if(pinsButton.getAttribute("active") != null) {
      pinsButton.removeAttribute("active")
      pinsButton.style.opacity = 1;
      loadPosts()
    } else {
      pinsButton.setAttribute("active", "")
      pinsButton.style.opacity = .4;
      loadPosts(undefined, true)
    }
  })

  //let [code, response] == await sendRequest()
  let inviteButton = findI("groupInvite");
  inviteButton.addEventListener("click", async function() {
    let modalCode = showPopUp("Invite to Group", `<div class="groupTabs" id="tabs">
<span class="tab" type="usernames" id="tab-usernames" tabindex="0">Users</span>
<span class="tab" type="links" id="tab-links" tabindex="0">Links</span>
</div>`, [["Close", "var(--grayColor)"]]);
    let groupTabs = ["usernames", "links"];
    let currentGroupTab = "";
    let modalContent = findI("modalText" + modalCode);
    let tabRenders = {
      usernames: async function () {
        let tabHolder = findC("groupHolder-usernames");
        let inviteInput = createElement("settingsInput", "input", tabHolder);
        inviteInput.setAttribute("placeholder", "Type a User");
        let inviteUsername = createElement("invitePreview", "span", tabHolder);
        let inviteHolder = createElement("invites", "div", tabHolder);
        inviteUsername.style.display = "none";
        inviteInput.addEventListener("input", async function() {
          if (inviteInput.value.replace(/\s/g, "").length > 0) {
            let [code, response] = await sendRequest("GET", "user/search?type=invite&term=" + inviteInput.value);
            if (code == 200) {
              let data = JSON.parse(response);
              if (data.length > 0) {
                inviteUsername.style.display = "flex";
                inviteUsername.innerHTML = `<img src="${decideProfilePic(data[0])}" class="invitePfp"><span class="inviteUsernameUsername">${data[0].User}</span><button class="inviteButton">Invite</button>`;
                let inviteButton = inviteUsername.querySelector("button");
                inviteButton.addEventListener("click", async function () {
                  let [code, response] = await sendRequest("POST", "groups/invite?groupid=" + groupID, {type: "user", data: data[0]._id});
                  if (code == 200) {
                    inviteUsername.style.display = "none";
                    inviteInput.value = "";
                    createUserInvite({ _id: response, User: data[0]._id, new: true, userData: data[0] });
                  } else {
                    showPopUp("An Error Occured", response, [["Okay", "var(--grayColor)"]]);
                  }
                });
              } else {
                inviteUsername.style.display = "none";
              }
            }
          } else {
            inviteUsername.style.display = "none";
          }
        });
        function createUserInvite(data) {
          let thisInvite = createElement("inviteUsernameTile", "span", inviteHolder);
          if (data.new == true) {
            if (inviteHolder.firstChild != null) {
              inviteHolder.insertBefore(thisInvite, inviteHolder.firstChild);
            }
            thisInvite.style.animation = "scale-in-center 0.5s cubic-bezier(0.1, 0.8, 0.3, 1) both";
          }
          thisInvite.innerHTML = `<img src="${decideProfilePic(data.userData)}" type="user" userid="${data.User}" class="invitePfp"><span class="inviteUsernameUsername" type="user" userid="${data.User}">${data.userData.User}</span><span class="removeLink" tabindex="0">&times;</span>`;
          thisInvite.querySelector(".removeLink").addEventListener("click", async function () {
            thisInvite.style.opacity = 0.5;
            let [code2, response2] = await sendRequest("DELETE", "groups/revoke?inviteid=" + data._id);
            if (code2 == 200) {
              thisInvite.remove();
            } else {
              thisInvite.style.opacity = 1;
              showPopUp("An Error Occured", response2, [["Okay", "var(--grayColor)"]]);
            }
          });
        }
        let lastTimestamp = 0;
        async function loadUserInvites(before) {
          let sendURL = "groups/sentinvites?type=user&groupid=" + groupID;
          if (before != null) {
            sendURL += "&before=" + before;
          }
          let [code2, response2] = await sendRequest("GET", sendURL);
          if (code2 == 200) {
            let invites = JSON.parse(response2);
            let userInvites = invites.members;
            let users = getObject(invites.users, "_id");
            for (let i = 0; i < userInvites.length; i++) {
              createUserInvite({ ...userInvites[i], userData: users[userInvites[i].User] });
            }
            if (userInvites.length > 5) {
              lastTimestamp = userInvites[userInvites.length-1].Timestamp;
              loadMoreButton = createElement("loadMoreButton", "div", inviteHolder);
              loadMoreButton.textContent = "Load More...";
              loadMoreButton.addEventListener("click", function() {
                loadMoreButton.remove();
                loadUserInvites(lastTimestamp);
              });
            }
          }
        }
        loadUserInvites();
      },
      links: async function () {
        let linksHolder = findC("groupHolder-links");
        let loadMoreButton;
        let newInvite = createElement("newInvite", "button", linksHolder);
        newInvite.textContent = "New Link";
        function createLinkInvite(data) {
          let thisInvite = createElement("inviteLink", "div", linksHolder);
          if (data.new == true) {
            if (newInvite.nextElementSibling != null) {
              linksHolder.insertBefore(thisInvite, newInvite.nextElementSibling);
            }
            thisInvite.style.animation = "scale-in-center 0.5s cubic-bezier(0.1, 0.8, 0.3, 1) both";
          }
          thisInvite.innerHTML = `<div class="link" onclick="copyClipboardText('https://app.photop.live/?j=${data._id}')">https://app.photop.live/?j=${data._id}</div> <span class="removeLink" tabindex="0">&times;</span>`;
          thisInvite.querySelector(".removeLink").addEventListener("click", async function () {
            thisInvite.style.opacity = 0.5;
            let [code2, response2] = await sendRequest("DELETE", "groups/revoke?inviteid=" + data._id);
            if (code2 == 200) {
              thisInvite.remove();
            } else {
              thisInvite.style.opacity = 1;
              showPopUp("An Error Occured", response2, [["Okay", "var(--grayColor)"]]);
            }
          });
        }
        newInvite.addEventListener("click", async function() {
          let [code, response] = await sendRequest("POST", "groups/invite?groupid=" + groupID, { type: "link" });
          if (code == 200) {
            createLinkInvite({ _id: response, new: true });
          } else {
            showPopUp("An Error Occured", response, [["Okay", "var(--grayColor)"]]);
          }
        });
        let lastTimestamp = 0;
        async function loadLinkInvites(before) {
          let sendURL = "groups/sentinvites?type=link&groupid=" + groupID;
          if (before != null) {
            sendURL += "&before=" + before;
          }
          let [code2, response2] = await sendRequest("GET", sendURL);
          if (code2 == 200) {
            let invites = JSON.parse(response2);
            let linkInvites = invites.links;
            for (let i = 0; i < linkInvites.length; i++) {
              createLinkInvite(linkInvites[i]);
            }
            if (linkInvites.length > 5) {
              lastTimestamp = linkInvites[linkInvites.length-1].Timestamp;
              loadMoreButton = createElement("loadMoreButton", "div", linksHolder);
              loadMoreButton.textContent = "Load More...";
              loadMoreButton.addEventListener("click", function() {
                loadMoreButton.remove();
                loadLinkInvites(lastTimestamp);
              });
            }
          }
        }
        loadLinkInvites();
      }
    }
    function changeGroupTab(type) {
      if (currentGroupTab == type) {
        return;
      }
      let tabs = [...groupTabs];
      currentGroupTab = type;
      tabs.splice(tabs.indexOf(type), 1);
      for (let i in tabs) {
        findI("tab-" + tabs[i]).classList.remove("selected");
        if (findC("groupHolder-" + tabs[i]) != null) {
          findC("groupHolder-" + tabs[i]).remove();
        }
      }
      createElement("groupHolder-" + type, "div", modalContent);
      findI("tab-" + type).classList.add("selected");
      tabRenders[type]();
    }
    for (let i = 0; i < groupTabs.length; i++) {
      findI("tab-" + groupTabs[i]).addEventListener("click", function() {
        changeGroupTab(groupTabs[i])
      });
    }
    changeGroupTab("usernames");
  });
  let settingsButton = findI("groupSettings");
  settingsButton.addEventListener("click", function() {
    /*if (account.Settings != null && account.Settings.ProfileBanner != null) {
      groupIcon = `<img class="groupSettingsIcon" src="${config.assets + "ProfileBanners/" + account.Settings.ProfileBanner}">`;
    } else {
      groupIcon = `<div class="groupSettingsIcon" style="background: var(--contentColor)"></div>`;
    }*/
    showPopUp("Group Settings", `<input id="imageInputGroupIcon" type="file" accept="image/*" hidden="true"><span class="settingsTitle">Name</span><input type="text" placeholder="Group Name" class="settingsInput" id="inputName" value="${group.Name}"><span class="settingsTitle">Icon</span><input id="imageInputGroupIcon" type="file" accept="image/*" multiple="true" hidden="true"><div class="groupIconCreate">
          <img class="groupIconCreateHolder" ${group.Icon != null ? `src="${config.assets}GroupImages/${group.Icon}" style="display: unset;"` : ""}>
          <div class="settingsUploadButton"></div>
        </div>
        <span class="settingsTitle">Invites</span>
        <input type="radio" name="invites" value="Anyone" id="inviteAnyone" ${group.Invite == "Anyone" ? `checked="true"` : ""}><label for="inviteAnyone" class="radioLabel">Anyone Can Invite</label>
        <input type="radio" name="invites" value="You" id="inviteYou" ${group.Invite == "Self" ? `checked="true"` : ""}><label for="inviteYou" class="radioLabel">Only You Can Invite</label>`, [["Save Edits", "var(--themeColor)", async function() {
      let groupName = findI("inputName").value;
      if (groupName.length < 1 || groupName.length > 30) {
        showPopUp("Invalid Group Name", "Group names must be between 1 and 30 characters.", [["Okay", "var(--grayColor)"]]);
        return;
      }
      let sendFormData = new FormData();
      sendFormData.append("data", JSON.stringify({ name: groupName, invite: (findI("inviteAnyone").checked ? "member" : "owner") }));
      if (imageHolder.src != null && imageHolder.src.startsWith("blob:")) {
        await fetch(imageHolder.src).then(async function(file) {
          sendFormData.append("image", await file.blob());
          URL.revokeObjectURL(imageHolder.src);
        });
      }
      let [code, response] = await sendRequest("PUT", "groups/edit?groupid=" + groupID, sendFormData, true);
      if (code != 200) {
        showPopUp("An Error Occured", response, [["Okay", "var(--grayColor)"]]);
      }
    }], ["Cancel", "var(--grayColor)"]]);
    let imageUpload = findI("imageInputGroupIcon");
    let imageHolder = findC("groupIconCreateHolder");
    tempListen(findC("groupIconCreate"), "click", function() {
      imageUpload.click();
    });
    tempListen(imageUpload, "change", function(e) {
      let file = e.target.files[0];
      let premium = hasPremium();
      if (file.type.substring(0, 6) == "image/") {
        if (supportedImageTypes.includes(file.type.replace(/image\//g, "")) == true) {
          if (file.size < 2097153 || (file.size < 2097153 * 2 && premium)) { // 2 MB
            if (imageHolder.src != null) {
              URL.revokeObjectURL(imageHolder.src);
            }
            let blob = URL.createObjectURL(file);
            imageHolder.src = blob;
            imageHolder.style.display = "unset";
          } else {
            if (premium) {
              showPopUp("Image too Large", "Images must be under 4 MB in size.", [["Okay", "var(--grayColor)"]]);
            } else {
              showPopUp("Image too Large", `Your image must be under 2MB.${premiumPerk("Upload limits are doubled! Use a ≤4MB image as your group icon.")}`, [["Okay", "var(--grayColor)"]]);
            }
          }
        } else {
          showPopUp("Invalid Image Type", `Photop only accepts images of the following types: <i style='color: #bbb'>${(supportedImageTypes.join(", "))}</i>${file.type.replace(/image\//g, "") == "gif" ? premiumPerk("Upload GIFs to use as your group icon!") : ""}`, [["Okay", "var(--grayColor)"]]);
        }
      } else {
        showPopUp("Must be an Image", "Only image files can be uploaded to Photop.", [["Okay", "var(--grayColor)"]]);
      }
    });
  });
  let menuButton = findI("groupMenu");
  let dropdownOptions = [];
  function leaveGroup(name, title, desc) {
    showPopUp(title, desc, [[name, "#FF5C5C", async function() {
      let [code, response] = await sendRequest("DELETE", "groups/leave?groupid=" + groupID);
      if (code == 200) {
        delete groups[groupID];
        setAccountSub();
        setPage("groups");
      } else {
        showPopUp("Error Leaving", response, [["Okay", "var(--grayColor)"]]);
      }
    }], ["Wait, no", "var(--grayColor)"]]);
  }
  if (groups[groupID] != null) {
		let bannedHolder;
		function createBanned(data) {
			let thisBanned = createElement("inviteUsernameTile", "span", bannedHolder);
			thisBanned.innerHTML = `<img src="${decideProfilePic(data.userData)}" class="invitePfp"><span class="inviteUsernameUsername">${data.userData.User}</span>${group.Owner == userID?`<span class="removeLink" tabindex="0">&times;</span>`:''}`;
			thisBanned.style.width = "calc(100% - 8px)";
			if(group.Owner == userID) {
				thisBanned.querySelector(".removeLink").addEventListener("click", async function () {
					thisBanned.style.opacity = 0.5;
					let [code2, response2] = await sendRequest("PUT", "groups/moderate?groupid=" + getParam("group"), { type: "unban", data: data._id});
					if (code2 == 200) {
						thisBanned.remove();
						if (bannedHolder.children.length == 0) {
							bannedHolder.innerHTML = "No one is banned.";
						}
					} else {
						thisBanned.style.opacity = 1;
						showPopUp("An Error Occured", response2, [["Okay", "var(--grayColor)"]]);
					}
				});
			}
		}
    let newPost = findC("newPost");
    if (newPost == null) {
      createpost("groupMainHolder");
    }
    if (group.Owner != userID) {
      settingsButton.style.visibility = "hidden";
      settingsButton.style.display = "none";
      if (group.Invite != "Anyone") {
        inviteButton.style.visibility = "hidden";
        inviteButton.style.display = "none";
      } else {
        inviteButton.style.visibility = "unset";
        inviteButton.style.display = "unset";
      }
      dropdownOptions.push(["Leave Group", "#FF5C5C", function() {
        leaveGroup("Leave", "Leave Group?", "Are you sure you want to leave this group?");
      }]);
    } else {
      settingsButton.style.visibility = "unset";
      inviteButton.style.visibility = "unset";
      dropdownOptions.push(["Delete Group", "#FF5C5C", function() {
        leaveGroup("Delete", "Delete Group?", "Are you sure you want to delete this group?");
      }]);
    }
		if(group.Owner == userID || group.isMod) {
			dropdownOptions.push(["Banned Users", "var(--themeColor)", async function() {
				let bannedModal = showPopUp("Banned Users", "", [["Close", "gray"]]);
				bannedHolder = findI("modalText" + bannedModal);
				let [code, response] = await sendRequest("GET", "groups/banned?groupid=" + getParam("group"));
				if (code == 200) {
					let banned = JSON.parse(response);
					for (var i in banned) {
						createBanned({_id: banned[i]._id, userData: banned[i]});
					}
					if (bannedHolder.children.length == 0) {
						bannedHolder.innerHTML = "No one is banned.";
					}
				} else {
					showPopUp("An Error Occured", response, [["Okay", "var(--grayColor)"]]);
				}
			}]);
		}
  } else {
    inviteButton.style.visibility = "hidden";
    inviteButton.style.display = "none";
    settingsButton.style.visibility = "hidden";
    settingsButton.style.display = "none";
    let toolbar = findC("groupToolbar");
    let joinButton = createElement("groupJoinButton", "button", toolbar);
    joinButton.textContent = "Join";
    toolbar.insertBefore(joinButton, menuButton);
    joinButton.addEventListener("click", async function() {
      if (userID == null) {
        promptLogin('Join the hangout today! You must <b>sign in</b> or <b>sign up</b> before being able to <b style="color: var(--themeColor)">Join</b> a group!')
        return;
      }
      let [code, response] = await sendRequest("GET", "groups/join?groupid=" + paramID);
      if (code == 200) {
        modifyParams("j");
        modifyParams("group", groupID);
        refreshPage();
      } else {
        if (response == "Max of 25 joined groups.") {
          showPopUp("Couldn't Join", `You can only join up to 25 groups. ${premiumPerk("Join up to 75 groups at once!")}`, [["Premium", "var(--premiumColor)", function() { setPage("premium"); }],["Okay", "var(--grayColor)"]])
        } else if (response == "Max of 75 joined groups.") {
          showPopUp("Couldn't Join", `You can only join up to 75 groups.`, [["Okay", "var(--grayColor)"]]);
        } else {
          showPopUp("Couldn't Join", response, [["Okay", "var(--grayColor)"]]);
        }
      }
    });
  }
  dropdownOptions.push(["Copy GroupID", "var(--themeColor)", function() {
    copyClipboardText(groupID);
  }]);
  menuButton.addEventListener("click", function() {
    let finalOptions = [...dropdownOptions];
    if (window.innerWidth < 1075) {
      finalOptions.unshift(["View Members", "var(--themeColor)", function() {
        groupMembersHolder.style.position = "fixed";
        groupMembersHolder.style.display = "unset";
        setTimeout(function () {
          groupMembersHolder.style.opacity = 1;
          groupMembersHolder.style.transform = "translateX(0)";
        }, 1);
        updateLoadedPics();
      }]);
    }
    if (window.innerWidth < 450) {
      finalOptions.unshift([(pinsButton.style.opacity == 0.4 ? "All Posts" : "Pins"), (pinsButton.style.opacity == 0.4 ? "var(--themeColor)" : "rgb(201, 94, 255)"), function () {
        pinsButton.click();
      }]);
      if (settingsButton.style.visibility != "hidden") {
        finalOptions.unshift(["Settings", "var(--themeColor)", function () {
          settingsButton.click();
        }]);
      }
      if (inviteButton.style.visibility != "hidden") {
        finalOptions.unshift(["Invite", "var(--chatColor)", function () {
          inviteButton.click();
        }]);
      }
    }
    showDropdown(menuButton, "left", finalOptions);
  });
  let membersHolder = findC("groupMembers");
  function createTile(member, isMod) {
    let thisMember = findI(member._id);
    if (thisMember != null) {
			if(member.Status == -1) {
	      if (thisMember.parentElement.childElementCount == 1) {
	        thisMember.parentElement.remove();
	      } else {
	        thisMember.remove();
	      }
			}
			if(thisMember.querySelector(".GroupModeratorTag") == null && member.promoted) {
				let moderatorTag = createElement("GroupModeratorTag", "span", thisMember);
				moderatorTag.style = "margin-right: 4px; color: #bbb;";
				moderatorTag.innerText = "Moderator |";
				
				thisMember.querySelector(".groupMemberStatus").prepend(moderatorTag);
			}
			if(thisMember.querySelector(".GroupModeratorTag") != null && member.demoted) {
				thisMember.querySelector(".GroupModeratorTag").remove();
			}
      return;
    }
    let statusID = Math.max(member.Status || 0, 0);
    let status = statuses[statusID];
    if (member.ViewingGroupID != null && statusID == 2 && member.ViewingGroupID != group._id) {
      statusID = 1;
      status = statuses[statusID];
    }
    let section = findI("groupSection" + statusID);
    if (section == null) {
      section = createElement("groupMemberSection", "div", membersHolder);
      section.id = "groupSection" + statusID;
      section.style.order = statusID * -1;
    }
    if (thisMember == null && member.User) {
      thisMember = createElement("groupMember", "div", section);
      thisMember.id = member._id;
      thisMember.setAttribute("username", member.User);
			thisMember.setAttribute("userid", member._id);
      thisMember.setAttribute("type", "user");
			
			thisMember.addEventListener("contextmenu", function(e) {
				let ddOptions = [["View Profile", "var(--themeColor)", function () {
					showPreview(thisMember, member._id);
				}]];
				if (group.Owner == userID && member._id != userID) {
					if (isMod) {
						ddOptions.push(["Demote", "#FF5C5C", async function () {
							showPopUp("Demote " + thisMember.getAttribute("username") + "?", "Are you sure you want to demote <b>" + thisMember.getAttribute("username") + "</b>? They will no longer be a moderator.", [["Demote", "#FF5C5C", async function() {
								let [code, response] = await sendRequest("PUT", "groups/moderate?groupid=" + getParam("group"), { type: "demote", data: member._id });
								if (code != 200) {
									showPopUp("Failed to Demote", response, [["Okay", "var(--grayColor)"]]);
								}
							}], ["Cancel", "var(--grayColor)"]]);
						}]);
					} else {
						ddOptions.push(["Promote", "var(--themeColor)", async function () {
							showPopUp("Promote " + thisMember.getAttribute("username") + "?", "Are you sure you want to promote <b>" + thisMember.getAttribute("username") + "</b>? They will become a moderator and will be able to delete posts and ban/kick users in this group.", [["Promote", "var(--themeColor)", async function() {
								let [code, response] = await sendRequest("PUT", "groups/moderate?groupid=" + getParam("group"), { type: "promote", data: member._id });
								if (code != 200) {
									showPopUp("Failed to Promote", response, [["Okay", "var(--grayColor)"]]);
								}
							}], ["Cancel", "var(--grayColor)"]]);
						}]);
					}
				}
				if ((group.Owner != member._id && !isMod && member._id != userID) && (group.Owner == userID || group.Moderator)) {
					ddOptions.push(["Ban from Group", "#FF5C5C", async function () {
						showPopUp(`Ban ${thisMember.getAttribute("username")} from Group?`, `Are you sure you want to ban <b>${thisMember.getAttribute("username")}</b> from the group? They will not be able to rejoin.`, [["Ban", "#FF5C5C", async function () {
							let [code, response] = await sendRequest("PUT", "groups/moderate?groupid=" + getParam("group"), { type: "ban", data: member._id });
							if (code != 200) {
								showPopUp("Failed to Ban", response, [["Okay", "var(--grayColor)"]]);
							} else {
								thisMember.remove();
							}
						}], ["Cancel", "var(--grayColor)"]]);
					}]);
					ddOptions.push(["Kick from Group", "#FF5C5C", async function () {
						showPopUp("Kick " + thisMember.getAttribute("username") + "?", "Are you sure you want to kick <b>" + thisMember.getAttribute("username") + "</b> from the group? They will be able to rejoin with a new invite.", [["Kick", "#FF5C5C", async function() {
							let [code, response] = await sendRequest("PUT", "groups/moderate?groupid=" + getParam("group"), { type: "kick", data: member._id });
							if (code != 200) {
								showPopUp("Failed to Kick", response, [["Okay", "var(--grayColor)"]]);
							} else {
								thisMember.remove();
							}
						}], ["Cancel", "var(--grayColor)"]]);
					}]);
				}
				if (member._id != userID && userID != null) {
					ddOptions.push(["Block User", "#FF8652", function() {
						blockUser(member._id, thisMember.getAttribute("username"));
					}]);
				}
				ddOptions.push(["Copy ID", "var(--themeColor)", function () {
					copyClipboardText("/User_" + member._id);
				}]);
				
				showDropdown(thisMember, "left", ddOptions);
				e.preventDefault();
			})
    } else if (thisMember.parentElement.id != "groupSection" + statusID) {
      if (thisMember.parentElement.childElementCount == 1) {
        thisMember.parentElement.remove();
      }
      section.appendChild(thisMember);
    }
    thisMember.setAttribute("username", member.User);
    thisMember.innerHTML = `<img loadsrc="${decideProfilePic(member)}" class="groupMemberPfp">
    <div class="groupMemberInfo">
    <div class="groupMemberUsername">${getRoleHTML(member)}${member.User}</div>
    <div class="groupMemberStatus" style="color: ` + status[1] + `;">
      ${group.Owner == member._id ? '<span style="margin-right: 4px; color: #bbb;" class="GroupOwnerTag">Owner |</span>' : ""}
      ${isMod ? '<span style="margin-right: 4px; color: #bbb;" class="GroupModeratorTag">Moderator |</span>' : ""}
      <span class="groupMemberStatusCircle" style="background: ${status[1]}"></span>
      <span class="groupMemberStatusTx">${status[0]}</span>
    </div>
    </div>`;
    let image = thisMember.querySelector(".groupMemberPfp");
    let rect = image.getBoundingClientRect();
    if ((rect.y) + (image.offsetHeight) > 0 && rect.y < membersHolder.clientHeight) {
      image.setAttribute("src", image.getAttribute("loadsrc"));
      image.removeAttribute("loadsrc");
      image.style.opacity = 1;
    }
  }
  async function asyncLoadMembers() {
    findC("groupMembers").innerHTML = "";
    let [code, response] = await sendRequest("GET", "groups/members?groupid=" + groupID);
    if (code == 200) {
      let res = JSON.parse(response);
      let members = res.Members || res;
			group.Moderators = res.Moderators;
      for (let i = 0; i < members.length; i++) {
        createTile(members[i], (res.Moderators.indexOf(members[i]._id) >= 0));
      }
    } else {
      showPopUp("Loading Members Failed", response, [["Okay", "var(--grayColor)"]]);
    }
  }
  asyncLoadMembers();
  function updateLoadedPics() {
    let loopThroughImgs = membersHolder.querySelectorAll(".groupMemberPfp:not([src])");
    for (let i = 0; i < loopThroughImgs.length; i++) {
      let image = loopThroughImgs[i];
      let rect = image.getBoundingClientRect();
      if ((rect.y) + (image.offsetHeight) > 0 && rect.y < membersHolder.clientHeight) {
        image.setAttribute("src", image.getAttribute("loadsrc"));
        image.removeAttribute("loadsrc");
        image.style.opacity = 1;
      }
    }
  }
  tempListen(membersHolder, "scroll", updateLoadedPics);
  subscribes.push(socket.subscribe({ task: "group", groupID: groupID }, function(data) {
		if(!group.Moderators) group.Moderators = [];
		
    switch (data.type) {
      case "member":
        createTile(data.member, group.Moderators.includes(data.member._id));
        break;
      case "refresh":
        refreshPage();
        break;
      case "refreshPinned":
        if(pinsButton.getAttribute("active") != null) {
          loadPosts(undefined, true);
        }
        break;
    }
  }));

  let observer = new IntersectionObserver(handleIntersection);
  let loadingPosts = false;
  async function loadPosts(before, pins) {
    postHolder = findC("postHolder");
    loadingPosts = true;
    let getURL = "posts/get?groupid=" + groupID;
    if(pins == true) {
      getURL += "&pins=true";
    }
    if (before != null) {
      getURL += "&before=" + before;
    } else {
      if (postHolder != null) {
        postHolder.remove();
        postHolder = null;
      }
    }
    if (postHolder == null) {
      postHolder = createElement("postHolder", "div", "groupMainHolder");
    }
    let notifHolder = findI(groupID + "notif");
    if (notifHolder != null) {
      notifHolder.remove();
    }
    let [code, response] = await sendRequest("GET", getURL);
    if (code == 200) {
      let data = JSON.parse(response);
      let posts = data.posts;
      let polls = getObject(data.polls, "_id");
      let users = getObject(data.users, "_id");
      let likes = getObject(data.likes, "_id");
      for (let i = 0; i < posts.length; i++) {
        let post = posts[i];
        let props = { isLiked: (likes[post._id + userID] != null), observer, poll: polls[post._id] };
        if(post.GroupPin) {
          props.isPinned = true;
        }

        renderPost(postHolder, post, users[post.UserID], props);
      }
      if (posts.length > 14) {
        loadingPosts = false;
      } else if(!pins) {
        if (posts.length > 0 || before != null) {
          createTooltip(postHolder, "It all started with a BANG! 💥💥💥");
        } else {
          createTooltip(postHolder, "Hmm... Nothing yet... Start the Hangout?");
        }
      } else if(pins) {
        if(posts.length > 0 || before != null) {
          createTooltip(postHolder, "I wonder why the post above me was the first pin...");
        } else {
          createTooltip(postHolder, "Hmm, no pins. That owner has some standards!");
        }
      }
      setPostUpdateSub();
      setupPostChats();
      updateChatting(posts);
    }
  }

  loadPosts();
  window.refreshPostsFunction = loadPosts;

  tempListen(document, "scroll", function() {
    if (postHolder != null && (window.innerHeight + window.scrollY) >= postHolder.offsetHeight - 500 && !loadingPosts) {
      if(pinsButton.getAttribute("active") == null) {
        loadPosts(postHolder.lastChild.getAttribute("time"), false);
      } else {
        loadPosts(postHolder.lastChild.getAttribute("time"), true);
      }
    }
  });

  let lastHidden;
  function resizePage() {
    let setHidden;
    if (window.innerWidth < 1075) {
      setHidden = true;
    } else {
      setHidden = false;
    }
    if (setHidden == lastHidden) {
      return;
    }
    lastHidden = setHidden;

    if (setHidden == true) {
      groupMembersHolder.style.display = "none";
      groupMembersHolder.style.right = "0px";
      groupMembersHolder.style.opacity = 0;
      groupMembersHolder.style.transform = "scale(0.95)";
      mainHolder.style.width = "100%";
      app.style.width = "850px";
    } else {
      groupMembersHolder.style.removeProperty("display");
      groupMembersHolder.style.removeProperty("position");
      groupMembersHolder.style.removeProperty("right");
      groupMembersHolder.style.removeProperty("opacity");
      groupMembersHolder.style.removeProperty("transform");
      groupMembers.style.paddingLeft = "";
      mainHolder.style.width = "calc(100% - 206px)";
      app.style.width = "1038px";
      updateLoadedPics();
    }
  }
  tempListen(window, "resize", resizePage);
  resizePage();
}