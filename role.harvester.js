//var roleLD = require('role.longDistanceHarvester');
module.exports = {
    run: function(creep) {
        if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true; 
        }
        
        if (creep.memory.working == true) {
            //war time mode:
            // var tower = creep.pos.findClosestByPath(FIND_MY_STRUCTURES,{
            //     filter:(s)=>  s.structureType == STRUCTURE_TOWER
            //     && s.energy < s.energyCapacity //only spawn and extension has energy capacity attribute
            // });
            // if (tower != undefined) {
            //     if (creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            //         creep.moveTo(tower);
            //     }
            // }
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
            //if not working, check if there's available source in the room
            var container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: s => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0
            });
            // if (container != undefined) {
            //     if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            //         creep.moveTo(container);
            //     }
            // }
          
                var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                // if (source == undefined) {
                //     //no active source
                //     creep.memory.home = 'W12N18';
                //     creep.memory.target = 'W12N17';
                //     roleLD.run(creep);
                // }
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }

            
        }
    }
}