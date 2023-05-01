modules.message = function(parent, message, user, reply, isSending, extra) {
	//get reply stuff working
	//(await getModule("message"))(document.querySelector("#dms"), {Timestamp: 1, UserID: account._id, Text: 'testing'}, {User: 'Abooby', Settings: {ProfilePic: "6154f0d0a8d6d106c5b869b6797b8088"}})
	if (parent == null) {
    return;
  }
  extra = extra || {};
  let messageHTML = "";  
  let className = "dm";
	let self;
	if(message.UserID == userID) {
		self = true;
	}
  if (extra.addTop != true) {
    if (parent.lastElementChild != null && message.ReplyID == null && parent.lastElementChild.getAttribute("userid") == message.UserID && parent.lastElementChild.querySelector(".messageReplyHolder") == null && parent.lastElementChild.hasAttribute("sending") == false) {
      className = "dmMinified";
      messageHTML = `${self?`<span class="dmText" minified self></span>`:""}<span class="dmTimestamp dmTimestampMinified" title="` + formatFullDate(message.Timestamp) + `" ${self?"minifiedself self":"minified"}>${timeSince(message.Timestamp, false)}</span>${!self?`<span class="dmText" minified></span>`:""}`;
    }
  } else {
		//move to message variable
    if (parent.firstElementChild != null && message.ReplyID == null && parent.firstElementChild.querySelector(".messageReplyHolder") == null && parent.firstElementChild.getAttribute("userid") == chat.UserID) {
      let oldMessage = parent.firstElementChild;
      let convertMessage = createElement("dmMinified", "div", parent);
      parent.insertBefore(convertMessage, parent.firstChild);
      convertMessage.id = oldMessage.id;
      convertMessage.setAttribute("type", "message");
      convertMessage.setAttribute("text", oldMessage.getAttribute("text"));
      convertMessage.setAttribute("userid", oldMessage.getAttribute("userid"));
      convertMessage.setAttribute("user", oldMessage.getAttribute("user"));
      convertMessage.setAttribute("time", oldMessage.getAttribute("time"));
      convertMessage.innerHTML = `
				${!self?`<span class="chatMinfiyTime" title="` + formatFullDate(parseInt(oldMessage.getAttribute("time"))) + `">${oldMessage.querySelector(".dmTimestamp, .dmTimestampMinified").textContent}</span>`:''}
				<span class="dmText" ${self?'self':''} minified></span>
				${self?`<span class="chatMinfiyTime" title="` + formatFullDate(parseInt(oldMessage.getAttribute("time"))) + `">${oldMessage.querySelector(".dmTimestamp, .dmTimestampMinified").textContent}</span>`:''}
			`;
      convertMessage.querySelector(".dmTextMinified").innerHTML = oldMessage.querySelector(".dmText").innerHTML;
      oldMessage.remove();
    }
  }
  if (messageHTML == "") {
    if (reply == null) {
      if(self) {
				messageHTML = `
					<div class="dmContent" self>
						<div class="dmUser">
							<div class="dmTimestamp" title="${formatFullDate(message.Timestamp)}" self>${timeSince(message.Timestamp, false)}</div>
							<div class="dmUsername">${getRoleHTML(user)}${user.User}</div>
						</div>
						<div class="dmText" self></div>
					</div>
					<img self class="dmImage" src="${decideProfilePic(user)}">
				`;
			} else {
				messageHTML = `
					<img class="dmImage" src="${decideProfilePic(user)}">
					<div class="dmContent">
						<div class="dmUser">
							<div class="dmUsername">${getRoleHTML(user)}${user.User}</div>
							<div class="dmTimestamp" title="${formatFullDate(message.Timestamp)}">${timeSince(message.Timestamp, false)}</div>
						</div>
						<div class="dmText"></div>
					</div>
		 		`;
			}
    } else {
			//<div class="chatReplyHolder" type="reply" replyid="${reply._id}"><div class="chatReplyLine"></div><span class="chatReplyUsername">${reply.user.User}</span>
      if(self) {
				messageHTML = `
					<div class="messageReplyHolder" self type="reply" replyid="${reply._id}">
						<span class="chatReplyText"></span>
						<span class="chatReplyUsername">${reply.user.User}</span>
			 			<div class="messageReplyLine" self></div>
			 		</div>
					<div class="dmContent" self>
						<div class="dmUser">
							<div class="dmTimestamp" title="${formatFullDate(message.Timestamp)}" self>${timeSince(message.Timestamp, false)}</div>
							<div class="dmUsername" type="user">${getRoleHTML(user)}${user.User}</div>
						</div>
						<div class="dmText" self></div>
					</div>
					<img self class="dmImage" src="${decideProfilePic(user)}">
				`;
			} else {
				messageHTML = `
					<div class="messageReplyHolder" type="reply" replyid="${reply._id}">
		 				<div class="messageReplyLine"></div>
			 			<span class="chatReplyUsername">${reply.user.User}</span>
					 	<span class="chatReplyText"></span>
			 		</div>
					<img class="dmImage" src="${decideProfilePic(user)}">
					<div class="dmContent">
						<div class="dmUser">
							<div class="dmUsername">${getRoleHTML(user)}${user.User}</div>
							<div class="dmTimestamp" title="${formatFullDate(message.Timestamp)}">${timeSince(message.Timestamp, false)}</div>
						</div>
						<div class="dmText"></div>
					</div>
				`;
			}
    }
  }
  let newMessage = createElement(className, "div", parent);
  if (extra.addTop == true) {
    parent.insertBefore(newMessage, parent.firstChild);
  }
  newMessage.id = message._id;
  newMessage.setAttribute("type", "message");
  newMessage.setAttribute("text", message.Text);
  newMessage.setAttribute("userid", message.UserID);
  newMessage.setAttribute("user", user.User);
  newMessage.setAttribute("time", message.Timestamp);
  newMessage.setAttribute("tabindex", 0);
  newMessage.setAttribute("editing", false);
  newMessage.innerHTML = messageHTML;
  if (newMessage.querySelector(".chatReplyText") != null) {
    newMessage.querySelector(".chatReplyText").innerHTML = reply.Text;
  }

	const editedHTML = message.Edited ? `<span class="chatEditedTitle" title="${formatFullDate(message.Edited)}">(edited)</span>` : "";
	let messageText = newMessage.querySelector(".dmText");
  messageText.innerHTML = `${formatText(message.Text)} ${editedHTML}`;
	
  if (isSending == true) {
    newMessage.style.color = "#bbb";
    newMessage.setAttribute("sending", "");
  }
}