/**
* list안에 있어야 하는 내용
* barin ipgwan rName gName gAge gSex jangji gSangJuTotal
*/

var gNameFontSize = 0, sangjuFontSize = 0, jangjiFontSize = 0;
var slideTime = 8000;

document.addEventListener("DOMContentLoaded", function() {
  var imageArray = document.getElementsByClassName('mainImg');
  for(var i = 0; i < imageArray.length; i++) {
    imageArray[i].addEventListener("load", function() {
      this.style.visibility = "visible";
    });
  }
});

function addGuest(list,imagePath){   //리스트로 추가
  var intervalID = undefined;

  gNameFontSize = window.getComputedStyle(document.getElementsByClassName("gNameContainer")[0]).fontSize === "0px" ?
    (document.getElementsByClassName("gNameContainer")[0]).currentStyle.fontSize : window.getComputedStyle(document.getElementsByClassName("gNameContainer")[0]).fontSize;
  sangjuFontSize = window.getComputedStyle(document.getElementsByClassName("sangjuContainer")[0]).fontSize === "0px" ?
    (document.getElementsByClassName("sangjuContainer")[0]).currentStyle.fontSize : window.getComputedStyle(document.getElementsByClassName("sangjuContainer")[0]).fontSize;
  jangjiFontSize = window.getComputedStyle(document.getElementsByClassName("jangjiContainer")[0]).fontSize === "0px" ?
  (document.getElementsByClassName("jangjiContainer")[0]).currentStyle.fontSize : window.getComputedStyle(document.getElementsByClassName("jangjiContainer")[0]).fontSize;

  if(list.length > MAX_CNT){
    var dataLoopCnt = Math.ceil(list.length / MAX_CNT);
    var splitList = [];
    var slideCnt = 0;

    for(var i = 0; i < dataLoopCnt; i ++){
      splitList.push(list.slice(i * MAX_CNT, (i+1) * MAX_CNT > list.length ? list.length : (i+1) * MAX_CNT));
    }
    setData(splitList[slideCnt], imagePath);  slideCnt++;
    if(intervalID != undefined){
        clearInterval(intervalID);
    }
    interval = setInterval(function(){
      setData(splitList[slideCnt], imagePath);
      slideCnt ++;
      slideCnt %= splitList.length;
    }, slideTime);
  }else{
    setData(list, imagePath);
  }
}

