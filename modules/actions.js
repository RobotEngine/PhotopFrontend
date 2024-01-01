//check the bottom of the file for more post stuff

let openMobilePost;
let mobilePostIsOpen = false;
let openMobilePostRect;
let openMobilePostSpacer;
let existingMargin;
async function openMobilePostView(post) {
  openMobilePost = post;
  mobilePostIsOpen = true;
  scrollingEnabled = false;

  existingMargin = post.style.margin;
  openMobilePostRect = post.getBoundingClientRect();
  openMobilePostSpacer = createElement("postSpacer", "div", post, { width: openMobilePostRect.width + "px", height: openMobilePostRect.height + "px", margin: existingMargin, "margin-bottom": post.style.marginBottom });
  if (existingMargin != "") {
    openMobilePostSpacer.style.margin = existingMargin;
  } else {
    openMobilePostSpacer.style.marginBottom = "8px";
  }
  post.parentElement.insertBefore(openMobilePostSpacer, post);

  post.style.position = "fixed";
  post.style.width = openMobilePostRect.width + "px";
  post.style.height = openMobilePostRect.height + "px";
  post.style.left = openMobilePostRect.left + "px";
  post.style.top = openMobilePostRect.top + "px";
  post.style.margin = "0px";
  post.style.zIndex = "999";
  post.style.transition = "0.35s ease-in-out";
  post.querySelector(".postPost").style.transition = "0.35s";

  let postChat = post.querySelector(".postChat");
  postChat.style.opacity = 0;
  postChat.style.display = "";
  postChat.style.width = "calc(100% - 16px)";
  postChat.style.height = "calc(100% - 58px)";
  postChat.style.top = "8px";
  postChat.style.left = "8px";
  postChat.style.borderRadius = "12px";
  postChat.style.transition = "0.35s";

  post.querySelector(".postPost").style.pointerEvents = "none";
  postChat.style.pointerEvents = "all";

  await sleep(1);
  post.style.width = "100%";
  post.style.height = "100%";
  post.style.top = "0px";
  post.style.left = "0px";
  post.style.borderRadius = "0px";
  post.querySelector(".postPost").style.opacity = 0;
  postChat.style.opacity = 1;
  //await sleep(350);
  post.querySelector(".postChatHolder").scrollTo({ top: post.querySelector(".postChatHolder").scrollHeight });
  let mobileChatBackButton = createElement("mobileChatBackButton", "div", post);
  mobileChatBackButton.innerHTML = `<svg width="32" height="32" viewBox="0 0 410 237" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M36 36L196.515 196.515C201.201 201.201 208.799 201.201 213.485 196.515L374 36" stroke="var(--themeColor)" stroke-width="72" stroke-linecap="round"/> </svg>`;
  mobileChatBackButton.addEventListener("click", closeMobileChat);
}
async function closeMobileChat() {
  if (mobilePostIsOpen == false) {
    return;
  }
  mobilePostIsOpen = false;
  scrollingEnabled = true;

  openMobilePost.querySelector(".mobileChatBackButton").remove();
  openMobilePost.querySelector(".postPost").style.pointerEvents = "all";
  openMobilePost.querySelector(".postChat").style.pointerEvents = "none";

  openMobilePost.style.width = openMobilePostRect.width + "px";
  openMobilePost.style.height = openMobilePostRect.height + "px";
  openMobilePost.style.left = openMobilePostRect.left + "px";
  openMobilePost.style.top = openMobilePostRect.top + "px";
  openMobilePost.style.borderRadius = "";
  openMobilePost.querySelector(".postPost").style.opacity = 1;
  openMobilePost.querySelector(".postChat").style.opacity = 0;
  await sleep(350);
  openMobilePost.style.transition = "";
  openMobilePost.style.position = "";
  openMobilePostSpacer.remove();
  openMobilePost.style.width = "";
  openMobilePost.style.height = "";
  openMobilePost.style.left = "";
  openMobilePost.style.top = "";
  openMobilePost.style.margin = existingMargin;
  openMobilePost.style.zIndex = "";
}

