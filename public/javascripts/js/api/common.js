/**
 * Created by KaSha on 2017. 4. 26..
 */

//input file에서 이미지가 맞는지 확인.
function checkImageType(obj) {
    var file_kind = obj.value.lastIndexOf('.');
    var file_name = obj.value.substring(file_kind+1,obj.length);
    var file_type = file_name.toLowerCase();

    var check_file_type = ['jpg','gif','png','jpeg','bmp'];

    if(obj.value && check_file_type.indexOf(file_type)==-1){
        smallNotification("경고!", "이미지 파일만 선택할 수 있습니다.", 0);
        var parent_Obj=obj.parentNode;
        var node=parent_Obj.replaceChild(obj.cloneNode(true),obj);

        if (navigator.userAgent.toLowerCase().indexOf("msie") != -1) {
            $("#" + obj.id).replaceWith( $("#" + obj.id).clone(true) );  // ie 일때 초기화
        } else {
            $("#" + obj.id).val("");
        }

        return false;
    }
}


function checkMusicType(obj) {
    var file_kind = obj.value.lastIndexOf('.');
    var file_name = obj.value.substring(file_kind+1,obj.length);
    var file_type = file_name.toLowerCase();

    var check_file_type = ['mp3'];

    if(obj.value && check_file_type.indexOf(file_type)==-1){
        smallNotification("경고!", "mp3 확장자 파일만 선택할 수 있습니다.", 0);
        var parent_Obj=obj.parentNode;
        var node=parent_Obj.replaceChild(obj.cloneNode(true),obj);

        if (navigator.userAgent.toLowerCase().indexOf("msie") != -1) {
            $("#" + obj.id).replaceWith( $("#" + obj.id).clone(true) );  // ie 일때 초기화
        } else {
            $("#" + obj.id).val("");
        }

        return false;
    }
}

function fileAmountCheck(obj, maxSize) {
    var fileSize = 0;
    var browser=navigator.appName;  // 브라우저 확인

    if (browser=="Microsoft Internet Explorer") {   // 익스플로러일 경우
        var oas = new ActiveXObject("Scripting.FileSystemObject");
        fileSize = oas.getFile(obj.value).size;
    } else {  // 익스플로러가 아닐경우
        fileSize = obj.files[0].size;
    }

    if(fileSize > maxSize) {
        smallNotification("경고!", "첨부 파일의 용량은 50MB 이하이어야 합니다.", 0);
        var parent_Obj=obj.parentNode;
        var node=parent_Obj.replaceChild(obj.cloneNode(true),obj);

        if (navigator.userAgent.toLowerCase().indexOf("msie") != -1) {
            $("#" + obj.id).replaceWith( $("#" + obj.id).clone(true) );  // ie 일때 초기화
        } else {
            $("#" + obj.id).val("");
        }
    }
}

//input file로부터 이미지를 받아서 previewObj에 미리 보여주기.
function previewFromImageInput(obj, previewObj){
    var files = obj.files[0];
    var reader = new FileReader();

    //파일정보 수집
    reader.onload = (function(theFile) {
        return function(e) {
            previewObj.src = e.target.result;
        };

    })(files);

    reader.readAsDataURL(files);
}

//preview의 width에 따라 height와 zoom rate 조절 (jquery로 previewDiv 파라미터 전달)
//previewDiv는 hide후에 호출할것. (zoom하기전에 크게 보이는 깜빡이 현상을 없애기 위해서)
function resizePreview(previewDiv){
    previewDiv.bind("resize", function () {
        var height  = previewDiv.width() * 9 / 16;
        //var rate = previewDiv.width() / 1920;
        previewDiv.css("height", height + "px");
        // previewDiv.ready(function () {
        //     previewDiv.contents().find("body").css("zoom", rate);
        // });
    });

    previewDiv.show();
}

function getCrossBrowserDate(date){
    return (date.replace(" ", "T") + "+09:00");
}

// 쿠키 생성
function setCookie(cName, cValue, cDay){
    var expire = new Date();
    expire.setDate(expire.getDate() + cDay);
    cookies = cName + '=' + escape(cValue) + '; path=/ '; // 한글 깨짐을 막기위해 escape(cValue)를 합니다.
    if(typeof cDay != 'undefined') cookies += ';expires=' + expire.toGMTString() + ';';
    document.cookie = cookies;
}

// 쿠키 가져오기
function getCookie(cName) {
    cName = cName + '=';
    var cookieData = document.cookie;
    var start = cookieData.indexOf(cName);
    var cValue = '';
    if(start != -1){
        start += cName.length;
        var end = cookieData.indexOf(';', start);
        if(end == -1)end = cookieData.length;
        cValue = cookieData.substring(start, end);
    }
    return unescape(cValue);
}

function isMobile() {
    var filter = "win16|win32|win64|mac|macintel";

    if(navigator.platform){
        if(0 > filter.indexOf(navigator.platform.toLowerCase())){
            return true;
        }else{
            return false;
        }
    }
    return false;
}