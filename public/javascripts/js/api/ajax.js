/**
 * Created by KaSha on 2017. 4. 20..
 */

//모든 회사명/대표이름 으로 반환
getCompanyNameListAjax = function (callback) {
    $.ajax({
        type : "GET",
        url : "/company/nameList",
        success : function(data){
            callback(data);
        },
        error : function(request,status,error){
            alert("code:"+request.status+"\n"+"error:"+error+"\n"+"message:"+request.responseText);
        }
    });


};

//해당 지점에 대한 카테고리와 분향실 리스트 반환 (requestCID는 관리자만 요청할수 있음. 이외의 세션은 무시)
getRoomWithCategoryAjax = function (requestCID, uLevel) {
    var params = {
        "requestCID" : requestCID
    };

    $.ajax({
        type : "GET",
        url : "/room/roomList",
        dataType : "json",
        data : params,
        success : function(data){
            var json = data.data;
            var company = json.company;
            var key = json.key, keyID = json.keyID, categoryList = json.categoryList;
            var html = "";

            $("#cImageHidden").val(company[0].cImage);
            console.log(data);

            key.forEach(function (element, index) {
                html += "<div class='row hidden-mobile bundle' id='rowMenuDiv" + index + "'>" +
                    "<div class='col-xs-12 col-sm-6 col-md-6 col-lg-6'>" +
                    "<h1 class='categoryName page-title txt-color-blueDark' id='categoryName" + index + "' style='font-size: 20px; margin: 0 0 5px 0'>" +
                    element ;

                if(index==0){
                    if(element!="기본 카테고리"){
                        html += "<a href='#a' style='margin-left:15px'><i onclick='javascript:slideCategory($(\"#rowDiv" + index + "\"), this);' id='showButton" + index + "' class='fa fa-chevron-up'/></a>" +
                            ("<a href='#a' style='margin-left:10px'><i onclick='categoryNameChange(" + keyID[index] + ", " + index + ")' id='editCategory" + index + "' class='glyphicon glyphicon-wrench'/></a>" +
                            "<a href='#a' style='margin-left:10px'><i onclick='deleteCategory(" + keyID[index] + ", " + index + ")' id='deleteCategory" + index + "' class='fa fa-trash-o'/></a>");
                    }

                    html += ("</h1></div>" +
                        "<div class='col-xs-12 col-sm-6 col-md-6 col-lg-6 text-align-right'>" +
                    "<div class='page-title'>" +
                    "<a href='javascript:getCategoryName();' class='btn btn-default'>카테고리 추가</a>" +
                    "</div>" +
                    "</div>");
                }else{
                    html += "<a href='#a' style='margin-left:15px'><i onclick='javascript:slideCategory($(\"#rowDiv" + index + "\"), this);' id='showButton" + index + "' class='fa fa-chevron-up'/></a>" +
                        "<a href='#a' style='margin-left:10px'><i onclick='categoryNameChange(" + keyID[index] + ", " + index + ")' id='editCategory" + index + "' class='glyphicon glyphicon-wrench'/></a>" +
                        "<a href='#a' style='margin-left:10px'><i onclick='deleteCategory(" + keyID[index] + ", " + index + ")' id='deleteCategory" + index + "' class='fa fa-trash-o'/></a>" +
                        "</h1></div>";
                }
                html += "</div>";

                html += "<div class='row roomArea' id='rowDiv" + index + "' style='margin-bottom:20px'" +
                    " >" +
                    "<div class='superbox col-sm-12' rcID='" + keyID[index] + "' ondrop='dragDrop(event)' ondragenter='dragEnter(event)' ondragover='dragOver(event)'>";
                categoryList[element].forEach(function (element, index2) {
                    html += "<div class='superbox-list' id='superboxList" + index + "_" + index2 + "' draggable='true' ondragstart='dragStart(event)'>";
                    if(element.gName.length>0){
                        html += "<div id='box" + index + "_" + index2 + "' src='/upload/guest/" + element.gImage + "' data-img='/storage/room/" + element.gTemplate + "' gImage='" + "/upload/guest/" + element.gImage + "' class='superbox-img' " +
                            "uLevel='" + uLevel + "' "+ "title='" + element.rName + "' gEnableLogo='" + element.gEnableLogo + "' " +
                            "mName='" + element.mName + "' mac='" + element.mac + "' ip='" + element.IP + " / " + element.RIP + "' " +
                            "gID='" + element.gID + "' name='" + element.gName + "' gender='" + element.gSex + "' age='" + element.gAge + "' " +
                            "religion='/storage/religion/" + element.gReligion + "' religionPosition='" + element.gReligionPosition + "' " +
                            "ipgwan='" + element.ipgwan + "' barin='" + element.barin + "' jangji='" + element.jangji + "' " +
                            "sangju='" + element.gSangJu + "' rID='" + element.mID + "' rRelation='" + element.rRelation + "' rImageRelation='" + element.rImageRelation + "' " +
                            "diagnosis='" + element.diagnosis + "' first='" + element.first + "' calculate='" + element.calculate + "' " +
                            "funeralService='" + element.funeralService + "' baecha='" + element.baecha + "' gAllFont='" + element.gAllFont + "' " +
                            "style='background-color: white; text-align: center; padding: 40px 0 30px 0 '>" +
                            "<p>" + element.rName + "</p>" +
                            "<p>" + element.gName + "</p>" +
                            "<p id='rRelation'>" + (element.rRelation.length>0 ? "빈소 복제" : ((element.rImageRelation.length>0) ? "영정 사진 복제" : "&nbsp;")) + "</p>" +
                            "<p>" + (element.ipgwan.length>0 ? element.ipgwan.slice(0, -3) : "&nbsp;") + "</p>" +
                            "<p>" + (element.barin.length>0 ? element.barin.slice(0, -3) : "&nbsp;") + "</p>" +
                            "</div></div>";
                    }else {
                        html += "<div id='box" + index + "_" + index2 + "' src='stylesheets/img/blank_user.jpg' data-img='stylesheets/img/blank_frame.jpg' gImage='" + "/upload/guest/" + element.gImage + "' class='superbox-img'" +
                            "uLevel='" + uLevel + "' "+ "title='" + element.rName + "' gEnableLogo='' " +
                            "mName='" + element.mName + "' mac='" + element.mac + "' ip='" + element.IP + " / " + element.RIP + "' rRelation='' rImageRelation='' " +
                            "name='' gender='' age='' religion='' religionPosition='' ipgwan='' barin='' jangji='' sangju='' rID='" + element.mID + "' " +
                            "diagnosis='' first='' calculate='' funeralService='' baecha='' gAllFont=''" +
                            "style='background-color: white; text-align: center; padding: 40px 0 30px 0 '>" +
                            "<p>" + element.rName + "</p>" +
                            "<p>&nbsp;</p>" +
                            "<p>&nbsp;</p>" +
                            "<p>&nbsp;</p>" +
                            "<p>&nbsp;</p>" +
                            "</div></div>";
                    }

                });
                html += "<div class='superbox-float'></div>" +
                    "</div>" +
                    "<div class='superbox-show' style='height:300px; display: none'></div>" +
                    "</div>";
            });

            $("#listDiv").empty();
            $("#listDiv").append(html).trigger("create");

            $('.superbox').SuperBox();
            $('.superbox-img').trigger("create");

            categoryListLength = key.length;

            $("#hiddenCID").val(requestCID);

            initSlidedCategory();
        },
        error : function(request,status,error){
            alert("code:"+request.status+"\n"+"error:"+error+"\n"+"message:"+request.responseText);
        }
    });
};

