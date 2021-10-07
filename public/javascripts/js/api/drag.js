/**
 * Created by KaSha on 2017. 5. 9..
 */
function dragEnter(ev) {
    ev.preventDefault();
    console.log("enter");
    return true;
}
function dragOver(ev) {
    ev.preventDefault();

    console.log("over");
}
function dragDrop(ev) {
    console.log("drop");
    console.log(ev);
    var data = ev.dataTransfer.getData("text");
    var superboxList = document.getElementById(data);    //superboxList
    var box = superboxList.childNodes[0];

    var target = ev.target;
    if(!target.classList.contains("superbox")){
        target = target.parentNode;
        if(!target.classList.contains("superbox")){
            target = target.parentNode;
        }
    }

    var rID = box.getAttribute("rID");
    var rcID = target.getAttribute("rcID");

    if(rcID == undefined || rcID == null){
        return false;
    }

    changeRoomCategory(rID, rcID, target, superboxList);
    ev.stopPropagation();

    return false;
}

function dragStart(ev) {

    ev.dataTransfer.effectAllowed='move';
    ev.dataTransfer.setData("text", ev.target.id);
    //ev.dataTransfer.setDragImage(ev.target,100,100);
    return true;
}