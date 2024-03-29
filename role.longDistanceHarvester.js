module.exports = {
    run: function(creep) {
        if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true; 
        }
        
        if (creep.memory.working == true) {
            //already carry energy on body
            if (creep.room.name == creep.memory.home) {
                var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES,{
                    filter:(s)=> (s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION
                        || s.structureType == STRUCTURE_TOWER) 
                    && s.energy < s.energyCapacity //only spawn and extension has energy capacity attribute
                });
                if (structure != undefined) {
                    if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(structure);
                    }
                }
            }
            else {
        
                var exit = creep.room.findExitTo(creep.memory.home);
                creep.moveTo(creep.pos.findClosestByRange(exit));
            }
            
            
        }
        else {
            //on the way to another room
            if (creep.room.name == creep.memory.target) {
                var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {reusePath: 3});
                }
            }
            else {
                var exit = creep.room.findExitTo(creep.memory.target);
                creep.moveTo(creep.pos.findClosestByRange(exit)); 
            }
            
        }
    }
}