function setData(list, imagePath){
  clearData();  //데이터 비우기.
  list.forEach(function(element, index){
      if(currentCnt >= MAX_CNT){ return; } //템플릿에 넣을수 있는 갯수 초과하면 return

      try{
          element = JSON.parse(element);
      }catch(exception){

      }

      var sangjuTxt = changeSpaceUnicode(getSplitLines(element.gSangJuTotal, SANGJU_MAX_CNT));
      var txtArray = sangjuTxt.split('<br>');
      var lineCnt = 0;
      var hasColon = false;
      txtArray.forEach(function(element, index){
        if(!hasColon && element.indexOf(":") < 0){
          txtArray[index] = "<div class='sangJuOrderDiv'><span class='sangJuText'>" + element + "</span></div>";
        }else{
          if(element.indexOf(":")>0){
            txtArray[index] = "<div class='sangJuOrderDiv'><span class='sangJuOrder'>" + element.substring(0,element.indexOf(":")) +
            "<span class='colon'>:</span>&nbsp;</span><span class='sangJuText'>" + element.substring(element.indexOf(":") + 1) + "</span></div>";
            hasColon = true;
          }else{
            txtArray[index] = "<div class='sangJuOrderDiv'><span class='sangJuOrder'></span><span class='sangJuText'>" + element + "</span></div>";
          }
        }
        lineCnt ++;
      });
      sangjuTxt = txtArray.join("");

      var row = document.getElementsByClassName("row")[index];
      var mainImg = row.getElementsByClassName("mainImg")[0];
      var gArrow = row.getElementsByClassName("gArrow")[0];
      var col1 = row.getElementsByClassName("col1")[0], col2 = row.getElementsByClassName("col2")[0], col3 = row.getElementsByClassName("col3")[0], col4 = row.getElementsByClassName("col4")[0];
      var col5 = row.getElementsByClassName("col5")[0], col6 = row.getElementsByClassName("col6")[0], col7 = row.getElementsByClassName("col7")[0], col8 = row.getElementsByClassName("col8")[0];
      var col9 = row.getElementsByClassName("col9")[0];
      if (existElement(mainImg)){ if(checkTextAndPath(element.gImage, true)){ setMainImageSrc(mainImg, imagePath + element.gImage); }else{ setMainImageSrc(mainImg, "./img/user.jpg"); }}
      if (existElement(gArrow)){  setArrow(gArrow, element.gArrow); }
      if (existElement(col1)){  col1.innerHTML = element.rName; }
      if (existElement(col2)){  col2.innerHTML = element.gName; }
      if (existElement(col3)){  col3.innerHTML = sangjuTxt; }
      if (existElement(col4)){  col4.innerHTML = changeSpaceUnicode(getSplitLines(element.jangji, JANGJI_MAX_CNT)); }
      if (existElement(col5)){  col5.innerHTML = getFormattedDate(element.ipgwan); }
      if (existElement(col6)){  col6.innerHTML = getFormattedDate(element.barin); }
      if (existElement(col7)){  col7.innerHTML = element.gAge == "0" || element.gAge == 0 ? "" : element.gAge + "세";}
      if (existElement(col8)){  col8.innerHTML = setGender(element.gSex); }
      if (existElement(col9)){  col9.innerHTML = element.gReligionPosition; }

      var decos = row.getElementsByClassName("deco");
      if(existElement(decos)){
        for(var i=0; i<decos.length; i++){
          decos[i].style.display = "inline";
          decos[i].style.visibility = "visible";
        }
      }

      var parentheses = row.getElementsByClassName("parentheses");
      if(existElement(parentheses)){
        for(var i=0; i<parentheses.length; i++){
          if((existElement(col8) && col8.innerHTML.length > 0) || (existElement(col9) && col9.innerHTML.length > 0)){
            parentheses[i].style.display = "inline";
            parentheses[i].style.visibility = "visible";
          }
        }
      }

      if(SANGJU_MAX_CNT > 5){ col3.style.lineHeight = applyLineHeight(lineCnt); } //sangJu line-height

      var sangjuContainer = row.getElementsByClassName("sangjuContainer")[0], sangjuRoot = row.getElementsByClassName("sangjuRoot")[0];
      sangjuContainer.style.fontSize = sangjuFontSize;
      autoFontSize(sangjuContainer, sangjuRoot);

      var jangjiContainer = row.getElementsByClassName("jangjiContainer")[0], jangjiRoot = row.getElementsByClassName("jangjiRoot")[0];
      jangjiContainer.style.fontSize = jangjiFontSize;
      autoFontSize(jangjiContainer, jangjiRoot);

      var gNameContainer = row.getElementsByClassName("gNameContainer")[0], gNameRoot = row.getElementsByClassName("gNameRoot")[0];
      gNameContainer.style.fontSize = gNameFontSize;
      autoFontSize(gNameContainer, gNameRoot);

      /** sangJuOrder 길이 */
      var largestWidth = 0;
      var sangJuOrder = row.getElementsByClassName("sangJuOrder");
      if(sangJuOrder.length>0){
        for(var k=0; k<sangJuOrder.length; k++){
          if(largestWidth < sangJuOrder[k].offsetWidth){
            largestWidth = sangJuOrder[k].offsetWidth;
          }
        }
        for(var k=0; k<sangJuOrder.length; k++){
          sangJuOrder[k].style.width = (largestWidth + 1) + "px";
        }
      }
      /** sangJuOrder 길이 */
      //상주오더때문에 글자 크기 체크 한번더 해야함.
      autoFontSize(sangjuContainer, sangjuRoot);

      currentCnt ++;
    });
}

