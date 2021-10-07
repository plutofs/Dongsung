function autoTotalTemplate(previewDiv, roomCnt){
    var template;

    if(roomCnt === "0" || roomCnt === "1" || roomCnt === 0 || roomCnt === 1){
        template = "/storage/total/total1-1.html";
    }else if(roomCnt === "2" || roomCnt === 2){
        template = "/storage/total/total1-2.html";
    }else if (roomCnt === "3" || roomCnt === "4" || roomCnt === 3 || roomCnt === 4){
        template = "/storage/total/total1-4.html";
    }else if (roomCnt === "5" || roomCnt === "6" || roomCnt === 5 || roomCnt === 6){
        template = "/storage/total/total1-6.html";
    }else{
        template = "/storage/total/total1-8.html";
    }

    if(previewDiv.attr("src") !== template) {
        previewDiv.attr("src", template);
    }
}

function getAutoTotalTemplate(roomCnt){
    var template;

    if(roomCnt === "0" || roomCnt === "1" || roomCnt === 0 || roomCnt === 1){
        template = "total1-1.html";
    }else if(roomCnt === "2" || roomCnt === 2){
        template = "total1-2.html";
    }else if (roomCnt === "3" || roomCnt === "4" || roomCnt === 3 || roomCnt === 4){
        template = "total1-4.html";
    }else if (roomCnt === "5" || roomCnt === "6" || roomCnt === 5 || roomCnt === 6){
        template = "total1-6.html";
    }else{
        template = "total1-8.html";
    }

    return template;
}