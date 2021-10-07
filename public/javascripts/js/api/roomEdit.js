/**
 * Created by KaSha on 2017. 4. 26..
 */

$("#wizard #gName").on("input", function () {
    var frame = document.getElementById("previewDiv");
    var doc = frame.contentWindow || frame.contentDocument; //브라우저 호환을 위해
    doc.setName($(this).val());
});

$("#wizard #gAge").on("input", function () {
    var frame = document.getElementById("previewDiv");
    var doc = frame.contentWindow || frame.contentDocument; //브라우저 호환을 위해
    doc.setAge($(this).val());
});

$("#wizard #gSex").on("change", function () {
    var frame = document.getElementById("previewDiv");
    var doc = frame.contentWindow || frame.contentDocument; //브라우저 호환을 위해
    doc.setGender($(this).val());
});

$("#wizard #gReligionPosition").on("input", function () {
    var frame = document.getElementById("previewDiv");
    var doc = frame.contentWindow || frame.contentDocument; //브라우저 호환을 위해
    doc.setReligionPosition($(this).val());
});

$("#wizard #ipgwanDate").datepicker({
    dateFormat : 'yy-mm-dd',
    prevText : '<i class="fa fa-chevron-left"></i>',
    nextText : '<i class="fa fa-chevron-right"></i>',
    showMonthAfterYear : true,
    yearSuffix:'년',
    dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
    monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
    onSelect: function(dateText){
        var frame = document.getElementById("previewDiv");
        var doc = frame.contentWindow || frame.contentDocument; //브라우저 호환을 위해
        doc.setIpgwanDate(dateText);
    }
});


$("#wizard #ipgwanTime").clockpicker({
    placement: 'top',
    donetext: 'Done',
    autoclose: true,
    afterDone: function() {
        $("#wizard #ipgwanTime").trigger("input");
    }
});
$("#wizard #ipgwanTime").on("input", function () {
    var frame = document.getElementById("previewDiv");
    var doc = frame.contentWindow || frame.contentDocument; //브라우저 호환을 위해
    doc.setIpgwanTime($(this).val());
});


$("#wizard #barinDate").datepicker({
    dateFormat : 'yy-mm-dd',
    prevText : '<i class="fa fa-chevron-left"></i>',
    nextText : '<i class="fa fa-chevron-right"></i>',
    showMonthAfterYear : true,
    yearSuffix:'년',
    dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
    monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
    onSelect: function(dateText){
        var frame = document.getElementById("previewDiv");
        var doc = frame.contentWindow || frame.contentDocument; //브라우저 호환을 위해
        doc.setBarinDate(dateText);
    }
});

$("#wizard #barinTime").clockpicker({
    placement: 'top',
    donetext: 'Done',
    autoclose: true,
    afterDone: function() {
        $("#wizard #barinTime").trigger("input");
    }
});
$("#wizard #barinTime").on("input", function () {
    var frame = document.getElementById("previewDiv");
    var doc = frame.contentWindow || frame.contentDocument; //브라우저 호환을 위해
    doc.setBarinTime($(this).val());
});


$("#wizard #ddate").datepicker({
    dateFormat : 'yy-mm-dd',
    prevText : '<i class="fa fa-chevron-left"></i>',
    nextText : '<i class="fa fa-chevron-right"></i>',
    showMonthAfterYear : true,
    yearSuffix:'년',
    dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
    monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
    onSelect: function(dateText){
        /*
        var frame = document.getElementById("previewDiv");
        var doc = frame.contentWindow || frame.contentDocument; //브라우저 호환을 위해
        doc.setddate(dateText);
        */
    }
});

$("#wizard #dTime").clockpicker({
    placement: 'top',
    donetext: 'Done',
    autoclose: true,
    afterDone: function() {
        $("#wizard #dTime").trigger("input");
    }
});
$("#wizard #dTime").on("input", function () {
    /*
    var frame = document.getElementById("previewDiv");
    var doc = frame.contentWindow || frame.contentDocument; //브라우저 호환을 위해
    doc.setIpgwanTime($(this).val());
    */
});

$("#wizard #jangji").on("input", function () {
    var frame = document.getElementById("previewDiv");
    var doc = frame.contentWindow || frame.contentDocument; //브라우저 호환을 위해
    doc.setJangJi($(this).val().replace(/\n|\r\n|\r/g, '<br>'));
});

$("#wizard #jangji").keydown(function (event) {
    var rows = $(this).val().split('\n').length;
    var maxRows = 2;
    if( rows > maxRows || (event.which==13 && rows >=2) ){ //라인수가 2줄을 넘기거나, 2줄에서 엔터를 치거나
        smallNotification("Info", '장지는 2줄 까지만 입력 가능합니다', 2);
        var modifiedText = $(this).val().split("\n").slice(0, maxRows);
        $(this).val(modifiedText.join("\n"));
    }
});