function setInfoText(txt){  //info setting
  var element = document.getElementById("infoText");
  if (existElement(element) && checkTextAndPath(txt, false)){
    element.innerText = txt;
  }else{
    return;
  }
  if(element.offsetWidth < element.scrollWidth){  //슬라이드
    element.style.textAlign = "initial";
    var style = document.createElement('style');
    style.type = 'text/css';
    var keyFrames = '\
      @-webkit-keyframes marquee {\
        0% { left: ' + element.scrollWidth + 'px; }\
        100% { left: -' + element.scrollWidth + 'px; }\
      }\
      @-moz-keyframes marquee {\
        0% { left: ' + element.scrollWidth + 'px; }\
        100% { left: -' + element.scrollWidth + 'px; }\
      }\
      @-ms-keyframes marquee {\
        0% { left: ' + element.scrollWidth + 'px; }\
        100% { left: -' + element.scrollWidth + 'px; }\
      }\
      @-o-keyframes marquee {\
        0% { left: ' + element.scrollWidth + 'px; }\
        100% { left: -' + element.scrollWidth + 'px; }\
      }\
      @keyframes marquee {\
        0% { left: ' + element.scrollWidth + 'px; }\
        100% { left: -' + element.scrollWidth + 'px; }\
      }';
    style.innerHTML = keyFrames;
    document.getElementsByTagName('head')[0].appendChild(style);
    element.style.webkitAnimation = "marquee 25s linear infinite";
  }else{
    element.style.textAlign = "center";
  }
}

function setLogo(path){ //로고 경로 할당
  var element = document.getElementById("logoImg");
  if(existElement(element) && checkTextAndPath(path, true)){
    element.src = path;
  }
}

function setAllFont(value) {  //폰트 세팅
  document.getElementById("body").style.fontFamily = value;
}

function clearData() {  //데이터 지우기.
    var elements = document.querySelectorAll(".col1, .col2, .col3, .col4, .col5, .col6, .col7, .col8, .col9");
    for(var i=0; i<elements.length; i++){
      if(existElement(elements[i])){
        elements[i].innerHTML = '';
      }
    }

    var imageElements = document.querySelectorAll(".mainImg");
    for(var i=0; i<imageElements.length; i++){
      if(existElement(imageElements[i])){
        // imageElements[i].src = '#'; //이미지를 굳이 지울 필요가 없을듯
        // imageElements[i].onerror = function(){  this.style.visibility = "hidden"; }
        imageElements[i].style.visibility = "hidden";
        imageElements[i].src = '#';
      }
    }

    var arrowElements = document.querySelectorAll(".gArrow");
    for(var i=0; i<arrowElements.length; i++){
      if(existElement(arrowElements[i])){
        arrowElements[i].src = '';
      }
    }

    var decos = document.querySelectorAll(".deco");
    if(existElement(decos)){
      for(var i=0; i<decos.length; i++){
          decos[i].style.visibility = "hidden";
      }
    }

    var parentheses = document.querySelectorAll(".parentheses");
    if(existElement(parentheses)){
      for(var i=0; i<parentheses.length; i++){
          parentheses[i].style.visibility = "hidden";
      }
    }

    currentCnt = 0;
}

function setCurrentDate(){  //현재 시간 세팅
  var element = document.getElementById("currentDate");
  var today = new Date();
  var year = today.getFullYear(), month = today.getMonth(), day = today.getDate(), hour = today.getHours(), minutes = ("0" + today.getMinutes()).slice(-2);
  var divideHour = hour > 12 ? "PM " + ("0" + (hour-12)).slice(-2) : "AM " + ("0" + hour).slice(-2);
  var currentDate = year + "년 " + (month + 1) + "월 " + day + "일 " + divideHour + "시 " + minutes + "분";

  element.innerText = currentDate;
}

/**
여기부터는 모듈화 함수들.
*/

function setMainImageSrc(object, path){
  if (object.src.replace(/\./gi, '').indexOf(path.replace(/\./gi, '')) >= 0) {
    object.style.visibility = "visible";
  } else {
    object.src = path;
  }
}

function setGender(gGender){  //성별
  if(gGender==1 || gGender=="1" || gGender=="남성" || gGender=="남"){
      return "남";
  }if(gGender==2 || gGender=="2" || gGender=="여성" || gGender=="여"){
      return "여";
  }if(gGender==3 || gGender=="3" || gGender=="男性" || gGender=="男"){
      return "男";
  }else if(gGender==4 || gGender=="4" || gGender=="女性" || gGender=="女"){
      return "女";
  }else{
    return "";
  }
}