getRoomNameListAjax = function (requestCID, rID, callback) {
    var params = {
        "requestCID" : requestCID
    };

    $.ajax({
        type : "GET",
        url : "/room/roomList",
        dataType : "json",
        data : params,
        success : function(data){
            callback(data, rID);
        },
        error : function(request,status,error){
            alert("code:"+request.status+"\n"+"error:"+error+"\n"+"message:"+request.responseText);
        }
    });
};

//카테고리 insert.
insertCategory = function (cID, rcName, categoryListLength) {
    var params = {"cID" : cID, "rcName" : rcName};
    const name = rcName;

    $.ajax({
        type : "POST",
        url : "/room/addCategory",
        dataType : "json",
        data : params,
        success : function(data){
            switch (data.responseStatus){
                case 200:
                    var insertID = data.data.insertId;
                    var html = "<div class='row hidden-mobile'>" +
                        "<div class='col-xs-12 col-sm-6 col-md-6 col-lg-6'>" +
                        "<h1 class='page-title txt-color-blueDark'>" +
                        name +
                        "<a href='#a' style='margin-left:15px'><i onclick='javascript:slideCategory($(\"#rowDiv" + categoryListLength + "\"), this);' id='showButton" + categoryListLength + "' class='fa fa-chevron-up'/></a>"
                        "</h1>" +
                        "</div>" +
                        "</div>" +
                        "<div class='row roomArea' id='rowDiv' ondragenter='return dragEnter(event)' ondrop='return dragDrop(event)' ondragover='return dragOver(event)'>" +
                        "<div class='superbox col-sm-12' rcID='" + insertID + "'> </div>" +
                        "<div class='superbox-float'></div>" +
                        "</div>";

                    $("#inputCategoryDiv").remove();

                    $("#listDiv").append(html).trigger("create");

                    categoryListLength++;

                    smallNotification("Success", "카테고리가 생성되었습니다.",2);
                    break;
                case 405:
                    smallNotification("Error", "필요한 파라미터가 전달되지 않았습니다.",0);
                    break;
                case 406:
                    smallNotification("실패!", "이미 사용중인 카테고리 명입니다.", 0);
                    break;
                default:
                    smallNotification("Error", "에러!!",0);
                    break;
            }
        },
        error : function(request,status,error){
            alert("code:"+request.status+"\n"+"error:"+error+"\n"+"message:"+request.responseText);
        }
    });
};

//카테고리명 변경
change_rcName = function (rcID, value, index) {
    var params = {"rcID" : rcID, "rcName" : value};

    $.ajax({
        type : "PUT",
        url : "/room/change-rcName",
        dataType : "json",
        data : params,
        success : function(data){
            var json = data.data;

            switch(data.responseStatus){
                case 200:
                    if(json.affectedRows>0){
                        smallNotification("Success", "카테고리 명이 변경되었습니다.", 1);
                        document.getElementById("categoryName" + index).firstChild.nodeValue = value;
                    }else{
                        smallNotification("Fail", "이름을 변경하는데 실패하였습니다.\n" + json, 0);
                    }
                    break;
                case 405:
                    smallNotification("Error", "필요한 파라미터가 전달되지 않았습니다.",0);
                    break;
                case 406:
                    smallNotification("실패!", "이미 사용중인 카테고리 명입니다.", 0);
                    break;
                default:
                    smallNotification("Error", "에러!!",0);
                    break;
            }
        },
        error : function(request,status,error){
            alert("code:"+request.status+"\n"+"error:"+error+"\n"+"message:"+request.responseText);
        }
    });
};

//카테고리 삭제
removeCategory = function (rcID, index) {
    var params = {"rcID" : rcID};

    $.ajax({
        type : "DELETE",
        url : "/room/deleteCategory",
        dataType : "json",
        data : params,
        success : function(data){
            var json = data.data;

            switch(data.responseStatus){
                case 200:
                    if(json.affectedRows>0){
                        smallNotification("Success", "카테고리가 삭제되었습니다.", 1);
                        document.getElementById("rowMenuDiv" + index).remove();
                        document.getElementById("rowDiv" + index).remove();
                    }else{
                        smallNotification("Fail", "카테고리를 삭제하는데 실패하였습니다.\n" + json, 0);
                    }
                    break;
                case 405:
                    smallNotification("Error", "필요한 파라미터가 전달되지 않았습니다.",0);
                    break;
                default:
                    smallNotification("Error", "에러!!",0);
                    break;
            }
        },
        error : function(request,status,error){
            alert("code:"+request.status+"\n"+"error:"+error+"\n"+"message:"+request.responseText);
        }
    });
};

