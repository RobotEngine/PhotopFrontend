let themes = [["/section", "Basic"], ["Dark", "#151617"], ["Light", "#E6E9EB"], ["/section", "New"], ["Blood Moon", "linear-gradient(to bottom, #5c0701, black)"], ["Under The Sea", "linear-gradient(to bottom, #4ecbef, #0062fe)"], ["Hacker", "black"], ["Midnight Haze", "linear-gradient(135deg, #0c1762, #650f9b, #780f31)"], ["Moss Green", "radial-gradient(ellipse at bottom, #658d65, #0d2c0a)"], ["Ourple 😂", "#4638a1"], ["Peachy Mist", "linear-gradient(315deg, #f0b980, pink)"], ["Faded", "linear-gradient(315deg, #336264, #3a4048)"], ["Into the Light", "radial-gradient(circle at 30% 70%, #fbe286, #4caed3)"], ["Canyon", "radial-gradient(ellipse at bottom, #d5610f, #581703)"], ["Spocco", "linear-gradient(180deg, #ededed 20%, #bbb8b8 80%)"], ["Into the Night", "radial-gradient(circle at 50% 20%, #3e5a72, #000)"]];
let dispOptions = ["Embed YouTube Videos", "Embed Twitch Streams", "Embed GIFs"];
wireframes.settings = `<div class="stickyContainer settingsTabs" id="tabs">
  <span class="tab" type="account" id="tab-account" tabindex="0">Account</span>
  <span class="tab" type="display" id="tab-display" tabindex="0">Display</span>
  <span class="tab" type="blocked" id="tab-blocked" tabindex="0">Blocked</span>
</div>`; //<span class="tab" type="inventory" id="tab-inventory" tabindex="0">Inventory</span>