function setArrow(element, gArrow){
  if(gArrow==0 || gArrow=="0"){
    element.src = '';
  }else if(gArrow==1 || gArrow=="1"){
    element.src = './img/arrow_top.jpg';
  }else if(gArrow==2 || gArrow=="2"){
    element.src = './img/arrow_right.jpg';
  }else if(gArrow==3 || gArrow=="3"){
    element.src = './img/arrow_bot.jpg';
  }else if(gArrow==4 || gArrow=="4"){
    element.src = './img/arrow_left.jpg';
  }
}

function existElement(element){ //element 존재 여부
  if(typeof(element) != 'undefined' && element != null){
    return true;
  }else{
    return false;
  }
}

/**
txt : 문자열 , isPath : boolean 타입
txt : 문자열이 존재하고, 길이가 0이상인지 판별.
isPath : 파라미터가 true이면서 첫번째 조건문에서 true를 만족하면 문자열 경로의 끝이 /로 끝나는지 체크.
*/
function checkTextAndPath(txt, isPath){
  if(txt != undefined && txt != null && txt.length>0){
    if(!isPath || (isPath && txt.substr(txt.length-1, txt.length)!="/")){
      return true;
    }
  }
  return false;
}

function changeSpaceUnicode(txt){ //스페이스를 유니코드로 치환.
  return txt.replace(/ /g, "\u00a0");
}

function getSplitLines(lines, lineCnt){ //여러 라인의 문자열을 받아서, lineCnt 갯수의 라인수가 넘으면 자르기.
  if(lines === undefined ||lines === null || lines.length <= 0){
    return "";
  }
  var replaceLines = lines.replace(/\n|\r\n|\r|\<br\/\>/g, '<br>');
  var splitLines = replaceLines.split('<br>');
  if(splitLines.length > lineCnt){
    return splitLines.slice(0, lineCnt).join("<br>");
  }else{
    return replaceLines;
  }
}
/**
element : 텍스트가 들어간 요소.
container : element를 감싸는 크기가 고정된 요소.
자동으로 폰트 사이즈 조절.
*/
function autoFontSize(container, root){
  var loopCnt = 0;
  while(true){
      if(container.offsetHeight<=root.offsetHeight || loopCnt > LOOP_MAX_CNT){   break;  }
      var font = window.getComputedStyle(container).fontSize;
      font = font.substr(0, font.length-2);
      container.style.fontSize = ((font*1) - 1) + "px" ;
      loopCnt ++;
  };
}

function getFormattedDate(txtDate){  //  형식에 맞게 생성된 날짜 반환.
  var result = "";
  var txtSplit = txtDate.split(/\-|:|\s/);
  var date = new Date(txtSplit[0],txtSplit[1] * 1 - 1,txtSplit[2],txtSplit[3],txtSplit[4]);
  var ary = txtDate.substring(11).split(":");
  if(!(isNaN(date) || isNaN(ary[0]) || isNaN(ary[1]))){  //date가 정확하지 않을때
    var month = date.getMonth()+1, date = date.getDate();
    result = (month<10 ? "0" + month : month) + "월 " + (date<10 ? "0" + date : date) + "일 ";
    var tmp1 = Number(ary[0]), tmp2 = Number(ary[1]);
    var hours = tmp1<10 ? "0" + tmp1 : tmp1, minutes = tmp2<10 ? "0" + tmp2 : tmp2;
    result +=  hours + "시 " + minutes + "분";
  }
  return result;
}

function applyLineHeight(line){ //1줄이면 250%, 10줄이상이면 130%로 반환.
  if(line>10){  return 130 + "%";}

  const X = -5, Y = 180;
  return (line * X + Y).toFixed(3) + "%";
}