//분향실명 변경 (rID가 없을 경우 insert)
change_rName = function (ID, value, object) {
    var params = {"rID" : ID, "rName" : value};

    $.ajax({
        type : "PUT",
        url : "/room/change-rName",
        dataType : "json",
        data : params,
        success : function(data){
            var json = data.data;

            switch(data.responseStatus){
                case 200:
                    if(json.affectedRows>0){
                        smallNotification("Success", "분향실 명이 변경되었습니다.", 1);
                        object.text(value);
                        $(".superbox-list div[rID=" + ID + "]").find("p:first-child").text(value);
                    }else{
                        smallNotification("Fail", "이름을 변경하는데 실패하였습니다.\n" + json, 0);
                    }
                    break;
                case 405:
                    smallNotification("Error", "필요한 파라미터가 전달되지 않았습니다.",0);
                    break;
                case 406:
                    smallNotification("실패!", "이미 사용중인 분향실 명입니다.", 0);
                    break;
                default:
                    smallNotification("Error", "에러!!",0);
                    break;
            }
        },
        error : function(request,status,error){
            alert("code:"+request.status+"\n"+"error:"+error+"\n"+"message:"+request.responseText);
        }
    });
};

//종합관리명 변경 (rtID가 없을 경우 insert)
change_rtName = function (ID, value, object) {
    var params = {"rtID" : ID, "rtName" : value};

    $.ajax({
        type : "PUT",
        url : "/room/change-rtName",
        dataType : "json",
        data : params,
        success : function(data){
            var json = data.data;
            if(json.affectedRows>0){
                smallNotification("Success", "종합관리 명이 변경되었습니다.", 1);
                object.firstChild.nodeValue = value;
            }else{
                smallNotification("Fail", "이름을 변경하는데 실패하였습니다.\n" + json, 0);
            }
        },
        error : function(request,status,error){
            alert("code:"+request.status+"\n"+"error:"+error+"\n"+"message:"+request.responseText);
        }
    });
};

//종교 이미지 가져오기
getReligionImage = function (callback) {

    $.ajax({
        type : "GET",
        url : "/room/religion",
        success : function(data){
            var json = data.data;
            var christian = json.christian, catholic = json.catholic, guddhism = json.guddhism, etc = json.etc;
            var tabA = $("#tabs-a"), tabB = $("#tabs-b"), tabC = $("#tabs-c"), tabD = $("#tabs-d") ;

            if(data.responseStatus==200){
                var html = "";
                christian.forEach(function (element, index) {
                    html += '<label class="superbox-list" style="text-align: center">' +
                        '<input class="gReligion" name="gReligion" type="radio" value="' + element + '"/>' +
                        '<img class="superbox-img" src="/storage/religion/' + element + '">' +
                        '</label>';
                });
                tabA.append(html).trigger("create");

                html = "";
                catholic.forEach(function (element, index) {
                    html += '<label class="superbox-list" style="text-align: center">' +
                        '<input class="gReligion" name="gReligion" type="radio" value="' + element + '"/>' +
                        '<img class="superbox-img" src="/storage/religion/' + element + '">' +
                        '</label>';
                });
                tabB.append(html).trigger("create");

                html = "";
                guddhism.forEach(function (element, index) {
                    html += '<label class="superbox-list" style="text-align: center">' +
                        '<input class="gReligion" name="gReligion" type="radio" value="' + element + '"/>' +
                        '<img class="superbox-img" src="/storage/religion/' + element + '">' +
                        '</label>';
                });
                tabC.append(html).trigger("create");

                html = "";
                etc.forEach(function (element, index) {
                    html += '<label class="superbox-list" style="text-align: center">' +
                        '<input class="gReligion" name="gReligion" type="radio" value="' + element + '"/>' +
                        '<img class="superbox-img" src="/storage/religion/' + element + '">' +
                        '</label>';
                });
                tabD.append(html).trigger("change");

                callback();
            }else{
                smallNotification("Fail", "종교 이미지를 가져오는데 실패하였습니다.\n" + json, 0);
            }
        },
        error : function(request,status,error){
            alert("code:"+request.status+"\n"+"error:"+error+"\n"+"message:"+request.responseText);
        }
    });
};

//템플릿 리스트 가져오기
getGTemplates = function (callback) {
    $.ajax({
        type : "GET",
        url : "/room/templates",
        success : function(data){
            var json = data.data;
            var html = "";

            if(data.responseStatus==200){
                json.forEach(function (element, index) {
                    html += "<option value='" + element.fileName + "'>" + element.tName + "</option>";
                });

                $("#gTemplate").append(html);

                callback();
            }else{
                smallNotification("Fail", "템플릿 리스트를 가져오는데 실패하였습니다.\n" + json, 0);
            }
        },
        error : function(request,status,error){
            alert("code:"+request.status+"\n"+"error:"+error+"\n"+"message:"+request.responseText);
        }
    });
};

getRTTemplates = function (callback) {
    $.ajax({
        type : "GET",
        url : "/room/total/templates",
        success : function(data){
            var json = data.data;
            var html = "";

            if(data.responseStatus==200){
                html += "<option value='auto'>템플릿 자동타입</option>";
                json.forEach(function (element, index) {
                    html += "<option value='" + element.fileName + "'>" + element.tName + "</option>";
                });

                $("#rtTemplate").append(html);

                callback();
            }else{
                smallNotification("Fail", "템플릿 리스트를 가져오는데 실패하였습니다.\n" + json, 0);
            }
        },
        error : function(request,status,error){
            alert("code:"+request.status+"\n"+"error:"+error+"\n"+"message:"+request.responseText);
        }
    });
};

