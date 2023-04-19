modules.message = function(parent, message, user, extra) {
	if (parent == null) {
    return;
  }
  extra = extra || {};

	if (message.UserID == user._id) {
		extra.self = true;
	}
	
	let html = "";
	let className = "dm";

	if (parent.lastElementChild != null && chat.ReplyID == null && parent.lastElementChild.getAttribute("userid") == message.UserID && parent.lastElementChild.querySelector(".dmReplyHolder") == null && parent.lastElementChild.hasAttribute("sending") == false) {
		className = "dmMinified";
		chatHTML = `<span class="dmTimestamp dmTimestampMinified" ${extra.self?'minifiedself':''} title="` + formatFullDate(message.Timestamp) + `">${timeSince(message.Timestamp, false)}</span><span class="dmText" ${extra.self?'self':''} minified></span>`;
	}

	if (html == "") {
    if (reply == null) {
      html = `${!extra.self?`<img src="${decideProfilePic(user)}" class="dmImage" type="user" tabindex="0">`:''}<div class="dmContent" ${extra.self?'self':''}><div class="dmUser">${extra.self?`<span class="dmTimestamp" title="` + formatFullDate(chat.Timestamp) + `" self>${timeSince(chat.Timestamp, false)}</span>`:''}<span class="dmUsername" type="user">${getRoleHTML(user)}${user.User}</span> ${!extra.self?`<span class="dmTimestamp" title="` + formatFullDate(chat.Timestamp) + `">${timeSince(chat.Timestamp, false)}</span>`:''}<div class="dmText"></div></div>${extra.self?`<img src="${decideProfilePic(user)}" class="dmImage" type="user" tabindex="0" self>`:''}</div>`;
    } else {//finish self for reply holder
      html = `<div class="dmReplyHolder" type="reply" replyid="${extra.reply._id}"><div class="dmReplyLine"></div><span class="dmReplyUsername">${extra.reply.user.User}</span><span class="dmReplyText"></span></div>${!extra.self?`<img src="${decideProfilePic(user)}" class="dmImage" type="user" tabindex="0">`:''}<div class="dmContent" ${extra.self?'self':''}><div class="dmUser">${extra.self?`<span class="dmTimestamp" title="` + formatFullDate(chat.Timestamp) + `" self>${timeSince(chat.Timestamp, false)}</span>`:''}<span class="dmUsername" type="user">${getRoleHTML(user)}${user.User}</span> ${!extra.self?`<span class="dmTimestamp" title="` + formatFullDate(chat.Timestamp) + `">${timeSince(chat.Timestamp, false)}</span>`:''}<div class="dmText"></div></div>${extra.self?`<img src="${decideProfilePic(user)}" class="dmImage" type="user" tabindex="0" self>`:''}</div>`;
    }
  }
}