modules.actions = function() {
  body.addEventListener("click", async function(e) {
    if (e.button != 0) {
      return;
    }
    let path = e.path || (e.composedPath && e.composedPath());
    let button = path[0].closest("[type]");
    let type = "";
    if (button != null) {
      type = button.getAttribute("type");
    }
    if (e.target.hasAttribute("href") == true) {
      return;
    }

    let actions = {
      // Post Actions:
			post: async function(button, post) {
				if(isMobile) {
					openMobilePostView(path[0].closest(".post"));
					return;
				}
				let postData = getObject(cache.posts, "_id")[post.getAttribute("postid")];
				post.setAttribute("enlarged", "");

				let backBlur = createElement("backBlur", "div", "body");
				backBlur.id = "backBlur" + post.getAttribute("postid");

				let postEnlarged = createElement("enlargedPost", "div", backBlur);
				postEnlarged.innerHTML = `
					<div class="enlargedPostUser">
						<img src="${decideProfilePic(postData.user.Settings.ProfilePic)}" class="enlargedPostProfileImage" type="user" tabindex="0">
						<div class="enlargedPostInfo">
							<div class="enlargedPostUsername" type="user">${postData.user.User}</div>
							<div class="enlargedPostTimestamp" title="${timeSince(postData.Timestamp, true)}">${formatFullDate(postData.Timestamp)}</div>
						</div>
					</div>
					<div class="enlargedPostContent">
						<div class="enlargedPostText">${formatText(postData.Text)}</div>
						${postData.images.length > 0?
							`
								<div class="enlargedPostImages">
									${postData.images.map(imageSrc => `<img src="${imageSrc}" class="enlargedPostImage" tabindex="0" type="imageenlarge">`).join("")}
								</div>
							`:""}
					</div>
          <div class="postButtons">
            <div class="postStat">
              <button class="postButton" type="like">
                <svg viewBox="0 0 900 900" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M62.9086 366.407L66.4441 369.942L370.5 673.998L674.556 369.942L678.091 366.407C760.883 283.615 760.883 149.385 678.091 66.5934L673.849 62.3507C591.058 -20.4404 456.827 -20.4404 374.036 62.3507L370.5 65.8862L366.965 62.3507C284.173 -20.4404 149.942 -20.4404 67.1513 62.3507L62.9086 66.5934C-19.8826 149.385 -19.8826 283.615 62.9086 366.407Z" stroke="#999" stroke-width="60" transform="translate(79.5, 113)"></path> </svg>
              </button>
              <span class="postStatTicker"><span class="postStatNumber" realnum="0" title="0" id="likes655147365211995d2f173d4d">0</span></span>
            </div>
            <div class="postStat">
              <button class="postButton" type="quote">
                <svg viewBox="0 0 839 595" fill="none" xmlns="http://www.w3.org/2000/svg"> <circle cx="196" cy="398.007" r="168.5" stroke="#999999" stroke-width="55"></circle> <circle cx="643" cy="398.007" r="168.5" stroke="#999999" stroke-width="55"></circle> <path d="M28.5986 386V261C28.5986 132.318 132.916 28 261.599 28V28" stroke="#999999" stroke-width="55"></path> <path d="M475.599 386V261C475.599 132.318 579.916 28 708.599 28V28" stroke="#999999" stroke-width="55"></path> </svg>
              </button>
              0
            </div>
            <div class="postStat" style="color: var(--themeColor)">
              <button class="postButton" type="actionchat">
                <svg viewBox="0 0 798 512" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M96.0002 271.985L121.627 281.962L123.5 277.149V271.985H96.0002ZM30.6666 439.799L5.04025 429.822L5.04025 429.822L30.6666 439.799ZM74.5064 480.174L62.458 455.453L62.458 455.453L74.5064 480.174ZM208.225 415V387.5H201.88L196.176 390.28L208.225 415ZM123.5 73.0005C123.5 63.3355 131.335 55.5005 141 55.5005V0.500488C100.96 0.500488 68.5002 32.9598 68.5002 73.0005H123.5ZM123.5 271.985V73.0005H68.5002V271.985H123.5ZM56.293 449.776L121.627 281.962L70.3738 262.008L5.04025 429.822L56.293 449.776ZM62.458 455.453C61.1593 456.086 60.3494 456.059 59.8193 455.967C59.1257 455.847 58.2513 455.468 57.438 454.718C56.6246 453.969 56.1749 453.129 55.9982 452.448C55.8632 451.927 55.7689 451.122 56.293 449.776L5.04025 429.822C-14.6037 480.279 37.882 528.616 86.5548 504.894L62.458 455.453ZM196.176 390.28L62.458 455.453L86.5548 504.894L220.273 439.721L196.176 390.28ZM725 387.5H208.225V442.5H725V387.5ZM742.5 370C742.5 379.665 734.665 387.5 725 387.5V442.5C765.041 442.5 797.5 410.041 797.5 370H742.5ZM742.5 73.0005V370H797.5V73.0005H742.5ZM725 55.5005C734.665 55.5005 742.5 63.3355 742.5 73.0005H797.5C797.5 32.9598 765.041 0.500488 725 0.500488V55.5005ZM141 55.5005H725V0.500488H141V55.5005Z" fill="var(--themeColor)"></path> </svg>
              </button>
              <span class="postStatTicker"><span class="postStatNumber postChatCount" id="chats655147365211995d2f173d4d" realnum="0" title="0">0</span></span>
            </div>
            <div class="postStat">
              <button class="postButton" type="extra">
                <svg viewBox="0 0 41.915 41.915"><g fill="#999999"><path style="" id="Svg" d="M11.214,20.956c0,3.091-2.509,5.589-5.607,5.589C2.51,26.544,0,24.046,0,20.956c0-3.082,2.511-5.585,5.607-5.585 C8.705,15.371,11.214,17.874,11.214,20.956z"></path><path style="" id="Svg" d="M26.564,20.956c0,3.091-2.509,5.589-5.606,5.589c-3.097,0-5.607-2.498-5.607-5.589c0-3.082,2.511-5.585,5.607-5.585 C24.056,15.371,26.564,17.874,26.564,20.956z"></path><path style="" id="Svg" d="M41.915,20.956c0,3.091-2.509,5.589-5.607,5.589c-3.097,0-5.606-2.498-5.606-5.589c0-3.082,2.511-5.585,5.606-5.585 C39.406,15.371,41.915,17.874,41.915,20.956z"></path></g></svg>
              </button>
            </div>
          </div>
				`;

				let chatEnlarged = createElement("enlargedChat", "div", backBlur);
				chatEnlarged.innerHTML = `
        <div class="postChatInfo" enlarged>
          <div class="postChatLiveCircle"></div>
          <span class="postChatLive">Live</span>
          <span class="postChatChatting"><div><span realnum="${postData.Chatting || 0}" title="${postData.Chatting || 0}">${postData.Chatting || 0}</span></div> Chatting</span>
        </div>
        <div class="postChatHolder">
          <div class="loadingChatsInfo">
            <svg width="80px" viewBox="0 0 1415 933" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M77.759 752.42L101.535 766.239L105.259 759.831V752.42H77.759ZM75.9729 755.973L50.7091 745.111L50.7091 745.111L75.9729 755.973ZM31.1522 860.218L5.88837 849.356L5.88837 849.356L31.1522 860.218ZM73.4703 902.134L62.367 876.975L62.367 876.975L73.4703 902.134ZM172.619 858.377L161.516 833.218L161.516 833.218L172.619 858.377ZM180.394 853.537V826.037H170.346L162.665 832.515L180.394 853.537ZM105.259 588C105.259 578.335 113.094 570.5 122.759 570.5V515.5C82.7183 515.5 50.259 547.959 50.259 588H105.259ZM105.259 752.42V588H50.259V752.42H105.259ZM101.237 766.835C101.336 766.606 101.437 766.408 101.535 766.239L53.9828 738.602C52.7709 740.687 51.6772 742.859 50.7091 745.111L101.237 766.835ZM56.416 871.081L101.237 766.835L50.7091 745.111L5.88837 849.356L56.416 871.081ZM62.367 876.975C61.0494 877.557 60.2415 877.499 59.7141 877.388C59.0254 877.242 58.167 876.832 57.3834 876.055C56.5997 875.279 56.1809 874.425 56.0286 873.737C55.912 873.211 55.8471 872.404 56.416 871.081L5.88837 849.356C-15.4634 899.017 35.1197 949.118 84.5737 927.293L62.367 876.975ZM161.516 833.218L62.367 876.975L84.5737 927.293L183.723 883.535L161.516 833.218ZM162.665 832.515C162.384 832.752 162.016 832.997 161.516 833.218L183.722 883.535C189.03 881.193 193.857 878.157 198.123 874.559L162.665 832.515ZM1047.93 826.037H180.394V881.037H1047.93V826.037ZM1065.43 808.537C1065.43 818.202 1057.59 826.037 1047.93 826.037V881.037C1087.97 881.037 1120.43 848.578 1120.43 808.537H1065.43ZM1065.43 588V808.537H1120.43V588H1065.43ZM1047.93 570.5C1057.59 570.5 1065.43 578.335 1065.43 588H1120.43C1120.43 547.959 1087.97 515.5 1047.93 515.5V570.5ZM122.759 570.5H1047.93V515.5H122.759V570.5Z" fill="#C8C8C8"/> <path d="M1337.17 237.42L1313.39 251.239L1309.67 244.831V237.42H1337.17ZM1338.96 240.973L1364.22 230.111L1364.22 230.111L1338.96 240.973ZM1383.78 345.218L1409.04 334.356L1409.04 334.356L1383.78 345.218ZM1341.46 387.134L1352.56 361.975L1352.56 361.975L1341.46 387.134ZM1242.31 343.377L1253.41 318.218L1253.41 318.218L1242.31 343.377ZM1234.54 338.537V311.037H1244.58L1252.26 317.515L1234.54 338.537ZM1309.67 73C1309.67 63.335 1301.84 55.5 1292.17 55.5V0.5C1332.21 0.5 1364.67 32.9594 1364.67 73H1309.67ZM1309.67 237.42V73H1364.67V237.42H1309.67ZM1313.69 251.835C1313.59 251.606 1313.49 251.408 1313.39 251.239L1360.95 223.602C1362.16 225.687 1363.25 227.859 1364.22 230.111L1313.69 251.835ZM1358.51 356.081L1313.69 251.835L1364.22 230.111L1409.04 334.356L1358.51 356.081ZM1352.56 361.975C1353.88 362.557 1354.69 362.499 1355.22 362.388C1355.9 362.242 1356.76 361.832 1357.55 361.055C1358.33 360.279 1358.75 359.425 1358.9 358.737C1359.02 358.211 1359.08 357.404 1358.51 356.081L1409.04 334.356C1430.39 384.017 1379.81 434.118 1330.36 412.293L1352.56 361.975ZM1253.41 318.218L1352.56 361.975L1330.36 412.293L1231.21 368.535L1253.41 318.218ZM1252.26 317.515C1252.55 317.752 1252.91 317.997 1253.41 318.218L1231.21 368.535C1225.9 366.193 1221.07 363.157 1216.81 359.559L1252.26 317.515ZM367 311.037H1234.54V366.037H367V311.037ZM349.5 293.537C349.5 303.202 357.335 311.037 367 311.037V366.037C326.96 366.037 294.5 333.578 294.5 293.537H349.5ZM349.5 73V293.537H294.5V73H349.5ZM367 55.5C357.335 55.5 349.5 63.335 349.5 73H294.5C294.5 32.9593 326.96 0.5 367 0.5V55.5ZM1292.17 55.5H367V0.5H1292.17V55.5Z" fill="#C8C8C8"/> </svg>
            <div class="loadingChatMsg">Loading Chats...</div>
          </div>
        </div>
        <div class="postChatNew">
          <div class="postChatInput" contenteditable="true" placeholder="Time To Chat" onpaste="clipBoardRead(event)"></div>
          <button class="postChatButton" type="sendchat">
            <svg viewBox="0 0 599 602" fill="none" xmlns="http://www.w3.org/2000/svg"> <mask id="mask0_931_12${postData._id}" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="599" height="602"> <rect width="599" height="602" fill="#D9D9D9"/> </mask> <g mask="url(#mask0_931_12${postData._id})"> <path fill-rule="evenodd" clip-rule="evenodd" d="M590.724 93.2879C610.606 40.8893 559.292 -10.4246 506.893 9.45683L44.9078 184.746C-5.64812 203.928 -12.0431 272.856 34.121 301.012L149.73 371.522L372.965 195.301C393.438 179.14 420.026 205.728 403.864 226.201L227.667 449.406L299.141 566.299C327.33 612.403 396.198 605.974 415.368 555.45L590.724 93.2879Z" fill="white"/> </g> </svg>
          </button>
        </div>
				`;

				setTimeout(function() {
					backBlur.style.opacity = 1;
					postEnlarged.style.opacity = 1;
					postEnlarged.style.scale = 1;

					chatEnlarged.style.transform = "translateX(320px)";
				}, 10);
			},
      like: async function(button, post) {
        if (userID == null) {
          promptLogin('Join the hangout today! You must <b>login</b> before being able to <b style="color: #FF5786">Like</b> a post!')
          return;
        }
        function updateLike(type) {
          let likeAmount = findI("likes" + post.getAttribute("postid"));
          let icon = button.querySelector("svg").querySelector("path");
          let svg = button.querySelector("svg");
          if (type == "like") {
            button.setAttribute("isLiked", "");
            button.parentElement.style.color = "#FF5786";
            icon.setAttribute("fill", "#FF5786");
            icon.setAttribute("stroke", "#FF5786");
            changeCounter(likeAmount, parseInt(likeAmount.getAttribute("realnum"),10)+1);
            svg.style.animation = "like 0.8s";
            setTimeout(function() {
              svg.style.animation = null;
            }, 800);

						//let cached = getObject(cache.posts, "_id");
						//let post = cached[post.getAttribute("postid")];
						post.props.isLiked = true;
          } else {
            button.removeAttribute("isLiked");
            button.parentElement.style.removeProperty("color");
            icon.removeAttribute("fill");
            icon.setAttribute("stroke", "#999");
            changeCounter(likeAmount, parseInt(likeAmount.getAttribute("realnum"),10)-1);

						//let cached = getObject(cache.posts, "_id");
						//let post = cached[post.getAttribute("postid")];
						post.props.isLiked = false;
          }
        }
        if (button.hasAttribute("isLiked") == false) {
          updateLike("like");
          let [code] = await sendRequest("PUT", "posts/like?postid=" + post.getAttribute("postid"));
          if (code != 200) {
            updateLike("unlike");
          }
        } else {
          updateLike("unlike");
          let [code] = await sendRequest("DELETE", "posts/unlike?postid=" + post.getAttribute("postid"));
          if (code != 200) {
            updateLike("like");
          }
        }
      },
      quote: async function(button, post) {
        if (userID == null) {
          promptLogin('Join the hangout today! You must <b>login</b> before being able to <b style="color: #C95EFF">Quote</b> a post!')
          return;
        }
        let postTextArea = findI("newPostArea");
        if (postTextArea == null) {
          await setPage("home");
        }
        postTextArea = findI("newPostArea");
        postTextArea.innerHTML += "/Post_" + post.getAttribute("postid") + "&nbsp;";
        setCurrentCursorPosition(postTextArea, postTextArea.textContent.length);
      },
      actionchat: async function(button, post) {
        if (isMobile != true) {
          if (userID == null) {
            promptLogin('Join the hangout today! You must <b>login</b> before being able to <b style="color: var(--themeColor)">Chat</b> on a post!')
            return;
          }
          post.querySelector(".postChatInput").focus();
        } else {
          openMobilePostView(post);
        }
      },
      extra: async function(button, post) {
        let dropdownButtons = [
          ["Copy Text", "var(--themeColor)", function() {
            copyClipboardText(post.getAttribute("text"));
          }],
          ["Copy ID", "var(--themeColor)", function() {
            copyClipboardText("/Post_" + post.getAttribute("postid"));
          }]
        ];
        if (button.hasAttribute("jump")) {
          dropdownButtons.unshift(["Jump to Post", "var(--themeColor)", function() {
            modifyParams("post", post.getAttribute("postid"));
            setPage("viewpost");
          }]);
        }
        function editPost() {
					let postText = post.getAttribute("text").replace(/@([A-Za-z0-9]+)"([^"]+)"/g, "@$2")
          let postUI = `<div style="display:flex;flex-direction:column;"><div contenteditable="true" id="editPost" onpaste="clipBoardRead(event)">${postText.replaceAll("\n", "<br>")}</div><span id="editPostCharCount">${postText.replaceAll("\n", "").length}/800</span></div>`
          showPopUp("Edit Post", postUI, [["Save", "var(--premiumColor)", async function() {
            post.style.opacity = "0.5";
            let sendFormData = new FormData();
	          sendFormData.append("data", JSON.stringify({ text: findI("editPost").innerText.replace(/@([\w-]+)/g, "@$1 ") }));
            let [code, response] = await sendRequest("POST", `posts/edit?postid=${post.getAttribute("postid")} `, sendFormData, true);
           
            if (code != 200) {
              showPopUp("An Error Occured", response, [["OK", "var(--grayColor)"]]);
							post.style.opacity = "1";
            }
          }], ["Cancel", "var(--grayColor)"]]);
          const editPostCharCount = findI('editPostCharCount');
          const editPost = findI('editPost');
					editPost.focus();
          editPost.addEventListener('input', function(){
            editPostCharCount.innerText = `${editPost.textContent.length}/800`;
          });
        }
        function deletePost() {
          showPopUp("Delete Post?", "Are you sure you want to <b>permanently</b> delete this post?", [["Delete", "#FF5C5C", async function() {
            post.style.opacity = "0.5";
            let [code, response] = await sendRequest("DELETE", "posts/edit/delete?postid=" + post.getAttribute("postid"));
            if (code != 200) {
              post.style.opacity = "1";
              showPopUp("Error Deleting", response, [["Okay", "var(--grayColor)"]]);
            }
          }], ["Wait, no", "var(--grayColor)"]]);
        }
        let viewGroupID = getParam("group");
        let postedGroup = groups[viewGroupID || ""];
        if (post.getAttribute("userid") == userID) {
          if (viewGroupID == null) {
            if (account.ProfileData != null && account.ProfileData.PinnedPost == post.getAttribute("postid")) {
              dropdownButtons.unshift(["Unpin Post", "#C95EFF", function() {
                showPopUp("Unpin this Post?", "Unpinning this post will remove it from the top of your profile. It won't delete the post.", [["Unpin", "#C95EFF", async function() {
                  await sendRequest("DELETE", "posts/edit/unpin");
                  account.ProfileData = account.ProfileData || {};
                  delete account.ProfileData.PinnedPost;
                  refreshPage();
                }], ["Wait, no", "var(--grayColor)"]]);
              }]);
            } else {
              dropdownButtons.unshift(["Pin Post", "#C95EFF", function() {
                showPopUp("Pin this Post?", "Pinning this post will keep it at the top of your profile. If another post is already pinned, it will be replaced by this post.", [["Pin", "#C95EFF", async function() {
                  await sendRequest("PUT", "posts/edit/pin?postid=" + post.getAttribute("postid"));
                  account.ProfileData = account.ProfileData || {};
                  account.ProfileData.PinnedPost = post.getAttribute("postid");
                  refreshPage();
                }], ["Wait, no", "var(--grayColor)"]]);
              }]);
            }
          }
          if (hasPremium()) {
            dropdownButtons.unshift(["Edit Post", "var(--premiumColor)", editPost]);
          }
					if(!getParam("group")) {
						dropdownButtons.unshift(["Delete", "#FF5C5C", deletePost]);
					}
        } else {
          if (userID != null) {
            dropdownButtons.unshift(["Block User", "#FF8652", function() {
              blockUser(post.getAttribute("userid"), post.getAttribute("name"));
            }]);
            dropdownButtons.unshift(["Report", "#FFCB70", function() {
              reportContent(post.getAttribute("postid"), post.getAttribute("name"), post.getAttribute("userid"), "post");
            }]);
            if (checkPermision(account.Role, "CanBanUsers")) {
              dropdownButtons.unshift(["Ban User", "#FF5C5C", async function() {
                (await getModule("ban"))(post.getAttribute("userid"), post.getAttribute("name"))
              }]);
            }
            if (checkPermision(account.Role, "CanDeletePosts") == true) {
              dropdownButtons.unshift(["Delete", "#FF5C5C", deletePost]);
            }
          }
        }
				
				let groupID = getParam("group");
				if (currentPage == "group" && groups[groupID] != null && (groups[groupID].Owner == userID || groups[groupID].Moderators.includes(userID) || userID == post.getAttribute("userid"))) {
					if (groups[groupID].Owner == userID) {
						if(postedGroup != null && postedGroup.Owner == userID) {
							if(post.getAttribute("grouppin") != null) {
								dropdownButtons.unshift(["Unpin Post", "#C95EFF", function() {
									showPopUp("Unpin this Post?", "Unpinning this post will remove it from the Group Pins page. It won't delete the post.", [["Unpin", "#C95EFF", async function() {
										let [code, response] = await sendRequest("DELETE", "posts/edit/unpin?postid=" + post.getAttribute("postid") + "&groupid=" + post.getAttribute("groupid"));

										if (code == 200) {
											post.removeAttribute("grouppin");
											post.querySelector(".postTimestamp").innerText = post.querySelector(".postTimestamp").innerText.replace(" (pinned)", "")
										} else {
											showPopUp("Error Unpinning Post", response, [["Close", "grey", null]])
										}
									}], ["Wait, no", "var(--grayColor)"]]);
								}]);
							} else {
								dropdownButtons.unshift(["Pin Post", "#C95EFF", function() {
									showPopUp("Pin this Post?", "Pinning this post add it to the Group Pins page. If there are already 25 posts pinned, the oldest will be unpinned.", [["Pin", "#C95EFF", async function() {
										let [code, response] = await sendRequest("PUT", "posts/edit/pin?postid=" + post.getAttribute("postid"));

										if (code == 200)  {
											post.setAttribute("grouppin", "");
											post.querySelector(".postTimestamp").innerText += " (pinned)";
										} else {
											showPopUp("Error Pinning Post", response, [["Close", "grey", null]])
										}
									}], ["Wait, no", "var(--grayColor)"]]);
								}]);
							}
						}
					}
					dropdownButtons.unshift(["Delete", "#FF5C5C", deletePost]);
				}
        showDropdown(button, "right", dropdownButtons);
      },
      sendchat: async function(button, post) {
        let premium = hasPremium();
        let limit = premium ? 400 : 200;
        if (userID == null) {
          promptLogin('Join the hangout today! You must <b>login</b> before being able to <b style="color: var(--themeColor)">Chat</b> on a post!')
          return;
        }
        let renderChat = await getModule("chat");

        let text = post.querySelector(".postChatInput").textContent;
        post.querySelector(".postChatInput").textContent = "";
        if (text.length < 1) {
          showPopUp("Write a Chat", "You have to write... something.", [["Okay", "var(--grayColor)"]]);
          return;
        }
        if (text.length > limit) {
          if (limit == 200) {
            showPopUp("That's Too Long", `Please keep your chats to under ${limit} characters.${premiumPerk("Text limits are doubled! Use up to 400 characters in your chats.")}`, [["Okay", "var(--grayColor)"]]);
          } else {
            showPopUp("That's Too Long", `Please keep your chats to under ${limit} characters.`, [["Okay", "var(--grayColor)"]]);
          }
          return;
        }
        let sendData = { text: text };
        let replyAdd = post.querySelector(".postChatReply");
        let previewData = { UserID: userID, PostID: post.getAttribute("postid"), Text: text, Timestamp: Date.now() };
        let replyData = null;
        if (replyAdd != null) {
          sendData.replyID = replyAdd.getAttribute("chatid");
          previewData.ReplyID = sendData.replyID;
          let repliedChat = findI(sendData.replyID);
          if (repliedChat != null) {
            replyData = { _id: repliedChat.id, user: { User: repliedChat.getAttribute("user") }, Text: repliedChat.getAttribute("text") };
            repliedChat.style.backgroundColor = "";
          } else {
            return;
          }
          replyAdd.remove();
        }
        post.querySelector(".loadingChatsInfo").style.display = "none";
        renderChat(post.querySelector(".chatHolder"), previewData, account, replyData, true);
        post.querySelector(".postChatHolder").scrollTo({
          top: post.querySelector(".postChatHolder").scrollHeight,
          behavior: "smooth"
        });
        let [code, response] = await sendRequest("POST", "chats/new?postid=" + post.getAttribute("postid"), sendData);
        if (code != 200) {
          let sendingChats = post.querySelectorAll("[sending='']");
          for (let i = 0; i < sendingChats.length; i++) {
            sendingChats[i].remove();
          }
          showPopUp("An Error Occured", response, [["Okay", "var(--grayColor)"]]);
        }
      },
      postlink: async function(elem) {
        showPost(elem.getAttribute("postid"));
      },
      imageenlarge: async function(elem) {
        let zoomedImageBlur = createElement("backBlur", "div", document.body);
        let zoomedImageHolder = createElement("zoomedImageHolder", "div", zoomedImageBlur);
        createElement("zoomedImage", "img", zoomedImageHolder).src = elem.src;
        createElement("zoomedImageClose", "div", zoomedImageHolder).innerHTML = "&times;";
        zoomedImageBlur.style.animation = "imageBlurIn 0.2s";
        zoomedImageBlur.style.opacity = 1;
        zoomedImageHolder.style.transform = "scale(1)";
        tempListen(zoomedImageBlur, "click", function(event) {
          zoomedImageBlur.style.opacity = 0;
          zoomedImageHolder.style.transform = "scale(0.9)";
          setTimeout(function() {
            event.target.closest(".backBlur").remove();
          }, 200);
        });
      },

      // Chat Actions:
      chat: async function(chat, post) {
        if(chat.getAttribute('editing') == "true")return;
        let dropdownButtons = [
          ["Copy Text", "var(--themeColor)", function() {
            copyClipboardText(chat.getAttribute("text"));
          }],
          ["Copy ID", "var(--themeColor)", function() {
            copyClipboardText("/Chat_" + chat.id);
          }]
        ];
        let mainElement;
        function editChat() {
          let currentEditing = document.querySelector(".chatText[contenteditable='true'], .chatMinfiyText[contenteditable='true']");
          if (currentEditing) {
            currentEditing.setAttribute("contenteditable", "false");
            currentEditing.innerHTML = formatText(currentEditing.getAttribute('originalText'));
            if(currentEditing.className == 'chatText'){
              currentEditing.parentElement.parentElement.setAttribute('editing', "false");
            }else{
              currentEditing.parentElement.setAttribute('editing', "false");
            }
            
            currentEditing.parentElement.querySelector('.editChatButtons').remove();
          }
          chat.setAttribute('editing', "true");
          mainElement = chat.querySelector(".chatText, .chatMinfiyText");
          mainElement.setAttribute("contenteditable", "true");
					mainElement.setAttribute("onpaste", "clipBoardRead(event)")
          mainElement.focus();
          const oldText = chat.getAttribute('text');
					const oldHTML = mainElement.innerHTML;
					mainElement.innerHTML = chat.getAttribute('text').replace(/@([^"]+)"([^"]+)"/g, "@$2");
          mainElement.setAttribute('originalText', oldText);

          const editButtonsContainer = createElement("editChatButtons", 'div', mainElement.parentElement);
          editButtonsContainer.innerHTML = `<button class="editChatButton saveEditButton" ${chat.className == "minifyChat"? "minified=\"defined\"":""}>Save</button><button class="editChatButton cancelEditButton" ${chat.className == "minifyChat"? "minified=\"defined\"":""}>Cancel</button>`;
          const editButtons = editButtonsContainer.querySelectorAll('.editChatButton');
          tempListen(editButtons[0], 'click', saveChat);
          tempListen(editButtons[1], 'click', () => {
            editButtonsContainer.remove();
            mainElement.setAttribute("contenteditable", "false");
            chat.setAttribute('editing', "false");
            chat.removeAttribute('originalText');
            mainElement.innerHTML = oldHTML;
          });

          tempListen(mainElement, 'keypress', enterChat);

          function enterChat(event){
            if (event.key == "Enter") {
              event.preventDefault();
              saveChat();
            }
          }
    
          async function saveChat(){
              mainElement.removeEventListener('keypress', enterChat);
              mainElement.style = 'color: #bbb';
              mainElement.setAttribute("contenteditable", "false");
              editButtonsContainer.remove();
              chat.setAttribute("type", "chat");
              chat.setAttribute("editing", "false");
              let [code, response] = await sendRequest("POST", `chats/edit?chatid=${chat.id} `, { text: mainElement.textContent });
              if (code != 200) {
                showPopUp("Error Editing Chat", response, [["Okay", "var(--themeColor)"]]);
                mainElement.textContent = oldText;
                editChat(chat, post);
              }
              mainElement.style = 'color: inherit;';
              chat.removeAttribute('originalText');
          }
        }

        function deleteChat() {
          showPopUp("Delete Chat?", "Are you sure you want to <b>permanently</b> delete this chat?", [["Delete", "#FF5C5C", async function() {
            chat.style.opacity = "0.5";
            let [code, response] = await sendRequest("DELETE", "chats/delete?chatid=" + chat.id);
            if (code != 200) {
              chat.style.opacity = "1";
              showPopUp("Error Deleting", response, [["Okay", "var(--grayColor)"]]);
            }
          }], ["Wait, no", "var(--grayColor)"]]);
        }
        if (chat.getAttribute("userid") == userID) {
          dropdownButtons.unshift(["Delete", "#FF5C5C", deleteChat]);
          if (hasPremium()) {
            dropdownButtons.unshift(["Edit Text", "var(--premiumColor)", editChat]);
          }
        } else {
          if (userID != null) {
            dropdownButtons.unshift(["Block User", "#FF8652", function() {
              blockUser(chat.getAttribute("userid"), chat.getAttribute("user"));
            }]);
            dropdownButtons.unshift(["Report", "#FFCB70", function() {
              reportContent(chat.getAttribute("id"), chat.getAttribute("user"), chat.getAttribute("userid"), "chat");
            }]);
            if (checkPermision(account.Role, "CanBanUsers")) {
               dropdownButtons.unshift(["Ban User", "#FF5C5C", async function() {
                (await getModule("ban"))(chat.getAttribute("userid"), chat.getAttribute("user"));
              }]);
            }
            if (checkPermision(account.Role, "CanDeleteChats") == true) {
              dropdownButtons.unshift(["Delete", "#FF5C5C", deleteChat]);
            } else {
              let groupID = getParam("group");
              if (currentPage == "group" && groups[groupID] != null && groups[groupID].Owner == userID) {
                dropdownButtons.unshift(["Delete", "#FF5C5C", deleteChat]);
              }
            }
          }
        }
        dropdownButtons.unshift(["Reply", "#2AF5B5", function() {
          let newChatHolder = post.querySelector(".postChatNew");
          let prevReply = findC("postChatReply");
          if (prevReply != null) {
            let prevChat = findI(prevReply.getAttribute("chatid"));
            if (prevChat != null) {
              prevChat.style.backgroundColor = "";
            }
            prevReply.remove();
          }
          chat.style.backgroundColor = "#2AF5B5";
          let replyHolder = createElement("postChatReply", "div", newChatHolder);
          newChatHolder.insertBefore(replyHolder, newChatHolder.firstChild);
          replyHolder.setAttribute("chatid", chat.id);
          replyHolder.innerHTML = `<div class="postChatReplyLine"></div><div class="postChatReplyText">Replying to <b style="color: #FE5D6A">${chat.getAttribute("user")}</b></div><div class="postChatReplyClose" tabindex="0">&times;</div>`;
          replyHolder.querySelector(".postChatReplyClose").addEventListener("click", function() {
            chat.style.backgroundColor = "";
            replyHolder.remove();
          });
        }]);
        showDropdown(button, "left", dropdownButtons);
      },
      reply: async function(reply, post) {
        showChat(post.getAttribute("postid"), reply.getAttribute("replyid"));
      },
      chatlink: async function(elem) {
        showChat(null, elem.getAttribute("chatid"));
      },

      // Users:
      user: async function(clickElem) {
        showPreview(clickElem, clickElem.closest("[userid]").getAttribute("userid"));
      },
      follow: async function(followButton) {
        function updateFollow(type) {
          if (type == "follow") {
            followButton.textContent = "Unfollow";
            followButton.style.background = "#FF5C5C";
          } else {
            followButton.textContent = "Follow";
            followButton.style.background = "var(--themeColor)";
          }
        }
        if (followButton.textContent == "Follow") {
          updateFollow("follow");
          let [code] = await sendRequest("PUT", "user/follow?userid=" + followButton.getAttribute("userid"));
          if (code != 200) {
            updateFollow("unfollow");
          } else {
            updateFollow("follow");
          }
        } else {
          updateFollow("unfollow");
          let [code] = await sendRequest("DELETE", "user/unfollow?userid=" + followButton.getAttribute("userid"));
          if (code != 200) {
            updateFollow("follow");
          } else {
            updateFollow("unfollow");
          }
        }
      },

      // Groups:
      viewgroup: function(clickElem) {
        modifyParams("group", clickElem.closest("[id]").getAttribute("id"));
        setPage("group");
      },
      declineinvite: async function(clickElem) {
        let inviteTile = clickElem.closest("[id]");
        inviteTile.style.opacity = 0.5;
        let [code] = await sendRequest("DELETE", "groups/revoke?inviteid=" + inviteTile.getAttribute("id") + userID);
        if (code == 200) {
          inviteTile.remove();
        } else {
          inviteTile.style.opacity = 1;
        }
      },

      //Premium:
      giftlink: async function(elem) {
        (await getModule("gift"))(elem.getAttribute('giftid'));
      },
      claimgift: async function(elem){
        (await getModule("gift"))(elem.getAttribute("giftid"));
      },

			// Message Actions:
			message: async function(message) {
				if(message.getAttribute('editing') == "true")return;
        let dropdownButtons = [
          ["Copy Text", "var(--themeColor)", function() {
            copyClipboardText(message.getAttribute("text"));
          }],
          ["Copy ID", "var(--themeColor)", function() {
            copyClipboardText("/Message_" + message.id);
          }]
        ];

				let mainElement;
        function editMessage() {
					//FIX editing minified buttons broken
          let currentEditing = document.querySelector(".dmText[contenteditable='true']");
          if (currentEditing) {
            currentEditing.setAttribute("contenteditable", "false");
            currentEditing.innerHTML = formatText(currentEditing.getAttribute('originalText'));
            if(currentEditing.getAttribute('minified') = null){
              currentEditing.parentElement.parentElement.setAttribute('editing', "false");
            }else{
              currentEditing.parentElement.setAttribute('editing', "false");
            }
            
            currentEditing.parentElement.querySelector('.editChatButtons').remove();
          }
          message.setAttribute('editing', "true");
          mainElement = message.querySelector(".dmText");
          mainElement.setAttribute("contenteditable", "true");
					mainElement.setAttribute("onpaste", "clipBoardRead(event)")
          mainElement.focus();
          const oldText = message.getAttribute('text');
					const oldHTML = mainElement.innerHTML;
					mainElement.innerHTML = message.getAttribute('text').replace(/@([^"]+)"([^"]+)"/g, "@$2");
          mainElement.setAttribute('originalText', oldText);

          const editButtonsContainer = createElement("editChatButtons", 'div', mainElement.parentElement);
					//${chat.className == "minifyChat"? "minified=\"defined\"":""}
          editButtonsContainer.innerHTML = `<button class="editChatButton saveEditButton">Save</button><button class="editChatButton cancelEditButton">Cancel</button>`;
          const editButtons = editButtonsContainer.querySelectorAll('.editChatButton');
          tempListen(editButtons[0], 'click', saveMessage);
          tempListen(editButtons[1], 'click', () => {
            editButtonsContainer.remove();
            mainElement.setAttribute("contenteditable", "false");
            message.setAttribute('editing', "false");
            message.removeAttribute('originalText');
            mainElement.innerHTML = oldHTML;
          });

          tempListen(mainElement, 'keypress', enterChat);

          function enterChat(event){
            if (event.key == "Enter") {
              event.preventDefault();
              saveMessage();
            }
          }
    
          async function saveMessage(){
              mainElement.removeEventListener('keypress', enterChat);
              mainElement.style = 'color: #bbb';
              mainElement.setAttribute("contenteditable", "false");
              editButtonsContainer.remove();
              message.setAttribute("type", "message");
              message.setAttribute("editing", "false");
              let [code, response] = await sendRequest("POST", `conversations/messages/edit?messid=${message.id}&convid=${message.getAttribute('convid')}`, { text: mainElement.textContent });
              if (code != 200) {
                showPopUp("Error Editing Message", response, [["Okay", "var(--themeColor)"]]);
                mainElement.textContent = oldText;
                editMessage(message);
              }
              mainElement.style = 'color: inherit;';
              message.removeAttribute('originalText');
          }
        }
				
				function deleteMessage() {
					showPopUp("Delete Message?", "Are you sure you want to <b>permanently</b> delete this message?", [["Delete", "#FF5C5C", async function() {
            message.style.opacity = "0.5";
            let [code, response] = await sendRequest("DELETE", "conversations/messages/delete?messid=" + message.id + "&convid=" + message.getAttribute("convid"));
            if (code != 200) {
              message.style.opacity = "1";
              showPopUp("Error Deleting", response, [["Okay", "var(--grayColor)"]]);
            }
          }], ["Wait, no", "var(--grayColor)"]]);
				}

				if (message.getAttribute("userid") == userID) {
          dropdownButtons.unshift(["Delete", "#FF5C5C", deleteMessage]);
          if (hasPremium()) {
            dropdownButtons.unshift(["Edit Text", "var(--premiumColor)", editMessage]);
          }
        } else {
          if (userID != null) {
            dropdownButtons.unshift(["Block User", "#FF8652", function() {
              blockUser(message.getAttribute("userid"), message.getAttribute("user"));
            }]);
            dropdownButtons.unshift(["Report", "#FFCB70", function() {
              reportContent(message.getAttribute("id"), message.getAttribute("user"), message.getAttribute("userid"), "message");
            }]);
            if (checkPermision(account.Role, "CanBanUsers")) {
              dropdownButtons.unshift(["Ban User", "#FF5C5C", async function() {
                (await getModule("ban"))(message.getAttribute("userid"), message.getAttribute("user"));
              }]);
            }
            if (checkPermision(account.Role, "CanDeleteChats") == true) {
              dropdownButtons.unshift(["Delete", "#FF5C5C", deleteMessage]);
            }
          }
        }

				dropdownButtons.unshift(["Reply", "#2AF5B5", function() {
          let newMessageHolder = document.querySelector("#dmContent");
          let prevReply = findC("messageReplyHolder");
          if (prevReply != null) {
            let prevMessage = findI(prevReply.getAttribute("replyid"));
            if (prevMessage != null) {
              prevMessage.style.backgroundColor = "";
            }
            prevReply.remove();
          }
          message.style.backgroundColor = "#2AF5B5";
          let replyHolder = createElement("messageReplyHolder", "div", newMessageHolder);
          newMessageHolder.insertBefore(replyHolder, document.querySelector(".sendDMInput"));
          replyHolder.setAttribute("replyid", message.id);
					replyHolder.style = 'height:unset;cursor:default;';
          replyHolder.innerHTML = `<div class="postChatReplyLine"></div><div class="postChatReplyText">Replying to <b style="color: #FE5D6A">${message.getAttribute("user")}</b></div><div class="postChatReplyClose" tabindex="0">&times;</div>`;
          replyHolder.querySelector(".postChatReplyClose").addEventListener("click", function() {
            message.style.backgroundColor = "";
            replyHolder.remove();
          });
        }]);

				showDropdown(button, (message.getAttribute("self") == null?"left":"right"), dropdownButtons);
			},

			// Polls
			vote: async function(option) {
				let voteNumber = parseInt(option.getAttribute("vote"));
				let post = option.closest(".post");

        option.style.opacity = .4;

				let [code, response] = await sendRequest("POST", `posts/vote?postid=${post.getAttribute("postid")}`, {
					Vote: voteNumber
				});
        option.style.opacity = 1;
				if(code != 200) {
					showPopUp("Oops..", response, [["Close", "grey", null]]);
				}
			}
    };
    if (actions[type] != null) {
      actions[type](button, button.closest(".post"));
    } else if (path[0].closest(".postPost") != null) { // comment this else statement for enlarged posts
      if (isMobile == false) {
        let postContent = path[0].closest(".postPost").querySelector(".postContent");
        if (postContent.hasAttribute("enlarged") == false) {
          modifyParams("post", postContent.closest(".post").getAttribute("postid"));
          let otherEnlargedPost = pageHolder.querySelector(".postContent[enlarged='']");
          if (otherEnlargedPost != null) {
            otherEnlargedPost.style.removeProperty("height");
            otherEnlargedPost.removeAttribute("enlarged");
            let postChatHolder = otherEnlargedPost.closest(".post").querySelector(".postChatHolder");
            postChatHolder.scrollTo({
              top: postChatHolder.scrollHeight
            });
          }
          postContent.style.height = "300px";
          postContent.setAttribute("enlarged", "");
        } else {
          modifyParams("post");
          postContent.style.removeProperty("height");
          postContent.removeAttribute("enlarged");
          let postChatHolder = path[0].closest(".post").querySelector(".postChatHolder");
          postChatHolder.scrollTo({
            top: postChatHolder.scrollHeight
          });
        }
      } else {
        openMobilePostView(path[0].closest(".post"));
      }
    }
  });
}