//guest 데이터 insert하기
insertGuest = function () {
    if($("#gImage").val()){
        new ImageCompressor($("#gImage").prop("files")[0], {
            maxWidth: 1024,
            maxHeight: 1024,
            quality: 0.6,
            mimeType: "image/jpeg",
            success : function(result) {
                var size = result.size || result.fileSize;
                var limit = 1024 * 1024 * 2;
                if( size > limit ) {
                    smallNotification("Fail", "사진을 압축하였음에도 사진용량이 너무 큽니다.", 0);
                    $(obj).val('');
                    return;
                }else{
                    $('#wizard').ajaxSubmit({
                        type : "POST",
                        dataType: "json",
                        beforeSubmit: function (data,form,option) {
                            for(var i=0; i<data.length; i++){
                                if(data[i].name === "gImage"){
                                    data.splice(i, 1);
                                }
                            }
                            data.push({name : "gImage", value : result, type : "file"});
                            return true;    //막기위해서는 return false를 잡아주면됨
                        },
                        success: function(response, status){
                            var json = response.data;
                            if(response.responseStatus==200 && json.length > 0){
                                window.location.href = "/room?cID=" + response.data[0].cID;
                            }else{
                                bigNotification("Fail!", "고인 정보를 등록하는데 실패하였습니다. \n" + json, 0);
                            }
                        },
                        error : function(request,status,error){
                            alert("code:"+request.status+"\n"+"error:"+error+"\n"+"message:"+request.responseText);
                        }
                    });
                }
            },
            error: function(e) {
                console.log(e)
                smallNotification("Fail", "사진을 업로드하는데 실패하였습니다.\n" + e.toString(), 0);
            }
        });
    }else {
        $('#wizard').ajaxSubmit({
            type: "POST",
            dataType: "json",
            beforeSubmit: function (data, form, option) {
                return true;    //막기위해서는 return false를 잡아주면됨
            },
            success: function (response, status) {
                var json = response.data;
                if (response.responseStatus == 200 && json.length > 0) {
                    window.location.href = "/room?cID=" + response.data[0].cID;
                } else {
                    bigNotification("Fail!", "고인 정보를 등록하는데 실패하였습니다. \n" + json, 0);
                }
            },
            error: function (request, status, error) {
                alert("code:" + request.status + "\n" + "error:" + error + "\n" + "message:" + request.responseText);
            }
        });
    }
};

//guest 데이터 update하기
updateGuest = function () {
    if($("#gImage").val()){
        new ImageCompressor($("#gImage").prop("files")[0], {
            maxWidth: 1024,
            maxHeight: 1024,
            quality: 0.6,
            mimeType: "image/jpeg",
            success : function(result) {
                var size = result.size || result.fileSize;
                var limit = 1024 * 1024 * 2;
                if( size > limit ) {
                    smallNotification("Fail", "사진을 압축하였음에도 사진용량이 너무 큽니다.", 0);
                    $(obj).val('');
                    return;
                }else{
                    $('#wizard').ajaxSubmit({
                        type: "PUT",
                        dataType: "json",
                        beforeSubmit: function (data,form,option) {
                            for(var i=0; i<data.length; i++){
                                if(data[i].name === "gImage"){
                                    data.splice(i, 1);
                                }
                            }
                            data.push({name : "gImage", value : result, type : "file"});
                            return true;    //막기위해서는 return false를 잡아주면됨
                        },
                        success: function (response, status) {
                            var json = response.data;
                            if (response.responseStatus == 200) {
                                window.location.href = "/room?cID=" + response.data[0].cID;
                            } else {
                                bigNotification("Fail!", "고인 정보를 수정하는데 실패하였습니다. \n" + json, 0);
                            }
                        },
                        error: function (request, status, error) {
                            alert("code:" + request.status + "\n" + "error:" + error + "\n" + "message:" + request.responseText);
                        }
                    });
                }
            },
            error: function(e) {
                console.log(e)
                smallNotification("Fail", "사진을 업로드하는데 실패하였습니다.\n" + e.toString(), 0);
            }
        });
    }else {
        $('#wizard').ajaxSubmit({
            type: "PUT",
            dataType: "json",
            beforeSubmit: function (data, form, option) {
                return true;    //막기위해서는 return false를 잡아주면됨
            },
            success: function (response, status) {
                var json = response.data;
                if (response.responseStatus == 200) {
                    window.location.href = "/room?cID=" + response.data[0].cID;
                } else {
                    bigNotification("Fail!", "고인 정보를 수정하는데 실패하였습니다. \n" + json, 0);
                }
            },
            error: function (request, status, error) {
                alert("code:" + request.status + "\n" + "error:" + error + "\n" + "message:" + request.responseText);
            }
        });
    }
};

//카테고리명 변경
changeRoomCategory = function (rID, rcID, target, superboxList) {
    var params = {
        "rID" : rID,
        "rcID" : rcID
    };

    $.ajax({
        type : "PUT",
        url : "/room/changeRoomCategory",
        dataType : "json",
        data : params,
        success : function(data){
            var json = data.data;

            if(data.responseStatus==200 && json.affectedRows > 0){
                target.appendChild(superboxList);
            }else{
                smallNotification("Fail", "분향실의 카테고리를 변경하는데 실패하였습니다.\n" + json, 0);
            }
        },
        error : function(request,status,error){
            alert("code:"+request.status+"\n"+"error:"+error+"\n"+"message:"+request.responseText);
        }
    });
};