/**
* list안에 있어야 하는 내용
* barin ipgwan rName   gName   jangji  gSangJuTotal gReligionPosition gSex gAge
*/
function test(){
  setInfoText("인포메이션이 나오는 곳 입니다!!인포메이션이 나오는 곳 입니다!!          인포메이션이 나오는 곳 입니다!!");
  var array = [];
  // var object1 = {ipgwan:'2017-10-12 07:15:00',barin:"2017-12-15 12:13:00", gName:"김길동123123123길동123123123123",gSex:"남",gAge:"22", gReligionPosition:"종교직위", rName:"104호 (2층)11", jangji:"서울대공원로비<br/>d<br/>dd<br/>dddd", gArrow:"1", gSangJuTotal:"하나:ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇdddddddㅇㅇㅇㅇㅇㅇ  셋<br/>넷:  <br>asdasasdadadasdasdasdagsdyasgdayusdgasuydgasuydgasyudasd    넷<br/>다섯:<br/>여섯:<br/>아홉:asdasdasdsakdgasdgasyudgauysdgasyugdauysdguaysgduaysgdausydgausydgasuydg<br/>열:<br/>"};
  var object1 = {ipgwan:'2017-10-09 07:15:00',barin:"2017-12-15 12:13:00", gName:"김길동1231123123",gSex:"남",gAge:"22", gReligionPosition:"종교직위", rName:"104호 (2층)11", jangji:"서울대공원로비", gArrow:"1", gSangJuTotal:"하나둘셋넷다섯여섯<br>하나둘셋넷다섯여섯<br>ㅋㅋㅋㅋ:ㅁㅁㄴㅇㅁㄴㅇㅁㄴㅇ<br>asdasdadasa<br>ㅋㅋ:ㅁㄴㅇㅁㄴㅇ","gImage":"path.jpg"};
  var object2 = {ipgwan:'2017-10-12 07:15:00',barin:"2017-12-15 12:13:00", gName:"김길동123123123길동123123123123",gSex:"남",gAge:"22", gReligionPosition:"종교직위", rName:"104호", jangji:"서울대공원로비<br/>d<br/>dd<br/>dddd", gArrow:"2", gSangJuTotal:"하나:ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ<br/>둘:    둘<br/>셋:   셋<br/>넷:      넷<br/>다섯:<br/>여섯:<br/>일곱:<br/>여덟:<br/>아홉:<br/>열:<br/>","gImage":"path.jpg"};
  var object3 = {ipgwan:'2017-10-12 07:15:00',barin:"2017-12-15 12:13:00", gName:"김길동123123123길동123123123123",gSex:"남",gAge:"22", gReligionPosition:"종교직위", rName:"104호", jangji:"서울대공원로비<br/>d<br/>dd<br/>dddd", gArrow:"3", gSangJuTotal:"하나:ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ<br/>둘:    둘<br/>셋:   셋<br/>넷:      넷<br/>다섯:<br/>여섯:<br/>일곱:<br/>여덟:<br/>아홉:<br/>열:<br/>","gImage":"path.jpg"};
  var object4 = {ipgwan:'2017-10-12 07:15:00',barin:"2017-12-15 12:13:00", gName:"김길동123123123길동123123123123",gSex:"남",gAge:"22", gReligionPosition:"종교직위", rName:"104호", jangji:"서울대공원로비<br/>d<br/>dd<br/>dddd", gArrow:"4", gSangJuTotal:"하나:ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ<br/>둘:    둘<br/>셋:   셋<br/>넷:      넷<br/>다섯:<br/>여섯:<br/>일곱:<br/>여덟:<br/>아홉:<br/>열:<br/>","gImage":"path.jpg"};
  var object5 = {ipgwan:'2017-10-12 07:15:00',barin:"2017-12-15 12:13:00", gName:"김길동123123123길동123123123123",gSex:"남",gAge:"22", gReligionPosition:"종교직위", rName:"104호", jangji:"서울대공원로비<br/>d<br/>dd<br/>dddd", gArrow:"0", gSangJuTotal:"하나:ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ<br/>둘:    둘<br/>셋:   셋<br/>넷:      넷<br/>다섯:<br/>여섯:<br/>일곱:<br/>여덟:<br/>아홉:<br/>열:<br/>"};
  var object6 = {ipgwan:'2017-10-12 07:15:00',barin:"2017-12-15 12:13:00", gName:"김길동123123123길동123123123123",gSex:"남",gAge:"22", gReligionPosition:"종교직위", rName:"104호", jangji:"서울대공원로비<br/>d<br/>dd<br/>dddd", gArrow:"3", gSangJuTotal:"하나:ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ<br/>둘:    둘<br/>셋:   셋<br/>넷:      넷<br/>다섯:<br/>여섯:<br/>일곱:<br/>여덟:<br/>아홉:<br/>열:<br/>"};
  array.push(object1);
  array.push(object2);
  array.push(object3);
  array.push(object4);
  array.push(object5);
  array.push(object6);
  addGuest(array, "");
}
