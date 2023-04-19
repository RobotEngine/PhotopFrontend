 modules.gift = async function (giftid) {
  let [code, response] = await sendRequest("GET", `premium/gift/solve?code=${giftid}`);
  if(code == 200){
    includePremiumEmbedCode = giftid;
    processGiftLinks();
		response = JSON.parse(response);
		const premSolve = `
		<div id="claimPremiumPopup">
		  <span id="claimPremiumSolving" giftid="${giftid}">${response.solving ? `Quick! 
			  <span class="solvingTicker">
				  <span class="solvingCounter postStatNumber" realnum="${response.solving || 0}">${response.solving}</span>
			  </span> 
				<span class="usersIdentify">user${response.solving > 1 ? 's' : ''} ${response.solving > 1 ? 'are' : 'is'}</span> currently solving.` : "You must verify you're a human to claim this gift."}
			</span>
		</div>`
		const ownerPopup = `
		<div id="claimPremiumPopup">
		  <span id="claimPremiumSolving" giftid="${giftid}">
				<span class="solvingTicker">
				  <span class="solvingCounter postStatNumber" realnum="${response.solving || 0}">${(response.solving || 0) > 0 ? response.solving : ""}</span>
			  </span> 
				<span class="usersIdentify">${(response.solving || 0) == 0 ? "No other user is" : `user${response.solving > 1 ? 's' : ''} ${response.solving > 1 ? 'are' : 'is'}`}</span> currently solving.
			</span>

			<div style="margin-top:10px;font-weight:bold;text-align:center;width:100%;">You can't claim your own gift!</div>
		</div>
		`
		
		if (response.giftOwner != true) {
		  showPopUp('Claim Premium', premSolve, [
		 		["Cancel", "var(--grayColor)"]
		 	]);
		} else {
			showPopUp('Claim Premium', ownerPopup, [
		 		["Cancel", "var(--grayColor)"]
		 	]);
		}

		if (response.giftOwner != true) {
		 	await loadScript("https://hcaptcha.com/1/api.js");
			
		 	hcaptcha.render("claimPremiumPopup", {
		 		sitekey: "1f803f5f-2da5-4f83-b2c6-d9a8e00ba2d3",
		 		theme: "dark",
		 		callback: async function (captcha) {
		 			let [code1, response1] = await sendRequest('PUT', 'premium/gift/claim', {
		 				"code": giftid,
		 				"captcha": captcha
		 			});
		      document.querySelector('.modalButton').click();
		 			if (code1 == 200) {
		        includePremiumEmbedCode = null;
		 				const giftBg = createElement('giftAnimBackground', 'div', body);
		 				const giftContainer = createElement('giftAnimContainer', 'div', giftBg);
		 				const giftAnim = createElement('giftAnim', 'div', giftContainer);
		 				giftAnim.setAttribute("open", "false");
		 				const giftTop = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		 				giftTop.className.baseVal = "giftAnimTop";
		 				giftTop.setAttribute('width', "340");
		 				giftTop.setAttribute('height', "190");
		 				giftTop.setAttribute('viewBox', "0 0 340 190");
		 				giftTop.setAttribute('fill', "none");
		 				giftTop.innerHTML = `<path d="M163.753 85C51.446 85 69.1123 45.5638 91.9838 25.8457C161.387 -20.5676 168.748 45.943 163.753 85Z" stroke="#FF42A7" stroke-width="20"/><path d="M177.247 85C289.554 85 271.888 45.5638 249.016 25.8457C179.613 -20.5676 172.252 45.943 177.247 85Z" stroke="#FF42A7" stroke-width="20"/><path d="M0 140C0 112.386 22.3858 90 50 90H290C317.614 90 340 112.386 340 140V180C340 185.523 335.523 190 330 190H10C4.47716 190 0 185.523 0 180V140Z" fill="#FF42A7"/><rect x="133" y="90" width="75" height="100" fill="white"/><defs><linearGradient id="paint0_linear_3_19" x1="170" y1="190" x2="170" y2="233" gradientUnits="userSpaceOnUse"><stop stop-color="#1E1E1E" stop-opacity="0.2"/><stop offset="1" stop-color="#D9D9D9" stop-opacity="0"/></linearGradient></defs>`
		 				giftAnim.appendChild(giftTop);
		 				const giftBottom = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		 				giftBottom.setAttribute('width', "300");
		 				giftBottom.setAttribute('height', "175");
		 				giftBottom.setAttribute('viewBox', "0 0 300 175");
		 				giftBottom.setAttribute('fill', "none");
		 				giftBottom.innerHTML = `<path d="M300 125C300 152.614 277.614 175 250 175L50 175C22.3858 175 0 152.614 0 125V0L300 0V125Z" fill="#FF42A7"/><rect x="113" width="75" height="175" fill="white"/><rect width="300" height="43" fill="url(#paint0_linear_2_8)"/><defs><linearGradient id="paint0_linear_2_8" x1="150" y1="0" x2="150" y2="43" gradientUnits="userSpaceOnUse"><stop stop-color="#1E1E1E" stop-opacity="0.2"/><stop offset="1" stop-color="#D9D9D9" stop-opacity="0"/></linearGradient></defs>`
		 				giftAnim.appendChild(giftBottom);
		 				const giftLabel = createElement('giftAnimLabel', 'span', giftContainer);
		 				giftLabel.innerText = "Click, click, click!"
		
		 				let clicks = 0;
		 				let lastClick;
		 				const audio = [new Audio('Audio/GiftOpen_0.wav'), new Audio('Audio/GiftOpen_1.wav'), new Audio('Audio/GiftOpen_2.wav'), [new Audio('Audio/GiftOpen_3.wav'), new Audio('Audio/GiftOpening.mp3')]]
		 				tempListen(giftAnim, 'click', function () {
		 					if (clicks < audio.length) {
		 						if (Array.isArray(audio[clicks])) {
		 							for (let i = 0; i < audio[clicks].length; i++) {
		 								audio[clicks][i].play();
		 							}
		 						} else {
		 							audio[clicks].play();
		 						}
		 					}
		 					if (clicks < 5) {
		 						clicks++;
		 					}
		 					if (clicks == 4) {
		 						lastClick = new Date().getTime();
		 						const giftGem = document.createElement('img');
		 						giftGem.className = "giftAnimGem";
		 						giftGem.src = "icons/PremiumGem.png";
		 						giftAnim.prepend(giftGem);
		 						giftLabel.innerText = `${response.giftLength} Month${response.giftLength > 1 ? 's' : ''} of Premium!`;
		 						giftAnim.setAttribute("open", "true");
		 						giftTop.style.marginBottom = "200px";
		 						const giftShine = createElement('giftAnimShine', 'img', giftBg);
		 						giftShine.src = "Images/ClaimGiftShine.png";
		 					}
		 					if (clicks == 5 && new Date().getTime() - lastClick >= 2000) {
		 						giftTop.style.marginBottom = "0px";
		 						giftBg.classList.add('giftAnimBackgroundHide');
		 						setTimeout(function () {
		 							giftBg.remove();
		 						}, 1000);
		 					}
		 				});
		 			} else {
		        showPopUp("An Error Occurred", response1, [["Okay", "var(--grayColor)"]]);
		      }
		 		}
		 	}); 
		}
  } else if (code == 404) {
    showPopUp("Invalid Gift", "This gift has already been claimed or doesn't exist.", [["Cancel", "var(--grayColor)"]]);
  } else {
    showPopUp("An Error Occurred", response, [["Okay", "var(--grayColor)"]]);
  }
 }