//해당 지점에 대한 종합관리 리스트 반환 (requestCID는 관리자만 요청할수 있음. 이외의 세션은 무시)
getRoomTotalListAjax = function (requestCID, uLevel) {
    var params = {
        "requestCID" : requestCID
    };

    $.ajax({
        type : "GET",
        url : "/room/roomTotalList",
        dataType : "json",
        data : params,
        success : function(data){
            var json = data.data;
            var company = json.company;
            var key = json.key, list = json.list, autoKey = json.autoKey, autoList = json.autoList;
            var html = "";

            $("#cImageHidden").val(company[0].cImage);

            console.log(key);
            console.log(list);
            console.log(autoKey);
            console.log(autoList);

            if(key.length > 0 || autoKey.length > 0){
                var rootDiv = "<div class='col-sm-12'><div class='well padding-10' id='listDiv2'></div></div>";
                $("#listDiv").empty();
                $("#listDiv").append(rootDiv).trigger("create");
            }else{
                $("#listDiv").empty();
                return;
            }

            key.forEach(function (element, index) {
                if(list[element][0].rtTemplate === "auto" && list[element].length >= 0){
                    list[element][0].rtTemplate = getAutoTotalTemplate(list[element].length);
                }

                html += "<div class='row'><div class='col-md-6'>";
                    if(list[element][0].rtTemplate == null){
                        html += "<img src='/stylesheets/img/blank_frame.jpg' class='img-responsive' id='frame" + index + "'></img>";
                    }else{
                        html += "<iframe src='/storage/total/" + list[element][0].rtTemplate + "' class='img-responsive' id='frame" + index + "'></iframe>";
                    }
                html +="</div><div class='col-md-6 padding-left-0'><h2 class='margin-top-0 title'>" + list[element][0].rtName +
                    "<ul class='demo-btns' style='display:inline; margin-left:15px'><a onclick='rtNameChangeDialog(\"" + list[element][0].mID + "\", this.parentNode.parentNode)'" +
                    " class='rtName-edit'><span class='glyphicon glyphicon-wrench' style='font-size:17px'></span> </a> </ul><br/>";

                if(uLevel=="관리자") {
                    html += "<small class='fotnt-xs'><i>mac : " + list[element][0].mac + "&nbsp; ip : " + list[element][0].RIP + " / " + list[element][0].IP + "</i></small></h2>";
                }

                if(list[element][0].gName != undefined && list[element][0].gName.length > 0){
                    html += "<div class='accordion'> \
                                <div> \
                                    <h4>자세히 보기</h4> \
                                    <div class='padding-10'>";
                    list[element].forEach(function (element2, index2) {
                        html += "<p> <strong>분향실 : </strong>" + element2.rName + " &nbsp;&nbsp; \
                                    <strong>고인 : </strong>" + element2.gName + "<br>" +
                                    element2.gSangJuTotal.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;') + "<br></p>"
                    });
                    html += "</div> </div> </div>";
                }

                html += "<br><a class='btn btn-primary' href='/room/totalEdit/" + list[element][0].mID + "'> 수정하기 </a></div></div><hr>" ;
            });

            autoKey.forEach(function (element, index) {
                if(autoList[element].roomTotal.rtTemplate === "auto" && autoList[element].list.length >= 0){
                    autoList[element].roomTotal.rtTemplate = getAutoTotalTemplate(autoList[element].list.length);
                }

                html += "<div class='row'><div class='col-md-6'>";
                if(autoList[element]["roomTotal"].rtTemplate == null){
                    html += "<img src='/stylesheets/img/blank_frame.jpg' class='img-responsive' id='autoFrame" + index + "'></img>";
                }else{
                    html += "<iframe src='/storage/total/" + autoList[element]["roomTotal"].rtTemplate + "' class='img-responsive' id='autoFrame" + index + "'></iframe>";
                }
                html +="</div><div class='col-md-6 padding-left-0'><h2 class='margin-top-0 title'>" + autoList[element]["roomTotal"].rtName +
                    "<ul class='demo-btns' style='display:inline; margin-left:15px'><a onclick='rtNameChangeDialog(\"" + autoList[element]["roomTotal"].mID + "\", this.parentNode.parentNode)'" +
                    " class='rtName-edit'><span class='glyphicon glyphicon-wrench' style='font-size:17px'></span> </a> </ul> <i>자동 타입</i> <br/>";

                if(uLevel=="관리자") {
                    html += "<small class='fotnt-xs'><i>mac : " + autoList[element]["roomTotal"].mac + "&nbsp; ip : " + autoList[element]["roomTotal"].RIP + " / " + autoList[element]["roomTotal"].IP + "</i></small></h2>";
                }

                if(autoList[element].list.length > 0 && autoList[element].list[0].gName != undefined && autoList[element].list[0].gName.length > 0){
                    html += "<div class='accordion'> \
                                <div> \
                                    <h4>자세히 보기</h4> \
                                    <div class='padding-10'>";
                    autoList[element].list.forEach(function (element2, index2) {
                        html += "<p> <strong>분향실 : </strong>" + element2.rName + " &nbsp;&nbsp; \
                                    <strong>고인 : </strong>" + element2.gName + "<br>" +
                                    element2.gSangJuTotal.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;') + "<br></p>";
                    });
                    html += "</div> </div> </div>";
                }

                html += "<br><a class='btn btn-primary' href='/room/totalEdit/" + autoList[element]["roomTotal"].mID + "'> 수정하기 </a></div></div><hr>" ;
            });

            $("#listDiv2").empty();
            $("#listDiv2").append(html).trigger("create");

            //jquery accordion
            $(".accordion").accordion({
                autoHeight : false,
                heightStyle : "content",
                collapsible : true,
                animate : 300,
                active : false,
                icons: {
                    header: "fa fa-plus",    // custom icon class
                    activeHeader: "fa fa-minus" // custom icon class
                },
                header : "h4",
            });

            key.forEach(function (element, index) {
                var frame = $("#frame" + index);
                frame.css("width", "100%");
                var height = frame.width() * 9 / 16;
                frame.css("height", height + "px");
                frame.css("border", 0);
                frame.css("background", "white");
                frame.load(function () {
                    if(list[element].length>0) {
                        if (list[element][0].gName != undefined && list[element][0].gName.length > 0) {
                            $(this).get(0).contentWindow.addGuest(list[element], "/upload/guest/");
                        }

                        if (list[element][0].rtInfo != undefined  && list[element][0].rtInfo.length > 0) {
                            $(this).get(0).contentWindow.setInfoText(list[element][0].rtInfo);
                        }

                        if (list[element][0].rtEnableLogo == "1") {
                            $(this).get(0).contentWindow.setLogo("/upload/logo/" + $("#cImageHidden").val());
                        }

                        $(this).contents().find("*").css('font-family', list[element][0].rtAllFont);
                    }
                });

                resizePreview(frame);
            });

            autoKey.forEach(function (element, index) {
                var frame = $("#autoFrame" + index);
                frame.css("width", "100%");
                var height = frame.width() * 9 / 16;
                frame.css("height", height + "px");
                frame.css("border", 0);
                frame.css("background", "white");
                frame.load(function () {
                    if(autoList[element].list.length>0) {
                        if (autoList[element].list[0].gName != undefined && autoList[element].list[0].gName.length > 0) {
                            $(this).get(0).contentWindow.addGuest(autoList[element].list, "/upload/guest/");
                        }
                        if (autoList[element].roomTotal.rtInfo != undefined && autoList[element].roomTotal.rtInfo != null && autoList[element].roomTotal.rtInfo.length > 0) {
                            $(this).get(0).contentWindow.setInfoText(autoList[element].roomTotal.rtInfo);
                        }

                        if (autoList[element].roomTotal.rtEnableLogo == "1") {
                            $(this).get(0).contentWindow.setLogo("/upload/logo/" + $("#cImageHidden").val());
                        }

                        $(this).contents().find("*").css('font-family', autoList[element].roomTotal.rtAllFont);
                    }
                });

                resizePreview(frame);

            });
        },
        error : function(request,status,error){
            alert("code:"+request.status+"\n"+"error:"+error+"\n"+"message:"+request.responseText);
        }
    });
};

