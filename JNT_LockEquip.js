/*:
-------------------------------------------------------------------------
@title Jonte Lock Equip
@author Jonatan Hjelte
@version 1.0
@date 2018-10-11
@filename JNT_LockEquip.js
@url -

-------------------------------------------------------------------------------
@help 

This plugin allows you to lock or unlock all equipment slots on a 
specific party member or entire party.

Plugin Commands:

LockPartyMemberEquip [PartyMemberId]
Example: LockPartyMemberEquip 0 (Will lock equipment for party member 1)

UnlockPartyMemberEquip [PartyMemberId]
Example: UnlockPartyMemberEquip 2 (Will unlock equipment for party member 3)

LockAllEquip (Locks equipment for ALL party members)
UnlockAllEquip (Unlocks equipment for ALL party members)
 */ 

var Jonte = Jonte || {};

//--------------------------------------
//----------------JONTE-----------------
//--------------------------------------

Jonte.lockPartyMemberEquip = function(memberId, locked){
    if (memberId < $gameParty.members().length){
        if (locked){
            $gameParty.members()[memberId].lockAllEquip();
        }
        else{
            $gameParty.members()[memberId].unlockAllEquip();
        }
    }
};

Jonte.lockAllEquip = function(locked){
    if (locked){
        for(let i in $gameParty.members()){
            $gameParty.members()[i].lockAllEquip();
        }
    }
    else{
        for(let i in $gameParty.members()){
            $gameParty.members()[i].unlockAllEquip();
        }
    }
}


//--------------------------------------
//----------GAME_INTERPRETER------------
//--------------------------------------

Jonte.lockEquipGameInterpreterPluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    Jonte.lockEquipGameInterpreterPluginCommand.call(this, command, args);

    if (command === "LockPartyMemberEquip"){
        Jonte.lockPartyMemberEquip(parseInt(args[0]), true);
    }
    else if (command === "UnlockPartyMemberEquip"){
        Jonte.lockPartyMemberEquip(parseInt(args[0]), false);
    }
    else if (command === "LockAllEquip"){
        Jonte.lockAllEquip(true);
    }
    else if (command === "UnlockAllEquip"){
        Jonte.lockAllEquip(false);
    }
};

//--------------------------------------
//----------GAME_BATTLERBASE------------
//--------------------------------------

Game_BattlerBase.prototype.lockAllEquip = function(){
    this._allEquipLocked = true;
};

Game_BattlerBase.prototype.unlockAllEquip = function(){
    this._allEquipLocked = false;
};

Jonte.lockEquipGameBattlerIsEquipTypeLocked = Game_BattlerBase.prototype.isEquipTypeLocked;
Game_BattlerBase.prototype.isEquipTypeLocked = function(etypeId) {
    if (this._allEquipLocked == null){
        return (Jonte.lockEquipGameBattlerIsEquipTypeLocked.call(this, etypeId));
    }
    else{
        return (this._allEquipLocked || 
            Jonte.lockEquipGameBattlerIsEquipTypeLocked.call(this, etypeId));
    }

};