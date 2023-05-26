wireframes.messages = `
	<input id="imageInput" type="file" accept="image/*" multiple="true" hidden="true">
  <div style="display:flex;height:100%;">
		<div id="messageHolder">
	 		<button id="startAMessageButton">Start a Message</button>
      <div id="requestMessages">
        <div class="message" id="newMessage">
          <div class="messageImage" style="background:var(--contentColor3);color:var(--themeColor);border-radius:100px;display:flex;justify-content:center;align-items:center;font-size:30px;font-weight:bold;">+</div>
  	 			<div class="messageName" style="color:var(--themeColor);font-family: 'Poppins';">
  		 			New Message
  	 			</div>
        </div>
      </div>
	 		<div id="activeMessages"></div>
	 	</div>
		<div id="mainHolder">
	 		<div class="stickyContainer" id="dmTopBar">
		 		<img class="topbarImage" src="https://photop-content.s3.amazonaws.com/ProfileImages/DefaultProfilePic">
				<div style="display:none;" class="topbarStatus"></div>
				<span class="topbarName"></span>
				<button class="topbarOptions groupToolbarButton" id="messageTopBarButton">
		      <svg viewBox="0 0 41.915 41.915"><g fill="var(--themeColor)"><path style="" id="Svg" d="M11.214,20.956c0,3.091-2.509,5.589-5.607,5.589C2.51,26.544,0,24.046,0,20.956c0-3.082,2.511-5.585,5.607-5.585 C8.705,15.371,11.214,17.874,11.214,20.956z"></path><path d="M26.564,20.956c0,3.091-2.509,5.589-5.606,5.589c-3.097,0-5.607-2.498-5.607-5.589c0-3.082,2.511-5.585,5.607-5.585 C24.056,15.371,26.564,17.874,26.564,20.956z"></path><path d="M41.915,20.956c0,3.091-2.509,5.589-5.607,5.589c-3.097,0-5.606-2.498-5.606-5.589c0-3.082,2.511-5.585,5.606-5.585 C39.406,15.371,41.915,17.874,41.915,20.956z"></path></g></svg>
		    </button>
			</div>

			<div id="dmHolder">
	 			<div id="dms">
		 			<div id="newConvoMessage">
						<img class="newConvoImage" src="https://photop-content.s3.amazonaws.com/ProfileImages/DefaultProfilePic">
						<div class="newConvoName"></div>
						<div class="newConvoText"></div>
	 				</div>
	 			</div>
		 		<div id="dmContent">
		 			<div id="newMessageImages"></div>
		 			<div class="sendDMInput" placeholder="Time to Chat" contenteditable></div>
					<button class="addDMImage">
				  	<svg style="position: relative; height: 100%; width: 100%; cursor: pointer; " id="CreateImageButtonSvg" viewBox="0 0 550.801 550.801"><g style="" id="CreateImageButtonG" fill="var(--themeColor)" stroke="#ffffff" stroke-width="0"><path style="" id="Svg" d="M515.828,61.201H34.972C15.659,61.201,0,76.859,0,96.172v358.458C0,473.942,15.659,489.6,34.972,489.6h480.856 c19.314,0,34.973-15.658,34.973-34.971V96.172C550.801,76.859,535.143,61.201,515.828,61.201z M515.828,96.172V350.51l-68.92-62.66 c-10.359-9.416-26.289-9.04-36.186,0.866l-69.752,69.741L203.438,194.179c-10.396-12.415-29.438-12.537-39.99-0.271L34.972,343.219 V96.172H515.828z M367.201,187.972c0-26.561,21.523-48.086,48.084-48.086c26.562,0,48.086,21.525,48.086,48.086 c0,26.561-21.523,48.085-48.086,48.085C388.725,236.058,367.201,214.533,367.201,187.972z"></path></g></svg>
				  </button>
					<button class="sendDMButton" type="sendmessage">
		        <svg viewBox="0 0 599 602" fill="none" xmlns="http://www.w3.org/2000/svg"> <mask id="mask0_931_12" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="599" height="602"> <rect width="599" height="602" fill="#D9D9D9"></rect> </mask> <g mask="url(#mask0_931_12)"> <path fill-rule="evenodd" clip-rule="evenodd" d="M590.724 93.2879C610.606 40.8893 559.292 -10.4246 506.893 9.45683L44.9078 184.746C-5.64812 203.928 -12.0431 272.856 34.121 301.012L149.73 371.522L372.965 195.301C393.438 179.14 420.026 205.728 403.864 226.201L227.667 449.406L299.141 566.299C327.33 612.403 396.198 605.974 415.368 555.45L590.724 93.2879Z" fill="white"></path> </g> </svg>
		      </button>
	 			</div>
			</div>
	 	</div>
	</div>
`;