//종합관리 입력
insertTotalRoomList = function () {
    $('#wizard').ajaxSubmit({
        type : "POST",
        dataType: "json",
        beforeSubmit: function (data,form,option) {
            //validation체크
            //막기위해서는 return false를 잡아주면됨
            return true;
        },
        success: function(response, status){
            var json = response.data;
            if(response.responseStatus==200){
                window.location.href = "/room/total?cID=" + response.data[0].cID;
            }else{
                bigNotification("Fail!", "종합 안내를 등록하는데 실패하였습니다. \n" + json, 0);
            }
        },
        error : function(request,status,error){
            alert("code:"+request.status+"\n"+"error:"+error+"\n"+"message:"+request.responseText);
        }
    });
};

//입관 리스트 조회
getIpgwanList = function (cID, callback) {
    var params = {
        "cID" : cID
    };

    $.ajax({
        type : "GET",
        url : "/scheduler/ipgwanList",
        data : params,
        success : function(data){
            var json = data.data;
            console.log(json);

            switch(data.responseStatus){
                case 200:
                    var key = json.key, schedulerList = json.schedulerList, ipgwanList = json.ipgwanList, roomList = json.roomList;
                    var html = "<option value='' selected disabled>입관실 선택</option>";

                    ipgwanList.forEach(function (element, index) {
                        html += "<option value='" + element.mID + "'>" + element.mName + "</option>";
                    });

                    $("#ipgwanSelect").empty();
                    $("#ipgwanSelect").append(html);

                    $("#ipgwanSelect").change(function () {
                        var scheduler = schedulerList[this.value]==undefined ? [] : schedulerList[this.value];
                        var html2 = "";
                        var events = [];

                        roomList.forEach(function (element, index) {
                           if(scheduler.some(function (value) {return value.targetID==element.mID;})){
                               html2 += "<option value='" + element.mID + "' selected='selected' title='" + element.gName + "' description='" + element.rName + "' " +
                                   " start='" + element.ipgwan + "' end='" + element.barin + "'>" + element.rName + "</option>";

                               if(Date.parse(element.ipgwan) && Date.parse(element.barin)) {
                                   events.push({
                                       title: element.gName, description: element.rName, start: element.ipgwan,
                                       end: element.barin, className: ["event", "bg-color-blue"], icon: 'fa-clock-o'
                                   });
                               }
                           }else{
                               html2 += "<option value='" + element.mID + "' title='" + element.gName + "' description='" + element.rName + "' " +
                                   " start='" + element.ipgwan + "' end='" + element.barin + "'>" + element.rName + "</option>";
                           }
                        });

                        $("#dualListbox").empty();
                        $("#dualListbox").append(html2);
                        $("#dualListbox").bootstrapDualListbox('refresh', true);

                        $("#calendar").fullCalendar('removeEvents');
                        $("#calendar").fullCalendar("addEventSource", events);
                    });

                    if(callback != undefined) {
                        callback();
                    }
                    break;
                case 405:
                    smallNotification("Error", "필요한 파라미터가 전달되지 않았습니다.",0);
                    break;
                default:
                    bigNotification("Fail!", "데이터를 가져오는데 실패하였습니다. \n" + json, 0);
                    break;
            }

        },
        error : function(request,status,error){
            alert("code:"+request.status+"\n"+"error:"+error+"\n"+"message:"+request.responseText);
        }
    });
};

//입관 스케줄러 입력
insertIpgwanSchduler = function (mID, targetArray) {
    var params = {"mID" : mID, "targetArray" : targetArray};

    $.ajax({
        type : "POST",
        url : "/scheduler/insertIpgwanScheduler",
        dataType : "json",
        data : params,
        success : function(data){
            var json = data.data;

            getIpgwanList($("#companySelect").val(), function () {
                smallNotification("Success", "스케줄이 변경되었습니다.", 1);
            });
        },
        error : function(request,status,error){
            alert("code:"+request.status+"\n"+"error:"+error+"\n"+"message:"+request.responseText);
        }
    });
};

//라즈베리 리부팅
rebootRaspberry = function (mac) {
    var params = {"mac" : mac};

    $.ajax({
        type : "POST",
        url : "/machine/reboot",
        dataType : "json",
        data : params,
        success : function(data){
            if(data.responseStatus == 200){
                smallNotification("Success", "장비가 재시작 됩니다.", 1);
            }else{
                smallNotification("Fail", "장비가 서버에 연결되어있지 않습니다.", 0);
            }
        },
        error : function(request,status,error){
            alert("code:"+request.status+"\n"+"error:"+error+"\n"+"message:"+request.responseText);
        }
    });
};

