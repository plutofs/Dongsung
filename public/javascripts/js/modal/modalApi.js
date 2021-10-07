/**
 * Created by KaSha on 2017. 4. 20..
 */
/* useage
modal({
    type: 'inverted', //Type of Modal Box (alert | confirm | prompt | success | warning | error | info | inverted | primary)
    title: 'Message', //Modal Title
    text: 'Text', //Modal HTML Content
    size: 'normal', //Modal Size (normal | large | small)
    buttons: [{
        text: 'OK', //Button Text
        val: 'ok', //Button Value
        eKey: true, //Enter Keypress
        addClass: 'btn-light-blue', //Button Classes (btn-large | btn-small | btn-green | btn-light-green | btn-purple | btn-orange | btn-pink | btn-turquoise | btn-blue | btn-light-blue | btn-light-red | btn-red | btn-yellow | btn-white | btn-black | btn-rounded | btn-circle | btn-square | btn-disabled)
        onClick: function(dialog) {
            console.log(dialog);
            alert('Look in console!');
            return true;
        }
    }, ],
    center: true, //Center Modal Box?
    autoclose: false, //Auto Close Modal Box?
    callback: null, //Callback Function after close Modal (ex: function(result){alert(result); return true;})
    onShow: function(r) {}, //After show Modal function
    closeClick: true, //Close Modal on click near the box
    closable: true, //If Modal is closable
    theme: 'atlant', //Modal Custom Theme (xenon | atlant | reseted)
    animate: false, //Slide animation
    background: 'rgba(0,0,0,0.35)', //Background Color, it can be null
    zIndex: 1050, //z-index
    buttonText: {
        ok: 'OK',
        yes: 'Yes',
        cancel: 'Cancel'
    },
    template: '<div class='modal-box'><div class='modal-inner'><div class='modal-title'><a class='modal-close-btn'></a></div><div class='modal-text'></div><div class='modal-buttons'></div></div></div>',
    _classes: {
        box: '.modal-box',
        boxInner: '.modal-inner',
        title: '.modal-title',
        content: '.modal-text',
        buttons: '.modal-buttons',
        closebtn: '.modal-close-btn'
    }
});
 */

function selectCompanyBox(callback){
    var txt = "추가할 사용자 계정의 회사를 선택하여주세요.";
    var template = "<div class='modal-box'><div class='modal-inner'><div class='modal-title'><a class='modal-close-btn'></a></div><div class='modal-text'></div>" +
        "<div class='smart-form'><fieldset><div class='row'><section class='col col-5'><label class='select'><select name='companySelect' id='companySelect'><option value='0' selected='' disabled=''>회사명</option> </select> <i></i> </label> </section></div></fieldset></div>" +
        "<div class='modal-buttons'></div></div></div>";

    modal({
        type: 'info',
        title: '회사명 선택',
        text: txt,
        template: template,
        callback: callback
    });

    getCompanyNameListAjax(function (data) {
        var html = "";

        $.each(data, function (index, item) {
            html += "<option value='" + item.cID + "'>" + item.companyName + "</option>";
        });

        $("#companySelect").append(html);
    });
}

function selectRoomBox(rID, callback){
    var txt = "복제할 빈소와 복제 타입을 선택해 주세요.";
    var template = "<div class='modal-box'><div class='modal-inner'><div class='modal-title'><a class='modal-close-btn'></a></div><div class='modal-text'></div><div class='smart-form'><fieldset>" +
        "<div class='row'><section class='col col-6'><label class='select'><select name='roomSelect' id='roomSelect'><option value='0' selected='' disabled=''>빈소명</option> </select> <i></i> </label> </section></div>" +
        "<div class='row'><section class='col col-6'><label class='select'><select name='copyType' id='copyType'><option value='0' selected>빈소 복제</option><option value='1'>영정사진 복제</option><option value='2'>데이터 복제</option> </select> <i></i> </label> </section></div>" +
        "</fieldset></div><div class='modal-buttons'></div></div></div>";

    modal({
        type: 'info',
        title: '복제 정보 선택',
        text: txt,
        template: template,
        callback: callback
    });

    getRoomNameListAjax($("#hiddenCID").val(), rID, function (data ,rID) {
        var json = data.data;
        var categoryList = json.categoryList;
        var html = "";

        for(key in categoryList){
            categoryList[key].forEach(function (element, index) {
                if(element.mID != rID && element.gName.length > 0 && element.rRelation.length <= 0){  //자기 자신 빈소가 아니고, 데이터는 있으면서 복제 타입은 아닌것.
                    html += "<option value='" + element.mID + "'>" + element.rName + " / " + element.gName + "</option>";
                }
            });
            console.log(categoryList[key]);
        }

        $("#roomSelect").empty();
        $("#roomSelect").append(html);
    });
}

