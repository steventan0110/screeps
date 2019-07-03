var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
module.exports.loop = function() {
    for (let name in Game.creeps) {
        var creep = Game.creeps[name];
        console.log(name +" is working: "+ creep.memory.working);
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        
    }
    

    
}