//프로필 저장
saveProfile = function () {
    var form = $('#profile_form');
    form.ajaxSubmit({
        type : "PUT",
        dataType: "json",
        beforeSubmit: function (data,form,option) {
            var currentPwd = $("#currentPwd").val(), newPwd = $("#newPwd").val(), newPwdConfirm = $("#newPwdConfirm").val();

            if (currentPwd.length > 0) {
                if (newPwd.length < 6) {
                    smallNotification("Fail", "비밀번호는 6글자 이상 입력해주세요", 0);
                    $("#profile_cancel").click();
                    $("#currentPwd").val("");
                    $("#newPwd").val("");
                    $("#newPwdConfirm").val("");
                    return false;
                } else if (newPwdConfirm !== newPwd) {
                    smallNotification("Fail", "변경 비밀번호 확인이 동일하지 않습니다", 0);
                    $("#profile_cancel").click();
                    $("#currentPwd").val("");
                    $("#newPwd").val("");
                    $("#newPwdConfirm").val("");
                    return false;
                }
            }
            //validation체크
            //막기위해서는 return false를 잡아주면됨
            return true;
        },
        success: function(response, status){
            var json = response.data;
            if(response.responseStatus===200){
                smallNotification("Success", "프로필이 수정되었습니다.", 1);
                $("#profile_cancel").click();
            } else if (response.responseStatus===204){
                smallNotification("Fail", "현재 비밀번호가 틀렸습니다.", 0);
                $("#profile_cancel").click();
            }else{
                bigNotification("Fail!", "프로필 수정에 실패하였습니다. \n" + json, 0);
            }
            $("#currentPwd").val("");
            $("#newPwd").val("");
            $("#newPwdConfirm").val("");
        },
        error : function(request,status,error){
            $("#currentPwd").val("");
            $("#newPwd").val("");
            $("#newPwdConfirm").val("");
            alert("code:"+request.status+"\n"+"error:"+error+"\n"+"message:"+request.responseText);
        }
    });
};

//cID or mID로 회사 정보 가져오기. 콜백 전달.
getCompanyWithCallback = function (cID, mID, callback) {
    var params = {"cID" : cID, "mID" : mID};

    $.ajax({
        type : "GET",
        url : "/company/company",
        dataType : "json",
        data : params,
        success : function(data){
            callback(data);
        },
        error : function(request,status,error){
            alert("code:"+request.status+"\n"+"error:"+error+"\n"+"message:"+request.responseText);
        }
    });
};
 
//해당 지점에 대한 대기화면 데이터 반환 (requestCID는 관리자만 요청할수 있음. 이외의 세션은 무시)
getWaitingViewDataAjax = function (requestCID) {
    var params = {
        "requestCID" : requestCID
    };

    $.ajax({
        type : "GET",
        url : "/company/waitingViewData",
        dataType : "json",
        data : params,
        success : function(data){
            var json = data.data;
            var html = "<div class='row' style='text-align: center'>" +
                "<input class='waitingViewType' name='waitingViewType' id='type0' type='radio' value='0'/> <label for='type0'>대기화면 미사용</label> &nbsp;&nbsp;" +
            "<input class='waitingViewType' name='waitingViewType' id='type1' type='radio' value='1'/> <label for='type1'>사진 슬라이드</label> &nbsp;&nbsp;" +
            "<input class='waitingViewType' name='waitingViewType' id='type2' type='radio' value='2'/> <label for='type2'>동영상 재생</label>" +
            "</div>" +
            "<div id='slider' class='carousel slide'>" +
                "<div class='carousel-inner'>" +
            "<div class='item active'>" +
                "<div class='carousel-caption caption-right'>" +
                "<h2>대기화면 미사용</h2><br>" +
            "<p>대기화면이 검은색화면으로 표시됩니다.</p> <br>" +
            "<a href='javascript:void(0);' onclick='disableWaitingView(\"" + requestCID + "\")' class='btn btn-info btn-sm'>저장</a>" +
                "</div>" +
                "</div>" +
            "<div class='item'>" +
                "<div class='carousel-caption caption-left'>" +
                "<h2>사진 슬라이드</h2><br>" +
            "<div role='content'>" +
                "<div class='widget-body'>" +
                "<form action='/company/waitingView/image' class='dropzone' id='dropzone' enctype='multipart/form-data' method='post'>" +
                "<input type='hidden' name='cID' value='" + requestCID + "'/>" +
                "<div class='fallback'> <input name='dropzoneFile' type='file'/> </div>" +
            "</form> </div> </div> <br>" +
            "<a href='javascript:void(0);' onclick='submitDropzone(\"" + requestCID + "\")' class='btn btn-info btn-sm'>저장</a>" +
                "</div> </div>" +
            "<div class='item'>" +
                "<div class='carousel-caption'>" +
                "<h2>동영상 재생</h2>" +
            "<div class='row'>" +
                "<form id='videoForm' action='/company/waitingView/video'>" +
                "<input type='hidden' name='cID' value='" + requestCID + "'/>" +
                "<p class='help-block'>동영상 파일 선택 &nbsp;&nbsp;" +
                "<input type='file' class='btn btn-default' name='video' id='video' accept='video/*' onchange='fileAmountCheck(this, 50 * 1024 * 1024)' style='display:initial; margin:0 auto; display: inline'/></p>" +
                "</form>" +
                "</div> <br>" +
                "<video id='videoPreview' controls></video><br>" +
                "<a href='javascript:void(0);' onclick='updateWaitingViewVideo(this, \"" + requestCID + "\")' class='btn btn-info btn-sm'>저장</a>" +
                "</div> </div> </div> </div>" ;

            $("#contentDiv").empty();
            $("#contentDiv").append(html).trigger("create");

            initView();

            if(data.responseStatus==200 && json.length > 0){
                if(json[0].waitingViewEnable == 1){
                    $('input[type=radio][id=type1]').prop("checked", true);
                    $("#type1").trigger("change");
                }else if(json[0].waitingViewEnable == 2){
                    $('input[type=radio][id=type2]').prop("checked", true);
                    $("#type2").trigger("change");
                }else{
                    $('input[type=radio][id=type0]').prop("checked", true);
                    $("#type0").trigger("change");
                }

                json.forEach(function (element, index) {
                    if(element.fileType==1) {
                        var dropzone = Dropzone.forElement("#dropzone");
                        var mockFile = {name: element.fileName, size : element.fileSize};
                        dropzone.options.addedfile.call(dropzone, mockFile);
                        dropzone.options.thumbnail.call(dropzone, mockFile, "/upload/waitingView/" + mockFile.name);
                    }
                });

                json.forEach(function (element, index) {
                    if(element.fileType==2){
                        $("#videoPreview").attr("src", "/upload/waitingView/" + element.fileName);
                    }
                });
            }else{
                $('input[type=radio][id=type0]').prop("checked", true);
                $("#type0").trigger("change");
            }
        },
        error : function(request,status,error){
            alert("code:"+request.status+"\n"+"error:"+error+"\n"+"message:"+request.responseText);
        }
    });
};