function endRoomConfirm(callback){
    modal({
        type: 'confirm',
        title: '알림',
        text: "정말로 빈소를 종료하시겠습니까?\n종료한 빈소의 데이터는 복구 할수 없습니다.",
        callback: function(result) {
            if(result){
                callback();
            }
        }
    });
}

function alertBox(txt, callbackMethod, jsonData){
    modal({
        type: 'alert',
        title: '알림',
        text: txt,
        callback: function(result){
            if(callbackMethod){
                callbackMethod(jsonData);
            }
        }
    });
}

function alertBoxFocus(txt, obj){
    modal({
        type: 'alert',
        title: '알림',
        text: txt,
        callback: function(result){
            obj.focus();
        }
    });
}


function confirmBox(txt, callbackMethod, jsonData){
    modal({
        type: 'confirm',
        title: '알림',
        text: txt,
        callback: function(result) {
            if(result){
                callbackMethod(jsonData);
            }
        }
    });
}

function promptBox(txt, callbackMethod, jsonData){
    modal({
        type: 'prompt',
        title: 'Prompt',
        text: txt,
        callback: function(result) {
            if(result){
                callbackMethod(jsonData);
            }
        }
    });
}

function successBox(txt){
    modal({
        type: 'success',
        title: 'Success',
        text: txt
    });
}

function warningBox(txt){
    modal({
        type: 'warning',
        title: 'Warning',
        text: txt,
        center: false
    });
}

function infoBox(txt){
    modal({
        type: 'info',
        title: 'Info',
        text: txt,
        autoclose: true
    });
}

function errorBox(txt){
    modal({
        type: 'error',
        title: 'Error',
        text: txt
    });
}

function errorBoxCallback(txt, callback){
    modal({
        type: 'error',
        title: 'Error',
        text: txt,
        callback: callback
    });
}

function invertedBox(txt){
    modal({
        type: 'inverted',
        title: 'Inverted',
        text: txt
    });
}

function primaryBox(txt){
    modal({
        type: 'primary',
        title: 'Primary',
        text: txt
    });
}

/* Smart Alerts */
function rNameChangeDialog(ID, object) {
    const rID=ID;
    $.SmartMessageBox({
        title : "분향실명 변경",
        content : "분향실 이름을 입력해주세요.",
        buttons : "[완료][취소]",
        input : "text",
        placeholder : "분향실 이름"
    }, function(ButtonPress, value) {
        if(ButtonPress === "완료" && value.length>0) {
            change_rName(rID, value, object);
        }
    });
};

function rtNameChangeDialog(ID, object) {
    const rtID=ID;
    $.SmartMessageBox({
        title : "종합관리명 변경",
        content : "종합관리 이름을 입력해주세요.",
        buttons : "[완료][취소]",
        input : "text",
        placeholder : "종합관리 이름"
    }, function(ButtonPress, value) {
        if(ButtonPress === "완료" && value.length>0) {
            change_rtName(rtID, value, object);
        }
    });
};


function popupPwdUserTotal(){
    $.SmartMessageBox({
        title : "패스워드 입력",
        content : "종합 관리에 접근하기 위해 패스워드를 입력해주세요.",
        buttons : "[확인][취소]",
        input : "password",
        placeholder : "패스워드"
    }, function(ButtonPress, value) {
        if(ButtonPress === "확인" && value.length>0) {
            moveUserTotal(value);
        }
    });
}

/* Smart Notification */

function bigNotification(title, content, type) {
    var color, iconSmall;
    switch (type){
        case 2: color = "#5F895F"; iconSmall = "fa fa-check bounce animated"; break;
        case 1: color = "#296191"; iconSmall = "fa fa-bell swing animated"; break;
        case 0:
        default: color = "#C46A69"; iconSmall = "fa fa-warning shake animated"; break;
    }

    $.bigBox({
        title : title,
        content : content,
        color : color,
        timeout: 6000,
        icon : iconSmall,
        number : "1"
    });
};

function smallNotification(title, content, type) {
    var color, iconSmall;
    switch (type){
        case 2: color = "#5F895F"; iconSmall = "fa fa-check bounce animated"; break;
        case 1: color = "#296191"; iconSmall = "fa fa-thumbs-up bounce animated"; break;
        case 0:
        default: color = "#C46A69"; iconSmall = "fa fa-thumbs-down bounce animated"; break;
    }

    $.smallBox({
        title : title,
        content : content,
        color : color,
        iconSmall : iconSmall,
        timeout : 4000
    });
};

/*
 * SmartAlerts 이건 예제임.
 * 사용하는건 위에 따로 선언해서 사용하자.
 */