pages.messages = async function() {
  app.style.width = "1038px";
	let [status, convos] = await sendRequest("GET", "conversations");
	if (status == 200) {
		convos = JSON.parse(convos);
		let userObject = getObject(convos.users, '_id');
		for(var i=0;i<convos.conversations.length;i++) {
			let div = document.createElement("div");
			let html = "";
			const convo = convos.conversations[i];
			const user = convo.Creator == userID?userObject[convo.Users[0]]:userObject[convo.Creator];
			if(convo.Users.length == 1) {
				html = `
					<img class="messageImage" src="${decideProfilePic(user)}">
					<div style="background: ${statuses[user.Status][1]};" class="messageStatus" title="${statuses[user.Status][0]}"></div>
					<div class="messageName">
						${user.User}
					</div>
				`;

				div.setAttribute("user", user.User);
				div.setAttribute("creator", convo.Creator);
			} else {
				html = `
					<img class="messageImage" src="${assetURL + `ConversationImages/${convo.Image}`}">
					<div class="messageName">
						${convo.Name}
					</div>
				`;

				div.setAttribute("user", convo.Name);
				div.setAttribute("creator", convo.Creator);
			}
			
			div.className = "message";
			div.setAttribute("convid", convo._id);
			div.setAttribute("accepted", "");
			div.innerHTML = html;
			tempListen(div, "click", async function() {
				const usernames = convo.Users.map(a=>`${userObject[a].User}`);
				if(document.querySelector(".message[active]")) {
					document.querySelector(".message[active]").removeAttribute("active");
				}

				document.querySelector(".topbarImage").src = decideProfilePic(user);
				document.querySelector(".newConvoImage").src = decideProfilePic(user);
				document.querySelector("#dmTopBar .topbarStatus").style.background = statuses[user.Status][1];
				document.querySelector("#dmTopBar .topbarStatus").title = statuses[user.Status][0];
				if(convo.Users.length == 1) {
					document.querySelector("#dmTopBar .topbarStatus").style.display = "initial";
					document.querySelector(".topbarName").innerText = user.User;
					document.querySelector(".newConvoName").innerText = user.User;
					document.querySelector(".newConvoText").innerHTML = `Embark on an amazing conversation with <b>${user.User}</b>!`;
				} else {
					document.querySelector("#dmTopBar .topbarStatus").style.display = "none";
					document.querySelector(".topbarName").innerText = usernames.join(", ");
					document.querySelector(".newConvoName").innerText = usernames.join(", ");
					document.querySelector(".newConvoText").innerHTML = `Embark on an amazing conversation with ${usernames.map(a=>{if(usernames.indexOf(a)==usernames.length-1){return `and <b>${a}</b>`}else{return `<b>${a}</b>`}}).join(", ")}!`;
				}
				
				div.setAttribute("active", "");
				let [code, response] = await sendRequest("GET", `conversations/messages?convid=${div.getAttribute("convid")}`);
				if(code == 200) {
					let renderMessage = await getModule("message");
					let dms = document.querySelector("#dms");
					response = JSON.parse(response)
					const dmChildren = Array.from(dms.children);
					dmChildren.forEach(child => {
						if (child.className == "dm" || child.className == "dmMinified") {
							child.remove();
						}
					});
					
					let messages = response.messages.reverse();
					let replies = getObject(response.replies, "_id");
					let users = getObject(response.users, "_id");
					for (let i = 0; i < messages.length; i++) {
						let message = messages[i];
						let reply = replies[message.ReplyID];
						if (reply != null) {
							reply.user = users[message.UserID];
						}
						renderMessage(dms, message, users[message.UserID], reply);
					}
				}
			})
			if(i == 0) {
				const usernames = convo.Users.map(a=>`${userObject[a].User}`);
				document.querySelector(".topbarImage").src = decideProfilePic(user);
				document.querySelector(".newConvoImage").src = decideProfilePic(user);
				document.querySelector("#dmTopBar .topbarStatus").style.background = statuses[user.Status][1];
				document.querySelector("#dmTopBar .topbarStatus").title = statuses[user.Status][0];
				if(convo.Users.length == 1) {
					document.querySelector("#dmTopBar .topbarStatus").style.display = "initial";
					document.querySelector(".topbarName").innerText = user.User;
					document.querySelector(".newConvoName").innerText = user.User;
					document.querySelector(".newConvoText").innerHTML = `Embark on an amazing conversation with <b>${user.User}</b>!`;
				} else {
					document.querySelector("#dmTopBar .topbarStatus").style.display = "none";
					document.querySelector(".topbarName").innerText = usernames.join(", ");
					document.querySelector(".newConvoName").innerText = usernames.join(", ");
					document.querySelector(".newConvoText").innerHTML = `Embark on an amazing conversation with ${usernames.map(a=>{if(usernames.indexOf(a)==usernames.length-1){return `and <b>${a}</b>`}else{return `<b>${a}</b>`}}).join(", ")}!`;
				}
				
				if(document.querySelector(".message[active]")) {
					document.querySelector(".message[active]").removeAttribute("active");
				}
				div.setAttribute("active", "");
				let [code, response] = await sendRequest("GET", `conversations/messages?convid=${div.getAttribute("convid")}`);
				if(code == 200) {
					let renderMessage = await getModule("message");
					let dms = document.querySelector("#dms");
					response = JSON.parse(response)
					const dmChildren = Array.from(dms.children);
					dmChildren.forEach(child => {
						if (child.className == "dm" || child.className == "dmMinified") {
							child.remove();
						}
					});
					//change the top of the message elem
					console.log(response)
					let messages = response.messages.reverse();
					let replies = getObject(response.replies, "_id");
					let users = getObject(response.users, "_id");
					for (let i = 0; i < messages.length; i++) {
						let message = messages[i];
						let reply = replies[message.ReplyID];
						if (reply != null) {
							reply.user = users[message.UserID];
						}
						renderMessage(dms, message, users[message.UserID], reply);
					}
				}
			}
			findI("activeMessages").appendChild(div);
		}
	} else {console.log(convos)}
	
	const newMessageBtnHtml = `
		<div class="message" id="newMessage">
			<div class="messageImage" style="background:var(--contentColor3);color:var(--themeColor);border-radius:100px;display:flex;justify-content:center;align-items:center;font-size:30px;font-weight:bold;">+</div>
			<div class="messageName" style="color:var(--themeColor);font-family: 'Poppins';">
				New Message
			</div>
		</div>`;
	let messageHolder = document.getElementById("messageHolder");
	let startMessageBtn = document.getElementById("startAMessageButton");
	let requestsOpen;
	var selectedUsers = {};
	var cachedRequests = [];
  tempListen(findI("newMessage"), "click", async function () {
    let modalID = showPopUp("New DM", `<input class="searchUserInput" placeholder="Search for a user" id="searchUserInput"></div><div id="searchResults"></div>`, [["Start", "var(--themeColor)"],["Cancel", "var(--grayColor)"]]);
    findI("searchResults").id = "searchResults" + modalID;
    findI("searchUserInput").id = "searchUserInput" + modalID;
    let searchResults = findI("searchResults" + modalID);
    let startButton = findI("modalButtons" + modalID).children[0];
    startButton.style.display = "none";
		tempListen(startButton, "click", function() {
			//add the message to active messages
			document.querySelector('.topbarStatus').style.display = 'none';
			console.log(selectedUsers);
			var usernames = [];
			for(var i=0;i<Object.keys(selectedUsers).length;i++){
				const userid = Object.keys(selectedUsers)[i];
				const user = selectedUsers[userid];
				usernames.push(user.User);
				if(i == 0){
					document.querySelector(".topbarImage").src = decideProfilePic(user);
					document.querySelector(".newConvoImage").src = decideProfilePic(user);
				}
				if(Object.keys(selectedUsers).length == 1) {
					document.querySelector(".topbarName").innerText = user.User;
					document.querySelector(".newConvoName").innerText = user.User;
					document.querySelector(".newConvoText").innerHTML = `Embark on an amazing conversation with <b>${user.User}</b>!`;
				} else {
					document.querySelector(".topbarName").innerText = usernames.join(", ");
					document.querySelector(".newConvoName").innerText = usernames.join(", ");
					document.querySelector(".newConvoText").innerHTML = `Embark on an amazing conversation with ${usernames.map(a=>{if(usernames.indexOf(a)==usernames.length-1){return `and <b>${a}</b>`}else{return `<b>${a}</b>`}}).join(", ")}!`;
				}

				const dmChildren = Array.from(document.querySelector("#dms").children);
				dmChildren.forEach(child => {
					if (child.className == "dm" || child.className == "dmMinified") {
						child.remove()
					}
				});
			}
		});
    tempListen(findI("searchUserInput" + modalID), "keydown", async function (e) {
      if (e.key == "Enter") {
        let searchTerm = findI("searchUserInput" + modalID).value;
        searchResults.innerHTML = `<div class="loading"></div>`;
        startButton.style.display = "none";
        let [code, response] = await sendRequest("GET", `user/search?term=${searchTerm}&amount=10`);
        response = JSON.parse(response);
        if (code == 200) {
          if (response.length == 0) {
            searchResults.innerText = `We couldn't find anyone named "${searchTerm}".`;
          } else {
            searchResults.innerHTML = "";
          }
          response.forEach((user) => {
            let thisUser = createElement("newMessageUser", "div", searchResults);
            thisUser.id = user._id;
            thisUser.innerHTML = `<div class="newMessagePfp" style="background-image: url('${decideProfilePic(user)}')"></div><div class="newMessageUserInfo">${getRoleHTML(user)}<span class="newMessageUsername">${user.User}</span></div>`;
            tempListen(thisUser, "click", function () {
              if (selectedUsers[thisUser.id]) {
                delete selectedUsers[thisUser.id];
                thisUser.classList.remove("selected");
                startButton.style.display = (Object.keys(selectedUsers).length > 0 ? "inline-block" : "none");
              } else {
                selectedUsers[thisUser.id] = user;
                thisUser.classList.add("selected");
                startButton.style.display = "inline-block";
              }
            });
          });
        }
      }
    });
  });
	const requestMessages = findI("requestMessages");
	tempListen(startMessageBtn, "click", async function() {
		if (!requestsOpen) {
			requestsOpen = true;
			if(document.querySelector(".message[active]")) {
				document.querySelector(".message[active]").removeAttribute("active");
			}
			startMessageBtn.innerText = "< Active Messages";
      findI("activeMessages").style.opacity = 0.1;
      requestMessages.style.maxHeight = "99999px";
      requestMessages.style.transform = "scaleY(1)";
			let [code, response] = await sendRequest("GET", "conversations/requests");
			if (code == 200) {
				response = JSON.parse(response);
				let userObject = getObject(response.users, "_id");
				for(var i=0;i<response.conversations.length;i++) {
					const convo = response.conversations[i];
					const user = userObject[convo.Creator];
					cachedRequests.push([convo, user]);
					const html = `
						<img class="messageImage" src="${decideProfilePic(user)}">
						<div style="background: ${statuses[user.Status][1]};" class="messageStatus" title="${statuses[user.Status][0]}"></div>
						<div class="messageName">
							${user.User}
						</div>
						<!--<div class="messageNotif">2</div>-->
	 				`;

					let div = document.createElement("div");
					div.className = "message";
					div.setAttribute("convid", convo._id);
					div.setAttribute("user", user.User);
					div.setAttribute("creator", convo.Creator);
					tempListen(div, "click", async function() {
						if(document.querySelector(".acceptMessageHolder")) {
							document.querySelector(".acceptMessageHolder").remove()
						}
						let [code, response] = await sendRequest("GET", `conversations/messages?convid=${div.getAttribute("convid")}`);
						if(code == 200) {
							let renderMessage = await getModule("message");
							let dms = document.querySelector("#dms");
							response = JSON.parse(response)
							const dmChildren = Array.from(dms.children);
							dmChildren.forEach(child => {
								if (child.className == "dm" || child.className == "dmMinified") {
									child.remove();
								}
							});
							//change the top of the message elem
							console.log(response)
							let messages = response.messages.reverse();
		          let replies = getObject(response.replies, "_id");
		          let users = getObject(response.users, "_id");
		          for (let i = 0; i < messages.length; i++) {
		            let message = messages[i];
		            let reply = replies[message.ReplyID];
		            if (reply != null) {
		              reply.user = users[message.UserID];
		            }
		            renderMessage(dms, message, users[message.UserID], reply);
		          }
							
							const acceptMessages = document.createElement("div");
							div.setAttribute("active", "")
							acceptMessages.innerHTML = `
			 					<div class="acceptMessageText"><b>${div.getAttribute("user")}</b> wants to talk to you!</div>
				 				<div class="acceptMessageButtons">
				 					<button class="denyMessageButton">Deny</button>
									<button class="acceptMessageButton">Accept</button>
		 						</div>
							`;
							acceptMessages.className = "acceptMessageHolder";
							document.querySelector("#dmContent").prepend(acceptMessages);
							dms.scrollTo({ top: dms.scrollHeight, behavior: "smooth" });
							tempListen(document.querySelector(".denyMessageButton"), "click", function() {
								showPopUp(
									"Request Decline",
									"Are you sure you want to decline this request?",
									[
										["Yes", "var(--themeColor)", async function() {
											let [code2, response2] = await sendRequest("DELETE", "conversations/requests/decline?convid=" + div.getAttribute("convid"))
											if(code2 == 200) {
												div.style.transition = "opacity 0.4s, scale 0.4s";
												div.style.opacity = 0;
												div.style.scale = 1.1;
												setTimeout(() => {
													div.remove()
												}, 410)

												if(findI("activeMessages").firstChild) {
													findI("activeMessages").firstChild.setAttribute("active", "");
													findI("activeMessages").firstChild.click()
												}
											}
										}],
										["No", "grey", null]
									]
								)
							})
							tempListen(document.querySelector(".acceptMessageButton"), "click", async function() {
								let [code2, response2] = await sendRequest("PUT", "conversations/requests/accept?convid=" + div.getAttribute("convid"))
								if(code2 == 200) {
									requestsOpen = false;
									startMessageBtn.innerText = "Start a Message";
						      findI("activeMessages").style.opacity = 1;
									findI("activeMessages").prepend(div);
						      requestMessages.style.maxHeight = 0;
						      requestMessages.style.transform = "scaleY(0)";
									requestMessages.innerHTML = newMessageBtnHtml;
								}
							})
						} else {
							console.log(response)
						}
					});
					div.innerHTML = html;
					requestMessages.appendChild(div);
				}
			}
		} else {
			requestsOpen = false;
			startMessageBtn.innerText = "Start a Message";
      findI("activeMessages").style.opacity = 1;
      requestMessages.style.maxHeight = 0;
      requestMessages.style.transform = "scaleY(0)";
			requestMessages.innerHTML = newMessageBtnHtml;
		}
	});

	async function sendMessage (){
		let activeMessage = document.querySelector(".message[active]");
		const text = document.querySelector(".sendDMInput").textContent;
		const formData = new FormData();
		const convid = activeMessage?activeMessage.getAttribute("convid"):null;
		const newConvo = !convid?{
			name: selectedUsers[Object.keys(selectedUsers)[0]].User,
			invite: Object.keys(selectedUsers)
		}:null;

		let images = document.getElementsByClassName("newMessageImage");
		formData.append("data", JSON.stringify({ text, new: newConvo }));
		for (let i = 0; i < images.length; i++) {
      await fetch(images[i].src).then(async function(file) {
        formData.append("image" + i, await file.blob());
        URL.revokeObjectURL(images[i].src);
      });
    }
		const [code, response] = await sendRequest("POST", "conversations/messages/new" + (convid?`?convid=${convid}`:""), formData, true);
		if(code == 200) {
			document.querySelector(".sendDMInput").innerText = "";
			findI('newMessageImages').innerHTML = "";
			if(convid == null) {
				requestsOpen = false;
				startMessageBtn.innerText = "Start a Message";
	      findI("activeMessages").style.opacity = 1;
	      requestMessages.style.maxHeight = 0;
	      requestMessages.style.transform = "scaleY(0)";
				requestMessages.innerHTML = newMessageBtnHtml;

				let [code2, response2] = await sendRequest("GET", "conversations?convid=" + response)

				if(code2 == 200) {
					response2 = JSON.parse(response2);
					
					const users = getObject(response2.users);
					const convo = response2.conversations[0];
					const user = users[response2.Users[0]];
					const html = `
						<img class="messageImage" src="${decideProfilePic(user)}">
						<div style="background: ${statuses[user.Status][1]};" class="messageStatus" title="${statuses[user.Status][0]}"></div>
						<div class="messageName">
							${user.User}
						</div>
					`;
		
					let div = document.createElement("div");
					div.className = "message";
					div.setAttribute("convid", response);
					div.setAttribute("user", document.querySelector(".newConvoName").innerText);
					div.setAttribute("accepted", "");
					div.innerHTML = html;
					findI("activeMessages").prepend(div);
				}
				return;
			}
			if(activeMessage.getAttribute("accepted") == null) {
				let [code2, response2] = await sendRequest("PUT", "conversations/requests/accept?convid=" + convid)
				if(code2 == 200) {
					requestsOpen = false;
					startMessageBtn.innerText = "Start a Message";
					findI("activeMessages").style.opacity = 1;
					findI("activeMessages").prepend(activeMessage);
					requestMessages.style.maxHeight = 0;
					requestMessages.style.transform = "scaleY(0)";
					requestMessages.innerHTML = newMessageBtnHtml;
				}
			}
		}
	}

	tempListen(document.querySelector(".sendDMButton"), "click", async function() {
		sendMessage();
	});
	tempListen(document.querySelector(".sendDMInput"), "keypress", function(e) {
		if(e.keyCode == 13) {
			sendMessage();
			e.preventDefault();
		}
	});

	tempListen(findI("messageTopBarButton"), "click", function() {
		let dropdownOptions = [];
		const activeMessage = document.querySelector(".message[active]")
		if(!activeMessage) return;

		let creator = activeMessage.getAttribute("creator")
		if(creator == userID) {
			creator = true;
		}

		function closeDM() {
			//
		}
		function editDM() {
			//
		}
		function viewMembers() {
			//
		}
		
		if (window.innerWidth < 1075) {
			//
		}
	});

	const imageInput = findI("imageInput");
	const newMessageImages = findI("newMessageImages");
	tempListen(document.querySelector(".addDMImage"), "click", function() {
    imageInput.click();
  });
	function processUpload(files) {
    if (files == null) {
      return;
    }
    if (newMessageImages.childNodes.length < 3) {
      for (let i = 0; i < files.length; i++) {
        let file = files[i];
        if (file.kind == "file") {
          file = file.getAsFile();
        }
        if (file.kind != "string") {
          if (file.type.substring(0, 6) == "image/") {
            if (supportedImageTypes.includes(file.type.replace(/image\//g, "")) == true) {
              if (file.size < 5242881 || (file.size < 5242881 * 2 && hasPremium())) { // 5 MB
                let blob = URL.createObjectURL(file);
                let image = createElement("newMessageImageContainer", "div", newMessageImages);
                createElement("newMessageImage", "img", image).src = blob;
                let deleteButton = createElement("deleteImage", "div", image);
								deleteButton.style = "height:20px;width:20px;font-size:15px;";
                deleteButton.innerHTML = "&times;";
                deleteButton.addEventListener("click", function(e) {
                  URL.revokeObjectURL(e.target.parentElement.querySelector(".newMessageImage").src);
                  e.target.parentElement.remove();
                });
              } else {
                if (file.size > 5242881 && !hasPremium()) {
                  showPopUp("Too Big!", `Your image must be under 5MB.${premiumPerk("Upload limits are doubled! Upload images up to 10MB for your messages.")}`, [["Okay", "var(--grayColor)"]]);
                } else {
                  if (file.size > 5242881 * 2 && hasPremium()) {
                    showPopUp("Too Big!", "Your image must be under 10MB!", [["Okay", "var(--grayColor)"]]);
                  }
                }
              }
            } else {
              showPopUp("Invalid Image Type", `Photop only accepts images of the following types: <i style='color: #bbb'>${(supportedImageTypes.join(", "))}</i>${file.type.replace(/image\//g, "") == "gif" ? premiumPerk("Upload GIFs to use in messages!") : ""}`, [["Okay", "var(--grayColor)"]]);
            }
          } else {
            showPopUp("Must be an Image", "Only image files can be uploaded to Photop.", [["Okay", "var(--grayColor)"]]);
          }
        }
      }
    }
  }
  imageInput.addEventListener("change", function(e) {
    processUpload(e.target.files);
  });

	let messageText = document.querySelector(".sendDMInput");
	let lastLength = 0;
	async function updateMessageFormat() {
    await sleep(1);
    let caretWas = getCurrentCursorPosition(messageText);
    let nodes = messageText.childNodes;
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].nodeName == "DIV" || nodes[i].nodeName == "SPAN") {
        nodes[i].innerHTML = preFormat(nodes[i].innerText);
      } else if (nodes[i].nodeValue != null) {
        let newSpan = createElement("", "span", messageText);
        newSpan.innerHTML = preFormat(nodes[i].nodeValue);
        nodes[i].replaceWith(newSpan);
      } else {
        messageText.innerHTML = preFormat(nodes[i].innerHTML);
      }
    }
    if (messageText.innerHTML == "<br>") {
      messageText.innerHTML = "";
    }
    if (caretWas > -1) {
      setCurrentCursorPosition(messageText, caretWas);
    }
    messageText.focus();
  }
	async function checkForMentions() {
    await sleep(1);
    let mentionsDropdown = findI("mentionsDropdown");
    let node = document.getSelection().anchorNode;
    if (node != null && node.parentElement.closest(".newPost") != null && node.parentElement.className == "mention") {
      let lookupTx = node.textContent.substring(1);
      if (lookupTx == "") {
        return;
      }
      let rect = node.parentElement.getBoundingClientRect();
      if (mentionsDropdown == null) {
        mentionsDropdown = createElement("dropdown", "div", "pageHolder");
        mentionsDropdown.id = "mentionsDropdown";
        mentionsDropdown.style.display = "none";
      }
      if (mentionsDropdown.getAttribute("lastText") == lookupTx) {
        return;
      }
      mentionsDropdown.setAttribute("lastText", lookupTx);
      mentionsDropdown.style.left = rect.left + "px";
      mentionsDropdown.style.top = rect.top + 24 + "px";
      let sentTime = Date.now();
      lastRequest = sentTime;
      let [code, response] = await sendRequest("GET", "user/search?term=" + lookupTx + "&amount=10");
      if (lastRequest != sentTime) {
        return;
      }
      if (code == 200) {
        response = JSON.parse(response);
        if (response.length == 0) {
          mentionsDropdown.style.opacity = 0;
          mentionsDropdown.style.display = "none";
          mentionsDropdown.style.height = "0px";
          return;
        }
        mentionsDropdown.innerHTML = "";
        for (let i = 0; i < response.length; i++) {
          let user = response[i];
          let userHtml = `<img class="mentionUserPfp" src="${decideProfilePic(user)}"> ${getRoleHTML(user)}<span style="margin-left: 4px">${user.User}</span>`
          let userContainer = createElement("mentionUser", "div", mentionsDropdown);
          userContainer.setAttribute("user", user.User);
          userContainer.innerHTML = userHtml;
          userContainer.addEventListener("mouseup", async function() {
            node.textContent = "@" + user.User + "&nbsp;";
            mentionsDropdown.remove();
            mentionsDropdown = null;
            setCurrentCursorPosition(node, node.textContent.length - 1);
          });
        }
        mentionsDropdown.style.opacity = 1;
        mentionsDropdown.style.display = "unset";
        mentionsDropdown.style.height = response.length * 43 + 4 + "px";
      }
    } else {
      let mentionsDropdown = findI("mentionsDropdown");
      if (mentionsDropdown != null) {
        mentionsDropdown.remove();
        mentionsDropdown = null;
      }
    }
  }
	messageText.addEventListener("keydown", async function(e) {
    await sleep(1);
    if (messageText.textContent.length != lastLength) {
      updateMessageFormat();
      lastLength = messageText.textContent.length;
    }
    if (e.code == "Tab") {
      e.preventDefault();
      let mentionsDropdown = findI("mentionsDropdown");
      if (mentionsDropdown != null && mentionsDropdown.firstChild != null) {
        let node = document.getSelection().anchorNode;
        if (node != null && node.parentElement.className == "mention") {
          node.textContent = "@" + mentionsDropdown.firstChild.getAttribute("user") + "&nbsp;";
          mentionsDropdown.remove();
          setCurrentCursorPosition(node, node.textContent.length - 1);
        }
      }
    } else {
      checkForMentions();
    }
  }, "selection");
}