disableWaitingView = function (cID) {
    var params = {"cID" : cID};

    $.ajax({
        type : "PUT",
        url : "/company/waitingView/disable",
        dataType : "json",
        data : params,
        success : function(data){
            if(data.responseStatus == 200){
                smallNotification("Success", "대기화면이 미사용으로 전환되었습니다.", 1);
            }else{
                smallNotification("Fail", "업데이트를 하는데 실패하였습니다.", 0);
            }
        },
        error : function(request,status,error){
            alert("code:"+request.status+"\n"+"error:"+error+"\n"+"message:"+request.responseText);
        }
    });
};

chaneWaitingViewType = function (cID, waitingViewEnable) {
    var params = {"cID" : cID, "waitingViewEnable" : waitingViewEnable};

    $.ajax({
        type : "PUT",
        url : "/company/waitingView/changeType",
        dataType : "json",
        data : params,
        success : function(data){
            if(data.responseStatus == 200){
                smallNotification("Success", "대기화면의 타입이 변경되었습니다.", 1);
            }else{
                smallNotification("Fail", "업데이트를 하는데 실패하였습니다.", 0);
            }
        },
        error : function(request,status,error){
            alert("code:"+request.status+"\n"+"error:"+error+"\n"+"message:"+request.responseText);
        }
    });
};

deleteDropzoneList = function (array) {
    var params = {"deleteArray" : array};

    $.ajax({
        type : "DELETE",
        url : "/company/waitingView/deleteFiles",
        dataType : "json",
        data : params,
        success : function(data){
            if(data.responseStatus == 200){
                console.log("deleted file : " + data);
            }else{
                console.log("delete fail !! : " + data);
            }
        },
        error : function(request,status,error){
            if(error.length>0){
                alert("code:"+request.status+"\n"+"error:"+error+"\n"+"message:"+request.responseText);
            }
        }
    });
}

updateWaitingViewVideo = function (element, cID) {
    if($("#video").val().length == 0){
        if($("#videoPreview").attr("src").length > 0){
            chaneWaitingViewType(cID, 2);
        }else{
            bigNotification("Fail!", "동영상 파일을 등록해주세요.", 0);
        }
    }else{
        smallNotification("파일 전송", "파일이 전송됩니다.", 2);
        element.disabled = true;

        var form = $('#videoForm');
        form.ajaxSubmit({
            type : "POST",
            dataType: "json",
            beforeSubmit: function (data,form,option) {
                //validation체크
                //막기위해서는 return false를 잡아주면됨
                return true;
            },
            success: function(response, status){
                var json = response.data;
                if(response.responseStatus==200){
                    smallNotification("Success", "대기화면에 동영상이 등록되었습니다.", 1);
                    $("#videoPreview").attr("src", "/upload/waitingView/" + json.filename);
                }else{
                    bigNotification("Fail!", "대기화면 수정에 실패하였습니다. \n" + json, 0);
                }
                element.disabled = false;
            },
            error : function(request,status,error){
                alert("code:"+request.status+"\n"+"error:"+error+"\n"+"message:"+request.responseText);
                element.disabled = false;
            }
        });
    }
};

insertEmptyGuest = function (rID) {
    var params = {"rID" : rID};

    $.ajax({
        type : "POST",
        url : "/room/emptyGuest",
        dataType : "json",
        data : params,
        success : function(data){
            if(data.responseStatus == 200){
                location.reload();
                smallNotification("Success", "고인 정보가 종결되었습니다.", 1);
            }else{
                console.log("종결 실패 !! : " + data);
            }
        },
        error : function(request,status,error){
            alert("code:"+request.status+"\n"+"error:"+error+"\n"+"message:"+request.responseText);
        }
    });
};

updateReplicationRoom = function (rID, roomVal, copyVal) {
    var params = {"rID" : rID, "roomVal" : roomVal, "copyVal" : copyVal};

    $.ajax({
        type : "PUT",
        url : "/room/replicationRoom",
        dataType : "json",
        data : params,
        success : function(data){
            if(data.responseStatus == 200){
                location.reload();
                switch(copyVal){
                    case 0:
                        smallNotification("Success", "빈소가 복제되었습니다.", 1);
                        break;
                    case 1:
                        smallNotification("Success", "영정사진이 복제되었습니다.", 1);
                        break;
                    case 2:
                        smallNotification("Success", "데이터가 복제되었습니다.", 1);
                        break;
                }

            }else{
                console.log("빈소 복제 실패 !! : " + data);
            }
        },
        error : function(request,status,error){
            alert("code:"+request.status+"\n"+"error:"+error+"\n"+"message:"+request.responseText);
        }
    });
};

getExcelMonth = function (cID, startDate) {
    var params = {"cID" : cID, "startDate" : startDate };

    $.ajax({
        type : "GET",
        url : "/scheduler/excelMonth",
        data : params,
        success : function(data){
            window.location = '/scheduler/excelMonth';
            console.log(data);
        },
        error : function(request,status,error){
            alert("code:"+request.status+"\n"+"error:"+error+"\n"+"message:"+request.responseText);
        }
    });
};

moveUserTotal = function(pwd) {
    var params = {"pwd" : pwd};
    $.ajax({
        type : "POST",
        url : "/index/totalPwd",
        data : params,
        success : function(data){
            if(data.responseStatus === 200) {
                window.location = "/room/total";
            } else {
                errorBox("패스워드가 틀렸습니다.");
            }
            // console.log(data);
        },
        error : function(request,status,error){
            alert("code:"+request.status+"\n"+"error:"+error+"\n"+"message:"+request.responseText);
        }
    });
};


getSangjuyWithCallback = function (rID, callback) {
    var params = {"rID" : rID};

    $.ajax({
        type : "GET",
        url : "/sangju/sangju",
        dataType : "json",
        data : params,
        success : function(data){
            callback(data);
        },
        error : function(request,status,error){
            alert("code:"+request.status+"\n"+"error:"+error+"\n"+"message:"+request.responseText);
        }
    });
};