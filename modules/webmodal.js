modules.webmodal = function (url, title, width, height) {
  width = width || 1000;
  height = height || 650;
  let a = typeof window.screenX != 'undefined' ? window.screenX : window.screenLeft;
  let i = typeof window.screenY != 'undefined' ? window.screenY : window.screenTop;
  let g = typeof window.outerWidth!='undefined' ? window.outerWidth : document.documentElement.clientWidth;
  let f = typeof window.outerHeight != 'undefined' ? window.outerHeight: (document.documentElement.clientHeight - 22);
  let h = (a < 0) ? window.screen.width + a : a;
  let newWindow = window.open(url, location.host + "_popup", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=" + width + ", height=" + height + ", top=" + parseInt(i + ((f - height) / 2.5), 10) + ", left=" + parseInt(h + ((g - width) / 2), 10));
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