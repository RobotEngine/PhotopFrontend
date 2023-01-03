wireframes.migrate = `
<div style="width:100%;height:100%;display:flex;flex-wrap:wrap;">
	<div id="transferContentHolder" style="max-width:335px;height:392px;margin:auto;background-color:var(--contentColor);filter:drop-shadow(0 0 5px var(--contentColor2));border-radius:15px;padding:8px;color:white;display:flex;flex-direction:column;color:var(--fontColor);transition:height .3s;align-items:center;">
 
		<div style="font-size: 40px; font-weight: bold;text-align:center;">Migrate</div>
	 
		<img src="../icons/moveaccount.png" style="width:90%;border-radius:5px;padding:12px 0 12px 0;">
		
		<div id="transferSignInDesc">Sign in with your Photop account to link it to your Exotek account.</div>

	<div id="infoAndTextHolder" style="margin-top:5px;margin-bottom:16px;z-index:0;">
		<div id="infoInputHolder" style="transition:all .2s;">
			<span class="settingsTitle" style="font-size:13px;">Username</span><input type="text" placeholder="Username" class="settingsInput" id="inputUsername" style="margin:1px 0 3px 0;">
			<span class="settingsTitle" style="font-size:13px;">Password</span><input type="password" placeholder="Password" class="settingsInput" id="inputPassword" style="margin-top:1px;">
		</div>
	</div>
	
		<div class="settingsSaveHolder" id="stepButtonHolder" style="z-index:1;"><button id="transferSignIn" class="signInButton settingsSave" title="Sign In to Photop account">Continue</button></div>
	</div>
</div>`;

//inputUsername | inputPassword
pages.migrate = function() {
  let migrateUserID;
  let migratePassword;
  
  tempListen(window, "message", async function(event) {
    if (event.data != "oauth_embed_integration" && event.origin === "https://exotek.co") {
      let parsedData = JSON.parse(event.data);
      if (parsedData.type == "oauth_finish") {
        if (parsedData.state == "migrate") {
          let [code, response] = await sendRequest("POST", "auth/migrate", {
            userid: migrateUserID,
            password: migratePassword,
            code: parsedData.code
          });
          if (code == 200) {
            showPopUp("Account Moved", "Your account has been moved. 🎉 You will now login with Exotek.", [["Okay", "var(--grayColor)", function() { setPage("home"); }]]);
          } else {
            showPopUp("Couldn't Move Account", response, [["Okay", "var(--grayColor)"]]);
          }
        }
      }
    }
  });
  
	let step = 0;
	tempListen(findI("transferSignIn"), "click", async function() {
		const infoHolder = findI("infoAndTextHolder");
		const descText = findI("transferSignInDesc");
		const signinBtn = findI("transferSignIn");
		switch (step) {
			case 0:
        migratePassword = findI("inputPassword").value;
				let [code, response] = await sendRequest("POST", "auth/migrate/checklogin", {
	        username: findI("inputUsername").value,
	        password: migratePassword
		    });
		    if (code == 200) {
					response = JSON.parse(response);

          migrateUserID = response._id;
          
					findI("infoInputHolder").style.display = "none";
					descText.style.display = "none";
					
					findI("transferContentHolder").style.height = "325px";
					
					infoHolder.style.marginBottom = "5px";
					
					descText.style.position = "absolute";
					findI("infoInputHolder").style.position = "absolute";
	
					let div = document.createElement("div");
					div.style = 'display:flex;flex-direction:column';
					div.innerHTML = `
						 <div style="display:flex;overflow-wrap:anywhere;margin:0px auto 0px auto;border:solid;border-radius:30px;border-color:var(--contentColor3);border-width:2px;padding:4px;">
							 <img src="${response.profilepic || "https://exotek.co/images/defaultimage.svg"}" style="width:30px;height:30px;border-radius:50%;border:solid;border-width:3px;object-fit:cover;border-color:var(--contentColor3)">
							<div style="margin:auto 6px auto 6px;font-weight:bold;">${response.user || 'DefaultUser'}</div>
						 </div>
						 <div style="margin-top:10px;text-align:center;">Now create or sign into your Exotek account that you wish to link.</div>
					`;
					infoHolder.appendChild(div);
					step = 1;
		    } else {
		        showPopUp("Couldn't Sign In", response, [["Okay", "var(--grayColor)"]]);
		    }
				break;
			case 1:
				window.loginWindow = (await getModule("webmodal"))("https://exotek.co/login?client_id=62f8fac716d8eb8d2f6562ef&redirect_uri=https%3A%2F%2F" + window.location.host + "&response_type=code&scope=userinfo&state=migrate#signup", "Migrate Photop Account");
				break;
		}
	});
}