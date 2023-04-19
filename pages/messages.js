wireframes.messages = `
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
	 		<div id="activeMessages">
		 		<!--<div class="message">
					<img class="messageImage" src="https://photop-content.s3.amazonaws.com/ProfileImages/63536df87c9dbb50fc24aa91c1fb321d">
					<div style="background: #a4a4a4;" class="messageStatus"></div>
					<div class="messageName">
						Franco
					</div>
					<div class="messageNotif">2</div>
				</div>
	
				<div class="message" active>
					<img class="messageImage" src="https://photop-content.s3.amazonaws.com/ProfileImages/6066b99198895e660082965bcb91d776">
					<div style="background: rgb(0, 252, 101);" class="messageStatus"></div>
					<div class="messageName">
						Robot_Engine
					</div>
					<div class="messageNotif">317</div>
				</div>-->
		 	</div>
	 	</div>
		<div id="mainHolder">
	 		<div class="stickyContainer" id="dmTopBar">
		 		<img class="topbarImage" src="https://photop-content.s3.amazonaws.com/ProfileImages/6066b99198895e660082965bcb91d776">
				<div style="background: rgb(0, 252, 101);" class="topbarStatus"></div>
				<span class="topbarName">Robot_Engine</span>
				<button class="topbarOptions groupToolbarButton">
		      <svg viewBox="0 0 41.915 41.915"><g fill="var(--themeColor)"><path style="" id="Svg" d="M11.214,20.956c0,3.091-2.509,5.589-5.607,5.589C2.51,26.544,0,24.046,0,20.956c0-3.082,2.511-5.585,5.607-5.585 C8.705,15.371,11.214,17.874,11.214,20.956z"></path><path d="M26.564,20.956c0,3.091-2.509,5.589-5.606,5.589c-3.097,0-5.607-2.498-5.607-5.589c0-3.082,2.511-5.585,5.607-5.585 C24.056,15.371,26.564,17.874,26.564,20.956z"></path><path d="M41.915,20.956c0,3.091-2.509,5.589-5.607,5.589c-3.097,0-5.606-2.498-5.606-5.589c0-3.082,2.511-5.585,5.606-5.585 C39.406,15.371,41.915,17.874,41.915,20.956z"></path></g></svg>
		    </button>
			</div>

			<div id="dmHolder">
	 			<div id="dms">
		 			<div id="newConvoMessage">
						<img class="newConvoImage" src="https://photop-content.s3.amazonaws.com/ProfileImages/6154f0d0a8d6d106c5b869b6797b8088">
						<div class="newConvoName">Robot_Engine</div>
						<div class="newConvoText">Embark on an amazing conversation with <b>Robot_Engine</b>!</div>
	 				</div>
		 			<div class="dm">
						<img class="dmImage" src="https://photop-content.s3.amazonaws.com/ProfileImages/6066b99198895e660082965bcb91d776">
						<div class="dmContent">
							<div class="dmUser">
								<div class="dmUsername">Robot_Engine</div>
								<div class="dmTimestamp">1d</div>
							</div>
							<div class="dmText">Work on DMS!!!!!!!!</div>
						</div>
					</div>

					<div class="dm" self>
						<div class="dmContent" self>
							<div class="dmUser">
								<div class="dmTimestamp" self>1d</div>
								<div class="dmUsername">Abooby</div>
							</div>
							<div class="dmText">Alr ill work on them</div>
						</div>
						<img self class="dmImage" src="https://photop-content.s3.amazonaws.com/ProfileImages/6154f0d0a8d6d106c5b869b6c6ce300f">
					</div>
		 			<div class="dmMinified" self>
						<div class="dmText" self minified>Hi</div>
						<div class="dmTimestamp dmTimestampMinified" minifiedself>1hr</div>
					</div>
			
	 			</div>
		 		<div id="dmContent">
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
	let [status, convos] = await sendRequest('GET', 'conversations');
	if (status == 200) {
		convos = JSON.parse(convos);
		let userObject = getObject(convos.users, '_id');
		for(var i=0;i<convos.conversations.length;i++) {
			const convo = convos.conversations[i];
			const user = userObject[convo.Creator];
			const html = `
				<img class="messageImage" src="${decideProfilePic(user)}">
				<div style="background: ${statuses[user.Status][1]};" class="messageStatus" title="${statuses[user.Status][0]}"></div>
				<div class="messageName">
					${user.User}
				</div>
			`;

			let div = document.createElement('div');
			div.className = 'message';
			div.setAttribute('convid', convo._id)
			div.innerHTML = html;
			findI('messageHolder').appendChild(div);
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
	var cachedRequests = [];
  tempListen(findI("newMessage"), "click", async function () {
		let selectedUsers = {};
    let modalID = showPopUp("New DM", `<input class="searchUserInput" placeholder="Search for a user" id="searchUserInput"></div><div id="searchResults"></div>`, [["Start", "var(--themeColor)"],["Cancel", "var(--grayColor)"]]);
    findI("searchResults").id = "searchResults" + modalID;
    findI("searchUserInput").id = "searchUserInput" + modalID;
    let searchResults = findI("searchResults" + modalID);
    let startButton = findI("modalButtons" + modalID).children[0];
    startButton.style.display = "none";
		tempListen(startButton, "click", function() {
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
					tempListen(div, "click", async function() {
						const [code, request] = await sendRequest("GET", `conversations?convid=${div.getAttribute("convid")}`)
						if(code == 200) {
							const div = document.createElement("div");
							div.innerHTML = `
			 					<div class="acceptMessageText"></div>
				 				<div class="acceptMessageButtons">
				 					<button class="denyMessageButton">Deny</button>
									<button class="acceptMessageButton">Accept</button>
		 						</div>
							`;
							div.className = "acceptMessageHolder";
							document.querySelector("#dmContent").prepend(div);
						} else {
							console.log(request)
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
}