$("#wizard #gSangJu").on("input", function () {
    var frame = document.getElementById("previewDiv");
    var doc = frame.contentWindow || frame.contentDocument; //브라우저 호환을 위해
    doc.setSangJu($(this).val().replace(/\n|\r\n|\r/g, '<br>'));

    if(!first) {
        var gSangJuTotal = document.getElementById("gSangJuTotal");
        gSangJuTotal.value = $(this).val();
    }

    first = false;
});

//파일을 통한 메인 이미지 변경
function imageChange(obj) {
    if( !checkImageType(obj) ){
        if( !$(obj).val() ) return;

        var file = obj.files[0];
        console.log(obj.files[0])

        var frame = document.getElementById('previewDiv');
        var content = frame.contentWindow || frame.contentDocument;
        var img = content.document.getElementById("mainImg");
        previewFromImageInput(obj, img);
        $('#gImageRemove').val('0');
    }
};

function musicChange(obj) {
    if( !checkMusicType(obj) ){
        fileAmountCheck(obj, 50 * 1024 * 1024);
        
        if( !$(obj).val() ) return;

        $('#gMusicRemove').val('0');
    }
}

//폰트 변경
$("#gAllFont").on("change", function () {
    var frame = document.getElementById("previewDiv");
    var doc = frame.contentWindow || frame.contentDocument; //브라우저 호환을 위해

    //doc.querySelectorAll('*').style.fontFamily = this.val();

    $("#previewDiv").contents().find('*').css('font-family', $(this).val());

});

//템플릿 변경
$("#gTemplate").on("change", function () {
    var previewDiv = $('#previewDiv');
    previewDiv.attr("src", "/storage/room/" + $(this).val());

    previewDiv.one("load", function () {
        previewDiv.trigger("resize");
    });
});

//종교 이미지
$(document).on("change", ".gReligion", function() {
    var frame = document.getElementById("previewDiv");
    var doc = frame.contentWindow || frame.contentDocument; //브라우저 호환을 위해
    doc.setReligion("/storage/religion/" + $(this).val());

    /*//파일 지우기
    if ($.browser.msie) { // ie 일때 input[type=file] init.
        $("#gImage").replaceWith( $("#gImage").clone(true) );
    } else { // other browser 일때 input[type=file] init.
        $("#gImage").val("");
    }*/
});

//로고 활성화 변경
$("#gEnableLogo").on("change", function (event) {
    var frame = document.getElementById("previewDiv");
    var doc = frame.contentWindow || frame.contentDocument; //브라우저 호환을 위해
    switch ($(this).val()){
        case "0" || 0:
            doc.setLogo("");
            break;

        case "1" || 1:
            doc.setLogo($(this).attr("logoPath"));
            break;
    }
});

//wizard 데이터 트리거 발생.
applyWizardData = function (rName) {
    $("#wizard #gName").trigger("input");
    $("#wizard #gReligionPosition").trigger("input");
    $("#wizard #ipgwanDate").trigger("onSelect");
    $("#wizard #ipgwanTime").trigger("input");
    $("#wizard #barinDate").trigger("onSelect");
    $("#wizard #barinTime").trigger("input");
    $("#wizard #ddate").trigger("onSelect");
    $("#wizard #dTime").trigger("input");
    $("#wizard #jangji").trigger("input");
    $("#wizard #gSangJu").trigger("input");
    $("#wizard #gAllFont").trigger("change");
    $("#wizard #gEnableLogo").trigger("change");
    $("#wizard #gSex").trigger("change");
    $("#wizard #gAge").trigger("input");
    var frame = document.getElementById("previewDiv");
    var doc = frame.contentWindow || frame.contentDocument; //브라우저 호환을 위해
    doc.setRoomName(rName);
};

function removeImage(){
    $('#gImageRemove').val('1');
    if ($.browser.msie) { // ie 일때 input[type=file] init.
        $("#gImage").replaceWith( $("#gImage").clone(true) );
    } else { // other browser 일때 input[type=file] init.
        $("#gImage").val("");
    }

    var frame = document.getElementById('previewDiv');
    var content = frame.contentWindow || frame.contentDocument;
    var img = content.document.getElementById("mainImg");
    img.src = "img/user.jpg";
}

function removeMusic(){
    $('#gMusicRemove').val('1');
    if ($.browser.msie) { // ie 일때 input[type=file] init.
        $("#gMusic").replaceWith( $("#gMusic").clone(true) );
    } else { // other browser 일때 input[type=file] init.
        $("#gMusic").val("");
    }
}