pages.settings = function () {
	let settingsTabs = ["account", "display", "blocked"]; //inventory
	let currentSettingsTab = "";

  modifyParams("post");
  modifyParams("chat");
  modifyParams("group");
  modifyParams("user");
	let premium = hasPremium()
	let limit = premium ? 600 : 300;

	let alreadyOpenTab = findI("settingsHolder");
	if (alreadyOpenTab != null) {
		alreadyOpenTab.remove();
	}

	let tabRenders = {
		account: async function () {
			let accountHolder = createElement("settingsHolder-account", "div", "pageHolder");
			accountHolder.id = "settingsHolder";
			let settingsBanner;
			if (account.Settings != null && account.Settings.ProfileBanner != null) {
				settingsBanner = `<img class="settingsBanner" src="${assetURL + "ProfileBanners/" + account.Settings.ProfileBanner}">`;
			} else {
				settingsBanner = `<div class="settingsBanner" style="background: var(--contentColor)"></div>`;
			}
			account.ProfileData = account.ProfileData || {};
			/*
			let description = (account.ProfileData.Description || "").split("\n");
			let setInnerHTML = "";
			for (let i = 0; i < description.length; i++) {
			  let lineTx = description[i];
			  if (lineTx.length < 1) {
			    setInnerHTML += "<div><br></div>";
			  } else if (i > 0) {
			    setInnerHTML += "<div>" + lineTx + "</div>";
			  } else {
			    setInnerHTML += "<span>" + lineTx + "</span>";
			  }
			}
			*/
			accountHolder.innerHTML = `
        <input id="imageInputBanner" type="file" accept="image/*" multiple="true" hidden="true">
        <input id="imageInputProfile" type="file" accept="image/*" multiple="true" hidden="true">
        <div class="settingsSection">
          <div class="settingsBannerHolder">
            ${settingsBanner}
            <div class="settingsUploadButton" id="bannerUpload"></div>
          </div>
          <div class="settingsPfpHolder">
            <img src="${decideProfilePic(account)}" class="settingsPfp">
            <div class="settingsUploadButton" id="profileUpload"></div>
          </div>
					<div style="display:flex;margin-top:6px;">
	          <input class="settingsInput" id="settingsUsername" placeholder="${account.User}" changed="false">
	          <button class="settingsSave" id="saveBasic">Save</button>
					</div>
					
					<div style="display:flex;margin-top:10px;">
						<div style="display:flex;">
							<span style="margin:auto 2.58px auto 0px;font-size:16px;font-weight:bold;">?user=</span><input class="settingsInput" id="settingsNewUrl" changed="false" placeholder = "${account.CustomURL || "Custom URL"}">
						</div>
	          <button class="settingsSave" style="background:var(--premiumColor)" id="saveURL">Save</button>
					</div>
        </div>
				
        <div class="settingsSection">
          <div class="settingsTitle">Profile Description</div>
          <div id="profileDescription" contenteditable="true" placeholder="Describe Yourself!" class="textArea">${(account.ProfileData.Description || "").replace(/\n/g, "<br>")}</div>
          <div class="settingsProfileDescriptionChar">0/${limit}</div>
          <div class="settingsSaveHolder"><button class="settingsSave" id="saveDescription">Save</button></div>
        </div>

				<div class="settingsSection" id="exotekAccount">
		
					<div id="exotekUser">
						<img src="${account.Exotek.image || "https://exotek.co/images/defaultimage.svg"}">
						<div id="exotekInfo">
							<div id="exotekUsername">${account.Exotek.user}</div>
			 				<div id="exotekEmail">${account.Email}</div>
	 					</div>
	 				</div>
			
					<div id="exotekButtons">
						<button id="exotekManageButton" title="Manage your Exotek account">Manage</button>
						<!--<button id="exotekTransferButton" title="Transfer your Photop to another Exotek Account">Transfer</button>-->
	 				</div>
			
				</div>

        <div class="settingsSection">
					<div class="settingsTitle">Premium</div>
					${hasPremium() == true ? `<div id="premiumStats">
						<div class="premiumSection" title="${account.Premium.Status}">
							<span style="font-weight:bold;margin-right:6px;" id="statusTitle">Status</span> <span style="margin-left:auto;text-align:right;" id="premiumStatus">${account.Premium.Status.toUpperCase()}</span>
						</div>
						<div class="premiumSection" title="${formatFullDate(account.Premium.Expires * 1000)}">
							<span style="font-weight:bold;margin-right:6px;" id="expireTitle">Expire Date</span> <span style="margin-left:auto;text-align:right;" id="premiumExpire">${account.Premium.Expires}</span>
						</div>
						<div class="premiumSection" style="margin:0;" title="${formatFullDate(account.Premium.Bought * 1000)}">
							<span style="font-weight:bold;margin-right:6px;" id="boughtTitle">Bought Date</span> <span style="margin-left:auto;text-align:right;" id="premiumBought">${account.Premium.Bought}</span>
						</div>
					</div>` : ''}
					<button title="Manage your Premium" class = "managePremiumBtn lightBlue" style="padding:8px;" id="managePremium">Manage Premium</button>
					<div class="settingsTitle" style="margin-top:6px;">Gifts</div>
					<div id = "giftDivFlex1">
						<button class = "managePremiumBtn" style="background-color:var(--contentColor3);"><div realnum="${(account.Premium || {}).GiftMonths || 0}" class="counter postChatCounter" style="height:50px;"><span id="giftCount">${(account.Premium || {}).GiftMonths || 0}</span></div>
						
						<div style="font-size:18px;">Month Credits</div>
						</button>
						<div>
							<button title="Manage Gifts" class = "managePremiumBtn lightBlue" id = "manageGifts">Manage Gifts</button>
							<button title="Buy Gift" class = "managePremiumBtn premiumColor" id="buyGiftPremium">Buy Gift</button>
						</div>
					</div>
				</div>
	
        <div class="settingsSection">
          <div class="settingsTitle">Social Connections</div>
          <div class="settingsSmall">Click a social media to add it to your profile.</div>
          <div id="socialRow"></div>
          <div class="settingsTitle">Active Connections (<span id="connectionCount">0</span>/12)</div>
          <div id="activeConnections"></div>
        </div>
        <div class="settingsSection">
          <div class="settingsTitle">Profile Privacy</div>
          <div class="settingsSmall">Set who can see your profile.</div>
          <button class="settingsVisibility">${account.ProfileData.Visibility || "Public"}</button>
          <div class="settingsSmall" id="settingsVisibilityFlavor"></div>
          <div style="margin-top: 10px;">
            <div class="settingsTitle">Affiliate Link</div>
            <div class="settingsSmall">Anyone who signs up using this link will follow you automatically!</div>
            <div id="settingsAffiliateLinkFlex">
              <input class="settingsInput" readonly id="affiliateUrlInput"></input>
              <button id="settingsCopyText">Copy</button>
            </div>
            <div class="settingsAffiliateStats">
              <div class="settingsAffiliateStat" id="settingsAffiliateStatClicks">0 Clicks</div>
              <div class="settingsAffiliateStat" id="settingsAffiliateStatSignUps">0 Sign Ups</div>
            </div>
          </div>
        </div>
      `;

			function formatDate(time) {
				const date = new Date(time * 1000);
				let formattedDate = "";

				switch (date.getMonth()) {
					case 0:
						formattedDate += "Jan, ";
						break;
					case 1:
						formattedDate += "Feb, ";
						break;
					case 2:
						formattedDate += "Mar, ";
						break;
					case 3:
						formattedDate += "Apr, ";
						break;
					case 4:
						formattedDate += "May, ";
						break;
					case 5:
						formattedDate += "Jun, ";
						break;
					case 6:
						formattedDate += "Jul, ";
						break;
					case 7:
						formattedDate += "Aug, ";
						break;
					case 8:
						formattedDate += "Sep, ";
						break;
					case 9:
						formattedDate += "Oct, ";
						break;
					case 10:
						formattedDate += "Nov, ";
						break;
					case 11:
						formattedDate += "Dec, ";
						break;
				}

				formattedDate += date.getDate() + ' ' + date.getFullYear();

				return formattedDate;
			}
      if(findI("premiumExpire")){
			  findI("premiumExpire").innerText = formatDate(account.Premium.Expires);
			  findI("premiumBought").innerText = formatDate(account.Premium.Bought);

				switch(account.Premium.Status) {
					case 'expired':
						findI("expireTitle").innerText = "Expired";
						findI("boughtTitle").innerText = "Subscribed";
						break;
					case 'active':
						findI("expireTitle").innerText = "Renews";
						findI("boughtTitle").innerText = "Subscribed";
						break;
					case 'canceled':
						findI("expireTitle").innerText = "Expires";
						findI("boughtTitle").innerText = "Subscribed";
						break;
				}
      }
			tempListen(findI("manageGifts"), "click", async function () {
				showPopUp("Premium Gifting", `
						<div>
							<div style="display:flex; align-items: center; width: 100%">
								<span style="font-weight: bold"><span id="currentGifts" style="color: var(--premiumColor);">${account.Premium.GiftMonths || 0}</span> Months</span>
								<div style="background: var(--pageColor); display: flex; align-items: center; padding: 6px; margin-left: auto; border-radius: 14px">
                  <span style='margin-right: 8px'>Gift</span>
                  <input id="giftLengthInput" class="settingsInput" min="0" max="${account.Premium.GiftMonths || 0}" placeholder="${account.Premium.GiftMonths || 0}" style="font-size: 20px; width: 50px; margin: 0px; font-size:17px; text-align: center">
                  <span style="margin-left: 8px">Months</span>
								  <button id="createGiftButton" style="background-color:var(--premiumColor); margin-left: 8px; font-size:17px; text-align: center">Create</button>
                </div>
							</div>
	
							<div id="giftLinks" class="groupHolder-links"></div>
						</div>
				`, [
					[
						"Close",
						"grey",
						null
					]
				]);
        const giftLinksContainer = findI("giftLinks");
				const giftLengthInput = findI("giftLengthInput");
				const currentGifts = findI("currentGifts");
				function checkGifts() {
					if (giftLinksContainer.children.length == 0) {
						giftLinksContainer.innerHTML = "<span class=\"noGifts\">You have no gifts...</span>";
					} else {
						if (!giftLinksContainer.querySelector(".noGifts")) return;
						giftLinksContainer.querySelector(".noGifts").remove();
					}
				}
        async function loadGifts(){
					giftLinksContainer.innerHTML = "";
	        let [status, response] = await sendRequest("GET", "premium/gift/gifts");
	        response = JSON.parse(response); //Please fix the server robot!! - flurri
					if (response.length == 0) {
						giftLinksContainer.innerHTML = "<span class=\"noGifts\">You have no gifts...</span>";
					}
	        for(let i = 0; i < response.length; i++){
	          const gift = response[i];
	          const link = createElement('inviteLink', 'div', giftLinksContainer);
	          link.innerHTML = `<span style="display:inline;margin:0px 6px 0px 2px;font-weight:bold;">${gift.Length}mo</span><div style="cursor:pointer;" title="${gift.Length} Month Gift | Click to Copy" class="link" onclick="copyClipboardText('https://app.photop.live/?gift=${gift.Code}')">?gift=${gift.Code}</div><span class="removeLink" tabindex="0">×</span>`
	          link.setAttribute('giftid', gift.Code);
	          tempListen(link.querySelector('.removeLink'), "click", async function(e){
							link.style.opacity = 0.5;
							const [status, response] = await sendRequest("DELETE", `premium/gift/revoke?code=${e.target.parentElement.getAttribute('giftid')}`);
							if(status == 200){
								e.target.parentElement.remove();
								checkGifts();
							}else{
								link.style.opacity = 1;
								showPopUp("An Error Occured", response, [
									["Okay", "var(--grayColor)"]
								]);
							}
						});
	        }
        }
				function createGift(id) {
					const link = document.createElement("div");
					link.className = "inviteLink";
					giftLinksContainer.prepend(link);
					link.style.transform = "scale(0.9)";
					link.style.opacity = 0;
					link.style.transition = "all 0.4s";
					link.innerHTML = `<span style="display:inline;margin:0px 6px 0px 2px;font-weight:bold;">${giftLengthInput.value}mo</span> <div style="cursor:pointer;" title="${giftLengthInput.value} Month Gift | Click to Copy" class="link" onclick="copyClipboardText('https://app.photop.live/?gift=${id}')">?gift=${id}</div><span class="removeLink" tabindex="0">×</span>`
					link.setAttribute('giftid', id);
					setTimeout(function() {
						link.style.transform = "scale(1)";
						link.style.opacity = 1;
						checkGifts();
					}, 10)
					tempListen(link.querySelector('.removeLink'), "click", async function(e){
						link.style.opacity = 0.5;
						const [status, response] = await sendRequest("DELETE", `premium/gift/revoke?code=${e.target.parentElement.getAttribute('giftid')}`);
						if(status == 200){
							e.target.parentElement.remove();
							checkGifts();
						}else{
							link.style.opacity = 1;
							showPopUp("An Error Occured", response, [
								["Okay", "var(--grayColor)"]
							]);
						}
					});
				}
        loadGifts()
				tempListen(findI("createGiftButton"), 'click', async function(){
					if (giftLengthInput.value.length <= 0) {
						showPopUp("Invalid Gift Months", "Please enter at least one gift month", [
							[
								"Close",
								"grey"
							]
						])
						return;
					}
	        const [status, response] = await sendRequest("POST", "premium/gift/new", { length: parseInt(giftLengthInput.value) });
          if(status == 200){
            createGift(response);
						giftLengthInput.value = "";
          }else{
            showPopUp("An Error Occured", response, [
							["Okay", "var(--grayColor)"]
						]);
          }
	      });
			});
			tempListen(findI("managePremium"), "click", async function () {
				window.loginWindow = (await getModule("webmodal"))("https://exotek.co/account?userid=" + account.AccountID, "Premium Management");
			});
			tempListen(findI("buyGiftPremium"), "click", async function () {
				setPage("premium").then(() => {
          findI("premiumGift").click();
        });
			});

			tempListen(findI("saveURL"), "click", async function () {
				let text = findI("settingsNewUrl").value.toLowerCase();
				if (!hasPremium()) {
					showPopUp("No Premium", "In order to set a custom URL, you need Premium!", [
						[
							"Premium",
							"var(--premiumColor)",
							function () {
								setPage("premium");
							}
						],
						[
							"Close",
							"grey",
							null
						]
					]);
					return;
				}
				if (text.replace(/[^A-Za-z0-9_]/g, "") != text || (text.length < 1 || text.length > 20)) {
					showPopUp("Invalid URL", "Your URL has to be 1-20 letters long and can't have symbols.", [
						[
							"Close",
							"grey",
							null
						]
					]);
				} else {
					const [code, request] = await sendRequest("POST", "me/settings", {
						update: "profileurl",
						value: text
					});
					if (code == 200) {
						showPopUp("Custom URL Saved", `Your custom url has been saved! Go check it out: <br><b><a href="https://app.photop.live?user=${text}">app.photop.live?user=${text}</a></b>`, [
							[
								"Close",
								"var(--premiumColor)",
								null
							]
						]);

						findI("settingsNewUrl").placeholder = text;
						findI("settingsNewUrl").value = "";
					} else {
						showPopUp("Oh no!", "There was an error saving your custom URL. Try again later.", [
							[
								"Close",
								"grey",
								null
							]
						]);
					}
				}
			});

			tempListen(findI("exotekManageButton"), "click", async function () {
				window.loginWindow = (await getModule("webmodal"))("https://exotek.co/account?userid=" + account.AccountID, "Manage Exotek Account");
			});
			/*
			tempListen(findI("exotekTransferButton"), "click", async function () {
				showPopUp("Begin Transfer", "First, login to your current Exotek account to begin the transfer process.", [
					["Sign In", "var(--themeColor)", async function () {
						window.loginWindow = (await getModule("webmodal"))("https://exotek.co/login?client_id=62f8fac716d8eb8d2f6562ef&redirect_uri=https%3A%2F%2F" + window.location.host + "&response_type=code&scope=userinfo&state=transferlogin", "Transfer Exotek Account (Current Account)");
					}],
					["Cancel", "var(--grayColor)"]
				]);
			});*/

			findI("affiliateUrlInput").value = `${window.location.origin}?affiliate=${account._id}`
			tempListen(findI("settingsCopyText"), "click", function () {
				copyClipboardText(document.getElementById("affiliateUrlInput").value);
			});
			findI("settingsAffiliateStatClicks").textContent = ((account.Affiliate || {}).Clicks || 0) + " Clicks";
			findI("settingsAffiliateStatSignUps").textContent = ((account.Affiliate || {}).SignUps || 0) + " Sign Ups";

			let inputBannerB = findI("imageInputBanner");
			tempListen(findC("settingsBannerHolder"), "click", function () {
				inputBannerB.click();
			});
			tempListen(inputBannerB, "change", async function (e) {
				let file = e.target.files[0];
				if (file != null && file.type.substring(0, 6) == "image/") {
					let premium = hasPremium();
					if (supportedImageTypes.includes(file.type.replace(/image\//g, "")) == true) {
						if (file.size < 5242881 || (file.size < 5242881 * 2 && premium)) { // 5 MB
							let sendFormData = new FormData();
							sendFormData.append("image", file);
							let uploadPopUp = showPopUp("Uploading Image", "Uploading your new banner...");
							let [code, response] = await sendRequest("POST", "me/new/banner", sendFormData, true);
							if (code == 200) {
								findC("settingsBanner").src = assetURL + "ProfileBanners/" + response;
							} else {
								showPopUp("An Error Occured", response, [
									["Okay", "var(--grayColor)"]
								]);
							}
							findI("backBlur" + uploadPopUp).remove();
						} else {
							// showPopUp("An Error Occured", "Your banner is too large. Please upload a smaller banner.", [["Okay", "var(--grayColor)"]]);
							if (file.size > 5242881 && !premium) {
								showPopUp("Too big!", `Your image must be under 5MB.${premiumPerk("Upload limits are doubled! Upload a ≤10MB image as your banner.")}`, [
									["Okay", "var(--grayColor)"]
								]);
							} else if (file.size > 5242881 * 2) {
								showPopUp("Too big!", "Your image file size must be under 10MB.", [
									["Okay", "var(--grayColor)"]
								]);
							}
						}
					} else {
						showPopUp("Invalid Image Type", `Photop only accepts images of the following types: <i style='color: #bbb'>${(supportedImageTypes.join(", "))}</i>${file.type.replace(/image\//g, "") == "gif" ? premiumPerk("Upload GIFs to use as your banner!") : ""}`, [
							["Okay", "var(--grayColor)"]
						]);
					}
				} else {
					showPopUp("Must be an Image", "Only image files can be uploaded as a banner.", [
						["Okay", "var(--grayColor)"]
					]);
				}
			});
			let inputProfileB = findI("imageInputProfile");
			tempListen(findC("settingsPfpHolder"), "click", function () {
				inputProfileB.click();
			});
			tempListen(inputProfileB, "change", async function (e) {
				let file = e.target.files[0];
				if (file != null && file.type.substring(0, 6) == "image/") {
					if (supportedImageTypes.includes(file.type.replace(/image\//g, "")) == true) {
						if (file.size < 2097153 || (hasPremium() && file.size < 2097153 * 2)) { // 2 MB or 4 MB for premium users.
							//alert("Woot woot it worked")
							let sendFormData = new FormData();
							sendFormData.append("image", file);
							let uploadPopUp = showPopUp("Uploading Image", "Uploading your new profile picture...");
							let [code, response] = await sendRequest("POST", "me/new/picture", sendFormData, true);
							if (code == 200) {
								findC("settingsPfp").src = assetURL + "ProfileImages/" + response;
							} else {
								showPopUp("An Error Occured", response, [
									["Okay", "var(--grayColor)"]
								]);
							}
							findI("backBlur" + uploadPopUp).remove();
						} else {
							// alert(`Some storage problem. Data: hasPremium(): ${hasPremium()}, File size: ${file.size}`);
							showPopUp("An Error Occured", "Your profile picture is too large. Please upload a smaller picture.", [
								["Okay", "var(--grayColor)"]
							]);
							if (file.size > 2097153 && !hasPremium()) {
								// alert("I think we have a problem")
                showPopUp("Too big!", `Your image must be under 2MB.${premiumPerk("Upload limits are doubled! Upload a ≤4MB image as your banner.")}`, [
							["Okay", "var(--grayColor)"]
						]);
							} else {
								if (file.size > 2097153 * 2 && hasPremium()) {
									showPopUp("Too big!", "Your image file size must be under 4MB.", [
										["Okay", "var(--grayColor)"]
									]);
								}
							}
						}
					} else {
						showPopUp("Invalid Image Type", `Photop only accepts images of the following types: <i style='color: #bbb'>${(supportedImageTypes.join(", "))}</i>${file.type.replace(/image\//g, "") == "gif" ? premiumPerk("Upload GIFs to use as your profile picture!") : ""}`, [
							["Okay", "var(--grayColor)"]
						]);
					}
				} else {
					showPopUp("Must be an Image", "Only image files can be uploaded to Photop.", [
						["Okay", "var(--grayColor)"]
					]);
				}
			});

			tempListen(findI("saveBasic"), "click", async function () {
				let newUsername = findI("settingsUsername").value;
				if (newUsername != account.User && newUsername != "") {
					if (verifyUsername(newUsername)) {
						let [code, response] = await sendRequest("PUT", "me/settings", {
							update: "username",
							value: newUsername
						});
						if (code == 200) {
							findI("settingsUsername").placeholder = newUsername;
							findI("settingsUsername").value = "";
							showPopUp("Username Saved", "Your new username has been saved successfully.", [
								["Okay", "var(--themeColor)"]
							]);
						} else if (code == 422) {
							showPopUp("Name Taken", "Sadly, that name is taken. Try another one!", [
								["Okay", "var(--themeColor)"]
							]);
						} else {
							showPopUp("An Error Occurred", response, [
								["Okay", "var(--themeColor)"]
							]);
						}
					} else {
						showPopUp("Invalid Username", "Usernames must be 3-20 characters, and can only include letters, numbers, underscores, and dashes.", [
							["Okay", "var(--themeColor)"]
						]);
					}
				}
			});
			let profileDesc = findI("profileDescription");
			async function updateDescFormat() {
				await sleep(1);
				let caretWas = getCurrentCursorPosition(profileDesc);
				let nodes = profileDesc.childNodes;
				for (let i = 0; i < nodes.length; i++) {
					if (nodes[i].nodeName == "DIV" || nodes[i].nodeName == "SPAN") {
						nodes[i].innerHTML = preFormat(nodes[i].innerText);
					} else if (nodes[i].nodeValue != null) {
						let newSpan = createElement("", "span", profileDesc);
						newSpan.innerHTML = preFormat(nodes[i].nodeValue);
						nodes[i].replaceWith(newSpan);
					} else {
						profileDesc.innerHTML = preFormat(nodes[i].innerHTML);
					}
				}
				if (profileDesc.innerHTML == "<br>") {
					profileDesc.innerHTML = "";
				}
				if (caretWas > -1) {
					setCurrentCursorPosition(profileDesc, caretWas);
				}
				profileDesc.focus();
			}
			tempListen(profileDesc, "input", function () {
				//updateDescFormat();
				accountHolder.querySelector(".settingsProfileDescriptionChar").textContent = profileDesc.textContent.length + `/${limit}`;
			});
			//updateDescFormat();
			accountHolder.querySelector(".settingsProfileDescriptionChar").textContent = profileDesc.textContent.length + `/${limit}`;
			tempListen(findI("saveDescription"), "click", async function () {
				let newDescription = findI("profileDescription").innerText;
				if (newDescription.length <= limit) {
					let [code] = await sendRequest("PUT", "me/settings", {
						update: "description",
						value: newDescription
					});
					if (code == 200) {
						showPopUp("Description Saved", "Your new description has been saved successfully.", [
							["Okay", "var(--themeColor)"]
						]);
					}
				} else {
					if (!premium) {
						showPopUp("Invalid Description", `Descriptions must be less than ${limit} characters long.${premiumPerk("Text limits are doubled! Use up to 600 characters in your description.")}`, [
							["Okay", "var(--grayColor)"]
						]);
					} else {
						showPopUp("Invalid Description", `Descriptions must be less than ${limit} characters long.`, [
							["Okay", "var(--themeColor)"]
						]);
					}
				}
			});

			async function openSocialOAuth(social) {
				let newWin = null;
				if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) == true) {
					newWin = window.open("https://exotek.co", "_blank");
				}
				let [code, response] = await sendRequest("GET", "me/new/social?site=" + social);
				if (code == 200) {
					if (newWin == null) {
            (await getModule("webmodal"))(response, "Connect Social Media Account", 500, 600);
          } else {
						newWin.location = response;
					}
				} else {
					showPopUp("An Error Occurred", response, [
						["Okay", "var(--themeColor)"]
					]);
				}
			}
			let allSocials = Object.keys(socialLinkData);
			for (let i = 0; i < allSocials.length; i++) {
				let socialButton = createElement("profileSocialButton", "a", findI("socialRow"), {
					"background": socialLinkData[allSocials[i]][1],
					"content": "url(./icons/socials/" + allSocials[i] + ".svg)"
				});
				socialButton.addEventListener("click", async function () {
					openSocialOAuth(allSocials[i]);
				});
			}
			let socialKeys = Object.keys(account.ProfileData.Socials || {});
			findI("connectionCount").textContent = socialKeys.length;
			for (let i = 0; i < socialKeys.length; i++) {
				let social = socialKeys[i];
				let value = account.ProfileData.Socials[socialKeys[i]];
				let keyInfo = social.split("_");
				let socialType = keyInfo[0];
				let socialInfo = socialLinkData[keyInfo[0]];
				let thisSocial = createElement("socialConnection", "div", findI("activeConnections"));
				thisSocial.innerHTML = `<a class="profileSocialButton" style="background: ${socialLinkData[socialType][1]}; content: url(./icons/socials/${socialType}.svg)"></a> <b></b> <span class="removeSocial" id="removeSocial${i}" tabindex="0">&times;</span>`;
				thisSocial.querySelector("b").textContent = value;
				let socialButton = thisSocial.querySelector(".profileSocialButton");
				socialButton.setAttribute("title", keyInfo[0] + " (" + value + ")");
				thisSocial.id = social;
				if (socialInfo[2] != "PROMPT_USERNAME") {
					socialButton.setAttribute("href", socialInfo[2].replace(/USERID_GOES_HERE/g, keyInfo.splice(1).join("_")).replace(/USERNAME_GOES_HERE/g, value));
					socialButton.setAttribute("target", "_blank");
				} else {
					socialButton.setAttribute("onmouseup", 'showPopUp("' + socialInfo[0] + '", "<i>' + cleanString(value) + '</i>", [ ["Done", "var(--grayColor)"] ])');
				}
				findI("removeSocial" + i).addEventListener("click", async function () {
					thisSocial.style.opacity = 0.5;
					let [code] = await sendRequest("DELETE", "me/remove/social?socialid=" + social);
					if (code == 200) {
						thisSocial.remove();
					} else {
						thisSocial.style.opacity = 1;
					}
				});
			}
			if (getParam("connect") != null) {
				let paramVal = getParam("connect");
				modifyParams("connect");
				showPopUp("Connect Account", "Click continue to connect your Photop account!", [
					["Continue", "var(--themeColor)", async function () {
						openSocialOAuth(paramVal);
					}],
					["Cancel", "var(--grayColor)"]
				]);
			}

			let visibility = findC("settingsVisibility");
			let visibilityFlavor = findI("settingsVisibilityFlavor");

			function setVisibility(visib) {
				visibility.textContent = visib;
				switch (visib) {
				case "Public":
					visibility.style.color = "var(--themeColor)";
					visibilityFlavor.innerText = "Anyone can view your profile.";
					break;
				case "Following":
					visibility.style.color = "#FFCB70";
					visibilityFlavor.innerText = "Only people you follow can view your profile.";
					break;
				case "Private":
					visibility.style.color = "#FF5C5C";
					visibilityFlavor.innerText = "No one can view your profile.";
				}
			}
			setVisibility(account.ProfileData.Visibility || "Public");
			async function setAndSaveVisibility(newVis) {
				if (newVis != account.ProfileData.Visibility || "Public") {
					let [code, response] = await sendRequest("PUT", "me/settings", {
						update: "visibility",
						value: newVis
					});
					if (code == 200) {
						setVisibility(newVis);
					} else {
						showPopUp("An Error Occurred", response, [
							["Okay", "var(--themeColor)"]
						]);
					}
				}
			}
			tempListen(visibility, "click", function () {
				showDropdown(visibility, "right", [
					["Public", "var(--themeColor)", function () {
						setAndSaveVisibility("Public");
					}],
					["Following", "#FFCB70", function () {
						setAndSaveVisibility("Following");
					}],
					["Private", "#FF5C5C", function () {
						setAndSaveVisibility("Private");
					}]
				]);
			});

			/* tempListen(findI("saveURL"), "click", async function() {
			  let url = findI("settingsNewUrl").value;
			  if (verifyUsername(url)) {
			    let [code, response] = await sendRequest("PUT", "me/settings", { update: "profileurl", value: url });
			    if (code == 200) {
			      showPopUp("Profile URL Updated", `<a href="https://app.photop.live/?user=${url}">https://app.photop.live/?user=${url}</a>`, [["Okay", "var(--premiumColor)"]]);
			    } else {
			      showPopUp("An Error Occurred", response, [["Okay", "var(--themeColor)"]]);
			    }
			  } else {
			    showPopUp("Invalid URL", "URLs must be 3-20 characters, and can only include letters, numbers, underscores, and dashes.", [["Okay", "var(--themeColor)"]]);
			  }
			  findI("settingsNewUrl").value = "";
			}); */
		},
		display: async function () {
			let displayHolder = createElement("settingsHolder-display", "div", "pageHolder");
			displayHolder.innerHTML = `<div class="settingsSection">
        <div class="settingsTitle">Theme</div>
        <div id="themeSelector"></div>
      </div>
      <div class="settingsSection">
        <div class="settingsTitle">Embeds</div>
        <div id="dispSelector"></div>
      </div>
      <div class="settingsSection">
        <div class="settingsTitle">Backdrop</div>
        <div id="backdropSelector"></div>
      </div>
      <div class="settingsSection">
        <a class="settingsLink" href="${window.location.origin}/#tos">Terms of Service</a>
        <a class="settingsLink" href="${window.location.origin}/#privacy">Privacy Policy</a>
        <a class="settingsLink" href="${window.location.origin}/#rules">Photop Rules</a>
        <a class="settingsLink" href="https://photop.live/?from=photopweb" target="_blank">About Photop</a>
        <a class="settingsLink" href="https://twitter.com/PhotopMedia" target="_blank">Photop Twitter</a>
        <a class="settingsLink" href="https://discord.com/invite/gnBVPbrAPd" target="_blank">Photop Discord</a>
        <div style="font-size: 16px; text-align: center;">©2022 Exotek LLC - All rights reserved</div>
      </div>`;
			for (var i in themes) {
				addThemeOption(i);
			}
			for (var i in dispOptions) {
				addDispOption(dispOptions[i]);
			}
      if (hasPremium()) {
        if (account.Settings != null && account.Settings.Backdrop != null) {
  				settingsBackdrop = `<img class="settingsBackdrop" src="${assetURL + "Backdrops/" + account.Settings.Backdrop}"><div class="settingsUploadButton upload2" id="backdropUpload"></div><div class="settingsUploadButton" id="backdropRemove"></div>`;
  			} else {
  				settingsBackdrop = `<img class="settingsBackdrop" style="opacity: 0;"><div class="settingsUploadButton" id="backdropUpload"></div><div class="settingsUploadButton" id="backdropRemove" hidden></div>`;
  			}
        findI("backdropSelector").innerHTML = `
          <input id="imageInputBackdrop" type="file" accept="image/*" multiple="true" hidden="true">
          <div class="settingsBackdropHolder">
            ${settingsBackdrop}
          </div>`;
        let inputBackdrop = findI("imageInputBackdrop");
  			tempListen(findI("backdropUpload"), "click", function () {
  				inputBackdrop.click();
  			});
  			tempListen(inputBackdrop, "change", async function (e) {
  				let file = e.target.files[0];
  				if (file != null && file.type.substring(0, 6) == "image/") {
  					let premium = hasPremium();
  					if (supportedImageTypes.includes(file.type.replace(/image\//g, "")) == true) {
  						if (file.size < 5242881) { // 5 MB
  							let sendFormData = new FormData();
  							sendFormData.append("image", file);
  							let uploadPopUp = showPopUp("Uploading Image", "Uploading your new backdrop...");
  							let [code, response] = await sendRequest("POST", "me/new/backdrop", sendFormData, true);
  							if (code == 200) {
  								updateBackdrop(response);
                  findI("backdropRemove").hidden = false;
                  findI("backdropUpload").classList.add("upload2");
                  findC("settingsBackdrop").src = assetURL + "Backdrops/" + response;
                  findC("settingsBackdrop").style.opacity = 1;
  							} else {
  								showPopUp("Error Uploading Backdrop", response, [
  									["Okay", "var(--grayColor)"]
  								]);
  							}
  							findI("backBlur" + uploadPopUp).remove();
  						} else {
                showPopUp("Too big!", "Your image file size must be under 5MB.", [
                  ["Okay", "var(--grayColor)"]
                ]);
  						}
  					} else {
  						showPopUp("Invalid Image Type", "Photop only accepts images of the following types: <i style='color: #bbb'>" + (supportedImageTypes.join(", ")) + "</i>", [
  							["Okay", "var(--grayColor)"]
  						]);
  					}
  				} else {
  					showPopUp("Must be an Image", "Only image files can be uploaded as a banner.", [
  						["Okay", "var(--grayColor)"]
  					]);
  				}
  			});
        if (findI("backdropRemove") != null) {
          tempListen(findI("backdropRemove"), "click", async function () {
            let [code, response] = await sendRequest("DELETE", "me/new/backdrop");
            if (code == 200) {
              findI("backdropRemove").hidden = true;
              findI("backdropUpload").classList.remove("upload2");
              findC("settingsBackdrop").style.opacity = 0;
              updateBackdrop();
            } else {
              showPopUp("Error Removing Backdrop", response, ["Okay", "var(--grayColor)"]);
            }
          });
        }
      } else {
        findI("backdropSelector").innerHTML = premiumPerk("Upload an image to use as a custom backdrop!");
      }
		},
		blocked: async function () {
			let blockedHolder = createElement("settingsHolder-blocked", "div", "pageHolder");
			let [code, response] = await sendRequest("GET", "me/blocked");
			if (code == 200) {
				let data = JSON.parse(response);
				if (data.length > 0) {
					for (let i = 0; i < data.length; i++) {
						let user = data[i];
						let blockedHTML = `
            <img class="blockedTilePic" type="user" src='` + decideProfilePic(user) + `'></img>
            <span class="blockedTileUser" type="user">${getRoleHTML(user)}${user.User}</span>
            <button class="previewBlockButton" userid="${user._id}">Unblock</button>
          `;
						let unblockTile = createElement("blockTile", "div", blockedHolder);
						unblockTile.innerHTML = blockedHTML;
						unblockTile.setAttribute("userid", user._id);
						unblockTile.setAttribute("time", user.Timestamp);

						tempListen(unblockTile.querySelector(".previewBlockButton"), "click", async function (event) {
							event.target.style.opacity = "0.5";
							let [code, response] = await sendRequest("PUT", "user/unblock?userid=" + event.target.getAttribute("userid"));
							if (code == 200) {
								event.target.closest(".blockTile").remove();
								if (blockedHolder.childElementCount < 1) {
									createTooltip(blockedHolder, "When you run into a meanie, they go here...");
								}
							} else {
								showPopUp("An Error Occurred", response, [
									["Okay", "var(--themeColor)"]
								]);
							}
						});
					}
				} else {
					createTooltip(blockedHolder, "When you run into a meanie, they go here...");
				}
			}
		},

		inventory: async function () {
			let inventoryHolder = createElement("settingsHolder-inventory", "div", "pageHolder");
			// send request to get the inventory. in the meanwhile this array will do.
			let giftsHolder = createElement("inventorySection", "div", inventoryHolder);
			let giftTitle = createElement("inventoryTitle", "div", giftsHolder);
			let giftNum = 0;
			if (giftNum > 0) {
				for (let i = 0; i < giftNum; i++) {
					let giftHolder = createElement("giftHolder", "div", giftsHolder);
					let giftHTML = `
          <div class="settingsInventoryPremiumGift">
            <div class = "">
              <svg style="position: relative; width: 20px; height: 20px; " id="DetailIcon" viewBox="0 0 512 512" fill="var(--themeColor)"><path fill-rule="evenodd" clip-rule="evenodd" d="M289.222 25.1645C278.758 -8.3882 233.196 -8.38812 222.732 25.1645L186.269 142.086C181.589 157.091 168.168 167.25 153.024 167.25H35.0229C1.16028 167.25 -12.919 212.395 14.4763 233.131L109.941 305.394C122.193 314.668 127.319 331.105 122.64 346.11L86.1754 463.032C75.7112 496.584 112.572 524.485 139.967 503.748L151.86 494.746C156.12 491.522 158.641 486.368 158.641 480.882V213.761C158.641 204.295 166.006 196.623 175.09 196.623H263.273C285.258 196.623 303.986 200.581 319.457 208.499C334.928 216.417 346.464 227.304 354.063 241.161C361.935 255.017 365.87 270.711 365.87 288.243C365.87 304.079 362.206 318.925 354.878 332.781C347.821 346.637 336.557 357.807 321.086 366.29C305.886 374.773 286.615 379.015 263.273 379.015H232.088C223.004 379.015 215.638 386.689 215.638 396.153V420.98C215.638 431.592 227.192 437.724 235.432 431.487C247.683 422.214 264.274 422.214 276.525 431.487L371.99 503.748C399.385 524.485 436.245 496.584 425.78 463.032L389.317 346.11C384.637 331.105 389.764 314.668 402.015 305.394L497.481 233.131C524.876 212.395 510.797 167.25 476.933 167.25H358.933C343.788 167.25 330.367 157.091 325.688 142.086L289.222 25.1645ZM295.843 320.056C288.244 327.408 276.573 331.084 260.83 331.084H232.088C223.004 331.084 215.638 323.41 215.638 313.946V262.116C215.638 252.652 223.004 244.978 232.088 244.978H260.83C291.772 244.978 307.243 259.4 307.243 288.243C307.243 301.816 303.443 312.421 295.843 320.056Z" fill="#FF42A7"></path></svg>
              <span class="giftTileName">From [Username]</span>
            </div>
            <button class = "settingsPremiumTaken">Claimed</button>  
          </div>
          `;
					giftHolder.innerHTML = giftHTML;
					giftTitle.innerHTML = `Gifts <b>${i+1}</b>`;
				}
			} else {
				giftTitle.innerHTML = `Gifts`;
				createTooltip(giftsHolder, "You don't have any gifts. Premium gifts you purchase or receive will appear here.");
			}
		}
	};

	function changeSettingsTab(type) {
		if (currentSettingsTab == type) {
			return;
		}
		let tabs = [...settingsTabs];
		currentSettingsTab = type;
		tabs.splice(tabs.indexOf(type), 1);
		for (let i in tabs) {
			findI("tab-" + tabs[i]).classList.remove("selected");
			if (findC("settingsHolder-" + tabs[i]) != null) {
				findC("settingsHolder-" + tabs[i]).remove();
			}
		}
		findI("tab-" + type).classList.add("selected");
		window.scrollTo({
			top: 0
		});
		tabRenders[type]();
	}

	for (let i = 0; i < settingsTabs.length; i++) {
		tempListen(findI("tab-" + settingsTabs[i]), "click", function () {
			changeSettingsTab(settingsTabs[i])
		});
	}
	changeSettingsTab("account");
};

function addThemeOption(index) {
  if (themes[index][0] == "/section") {
    let thisSection = createElement("settingsTitle", "div", findI("themeSelector"));
    thisSection.innerText = themes[index][1];
    return;
  }
  let thisThemeOption = createElement("themeOption", "div", findI("themeSelector"));
  thisThemeOption.style.background = themes[index][1];
  thisThemeOption.title = themes[index][0];
  if (account.Settings.Display.Theme == themes[index][0]) {
    thisThemeOption.classList.add("themeSelected");
  }
  thisThemeOption.addEventListener("click", async function () {
    let updatedSettings = account.Settings.Display;
    updatedSettings.Theme = themes[index][0];
    findC("themeSelected").classList.remove("themeSelected");
    thisThemeOption.classList.add("themeSelected");
    updateDisplay(themes[index][0]);
    let [code, response] = await sendRequest("POST", "me/settings", {
      update: "display",
      value: updatedSettings
    });
    if (code != 200) {
      showPopUp("Error Updating Theme", response, [
        ["Okay", "var(--grayColor)"]
      ]);
      updateDisplay(account.Settings.Display.Theme);
    }
  });
}

function addDispOption(name) {
	let thisDispOption = createElement("", "div", findI("dispSelector"));
	thisDispOption.innerHTML = `<input type="checkbox" name="theme" id="${name.replace(/\s/g, "")}"><label for="${name.replace(/\s/g, "")}" class="radioLabel">${name}</label>`;
	findI(name.replace(/\s/g, "")).checked = (account.Settings.Display[name]);
	findI(name.replace(/\s/g, "")).addEventListener("change", async function () {
		let updatedSettings = account.Settings.Display;
		updatedSettings[name] = findI(name.replace(/\s/g, "")).checked;
		let [code, response] = await sendRequest("POST", "me/settings", {
			update: "display",
			value: updatedSettings
		});
		if (code != 200) {
			showPopUp("An Error Occured", response, [
				["Okay", "var(--themeColor)"]
			]);
		}
	});
}
/*
let newWin = null;
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) == true) {
  newWin = window.open("https://exotek.co", "_blank");
}
let [ code, response ] = await sendRequest("GET", "me/new/social?site=" + site);
if (code == 200) {
  if (newWin == null) {
    let left = (screen.width/2)-(500/2);
    let top = (screen.height/2)-(600/2) - 100;
    window.open(response, "socai_link_authenticate", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=500, height=600, top=" + top + ", left=" + left);
  } else {
    newWin.location = Response;
  }
}
*/