// With Callback
function callBackDialog(e) {
    $.SmartMessageBox({
        title : "Smart Alert!",
        content : "This is a confirmation box. Can be programmed for button callback",
        buttons : '[No][Yes]'
    }, function(ButtonPressed) {
        if (ButtonPressed === "Yes") {

            $.smallBox({
                title : "Callback function",
                content : "<i class='fa fa-clock-o'></i> <i>You pressed Yes...</i>",
                color : "#659265",
                iconSmall : "fa fa-check fa-2x fadeInRight animated",
                timeout : 4000
            });
        }
        if (ButtonPressed === "No") {
            $.smallBox({
                title : "Callback function",
                content : "<i class='fa fa-clock-o'></i> <i>You pressed No...</i>",
                color : "#C46A69",
                iconSmall : "fa fa-times fa-2x fadeInRight animated",
                timeout : 4000
            });
        }

    });
    e.preventDefault();
};

// With Buttons
function buttonDialog(e) {
    $.SmartMessageBox({
        title : "Smart Notification: Buttons",
        content : "Lots of buttons to go...",
        buttons : '[Need?][You][Do][Buttons][Many][How]'
    });

    e.preventDefault();
};
// With Select
function selectDialog(e) {
    $.SmartMessageBox({
        title : "Smart Alert: Select",
        content : "You can even create a group of options.",
        buttons : "[Done]",
        input : "select",
        options : "[Costa Rica][United States][Autralia][Spain]"
    }, function(ButtonPress, Value) {
        alert(ButtonPress + " " + Value);
    });

    e.preventDefault();
};

// With Input
function inputDialog(e) {
    $.SmartMessageBox({
        title : "Smart Alert: Input",
        content : "Please enter your user name",
        buttons : "[Accept]",
        input : "text",
        placeholder : "Enter your user name"
    }, function(ButtonPress, Value) {
        alert(ButtonPress + " " + Value);
    });

    e.preventDefault();
};

// With Login
function doubleDialog(e) {
    $.SmartMessageBox({
        title : "Login form",
        content : "Please enter your user name",
        buttons : "[Cancel][Accept]",
        input : "text",
        placeholder : "Enter your user name"
    }, function(ButtonPress, Value) {
        if (ButtonPress == "Cancel") {
            alert("Why did you cancel that? :(");
            return 0;
        }

        Value1 = Value.toUpperCase();
        ValueOriginal = Value;
        $.SmartMessageBox({
            title : "Hey! <strong>" + Value1 + ",</strong>",
            content : "And now please provide your password:",
            buttons : "[Login]",
            input : "password",
            placeholder : "Password"
        }, function(ButtonPress, Value) {
            alert("Username: " + ValueOriginal + " and your password is: " + Value);
        });
    });

    e.preventDefault();
};

/*
 * Smart Notifications 예
 */
$('#eg1').click(function(e) {

    $.bigBox({
        title : "Big Information box",
        content : "This message will dissapear in 6 seconds!",
        color : "#C46A69",
        //timeout: 6000,
        icon : "fa fa-warning shake animated",
        number : "1",
        timeout : 6000
    });

    e.preventDefault();

})

$('#eg2').click(function(e) {

    $.bigBox({
        title : "Big Information box",
        content : "Lorem ipsum dolor sit amet, test consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
        color : "#3276B1",
        //timeout: 8000,
        icon : "fa fa-bell swing animated",
        number : "2"
    });

    e.preventDefault();
})

$('#eg3').click(function(e) {

    $.bigBox({
        title : "Shield is up and running!",
        content : "Lorem ipsum dolor sit amet, test consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
        color : "#C79121",
        //timeout: 8000,
        icon : "fa fa-shield fadeInLeft animated",
        number : "3"
    });

    e.preventDefault();

})

$('#eg4').click(function(e) {

    $.bigBox({
        title : "Success Message Example",
        content : "Lorem ipsum dolor sit amet, test consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
        color : "#739E73",
        //timeout: 8000,
        icon : "fa fa-check",
        number : "4"
    }, function() {
        closedthis();
    });

    e.preventDefault();

})



$('#eg5').click(function() {

    $.smallBox({
        title : "Ding Dong!",
        content : "Someone's at the door...shall one get it sir? <p class='text-align-right'><a href='javascript:void(0);' class='btn btn-primary btn-sm'>Yes</a> <a href='javascript:void(0);' class='btn btn-danger btn-sm'>No</a></p>",
        color : "#296191",
        //timeout: 8000,
        icon : "fa fa-bell swing animated"
    });

});



$('#eg6').click(function() {

    $.smallBox({
        title : "Big Information box",
        content : "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
        color : "#5384AF",
        //timeout: 8000,
        icon : "fa fa-bell"
    });

})

$('#eg7').click(function() {

    $.smallBox({
        title : "James Simmons liked your comment",
        content : "<i class='fa fa-clock-o'></i> <i>2 seconds ago...</i>",
        color : "#296191",
        iconSmall : "fa fa-thumbs-up bounce animated",
        timeout : 4000
    });

})