modules.webmodal = function (url, title, width, height) {
  width = width || 1000;
  height = height || 650;
  let newWindow = window.open(url, location.host + "_social_link_authenticate", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=" + width + ", height=" + height + ", top=" + ((screen.height / 2) - (height / 2) - 100) + ", left=" + ((screen.width / 2) - (width / 2)));
  if (!newWindow || newWindow.closed || typeof newWindow.closed == "undefined" || newWindow.outerHeight === 0) { 
    window.location = url;
  }
  return newWindow;
  
  /*
  let modalID = Math.floor(Math.random()*100000000);
  let modalHTML = `<div class="modalTitle exotek" id="modalTitle${modalID}">${title}<span id="closeExotek${modalID}" class="closeModal">&times;</span></div><div class="modalTextExotek" id="modalText${modalID}"><iframe src="${url}" class="exotekIFrame"></iframe></div>`;
  let backBlur = createElement("backBlur", "div", "body");
  backBlur.id = "exotekBlur";
  let newModal = createElement("modal", "div", backBlur);
  newModal.innerHTML = modalHTML;
  window.loginWindow = newModal.querySelector("iframe").contentWindow;
  newModal.classList.add("exotek");
  if (width != undefined) {
    newModal.style.width = width;
  }
  if (height != undefined) {
    newModal.style.height = height;
  }
  findI("closeExotek" + modalID).addEventListener("click", function () {
    backBlur.style.opacity = 0;
    newModal.style.transform = "scale(0.9)";
    setTimeout(function () {
      backBlur.remove();
    }, 200);
  });
  setTimeout(function () {
    backBlur.style.opacity = 1;
    newModal.style.transform = "scale(1)";
  }, 16);
  return modalID;
  */
}