/**
 * Created by KaSha on 2017. 4. 25..
 */
var schemaModel = function() {
    var rootPath = require('path').resolve('');
    var RoomSchema = require(rootPath + '/schema/roomSchema');
    var RoomCategorySchema = require(rootPath + '/schema/roomCategorySchema');
    var RoomTotalSchema = require(rootPath + '/schema/roomTotalSchema');
    var RoomTotalListSchema = require(rootPath + '/schema/roomTotalListSchema');
    var MachineSchema = require(rootPath + '/schema/machineSchema');
    var GuestSchema = require(rootPath + '/schema/guestSchema');

    schemaModel.prototype.VIEW_NAME = 'viewRoom';
    schemaModel.prototype.VIEW_TOTAL_NAME = 'viewRoomTotal';
    schemaModel.prototype.VIEW_RECENT_GUEST_NAME = 'viewRecentGuest';

    schemaModel.prototype.PROCEDURE_NAME = 'raspViewRoom';

    schemaModel.prototype.roomSchema = new RoomSchema();
    schemaModel.prototype.roomCategorySchema = new RoomCategorySchema();
    schemaModel.prototype.roomTotalSchema = new RoomTotalSchema();
    schemaModel.prototype.roomTotalListSchema = new RoomTotalListSchema();
    schemaModel.prototype.machineSchema = new MachineSchema();
    schemaModel.prototype.guestSchema = new GuestSchema();
}

schemaModel.prototype = {

}

module.exports = schemaModel;
