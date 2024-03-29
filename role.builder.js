var roleUpgrader = require('role.upgrader');

module.exports = {
    run: function(creep) {
        if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true; 
        }
        
        if (creep.memory.working == true) {
           var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
           if (constructionSite != undefined) {
               if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
                   creep.moveTo(constructionSite);
                }
           }
           else {
               //no construction defined, do something else
                roleUpgrader.run(creep);
           }
           
        }
        else {
            //look for container first
            var container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: s => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0
            });
            if (container != undefined) {
                if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }
            }
            else {
                var source = creep.pos.findClosestByPath(FIND_SOURCES);
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }

            }
        }
    }
}