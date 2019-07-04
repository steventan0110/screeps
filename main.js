var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer')
module.exports.loop = function() {
    //clear memory
    for (let name in Memory.creeps) {
        if (Game.creeps[name] == undefined) {
            delete Memory.creeps[name];
        }
    }
    for (let name in Game.creeps) {
        var creep = Game.creeps[name];
        console.log(name +" is working: "+ creep.memory.working);
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        else if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        else if (creep.memory.role = 'builder') {
            roleBuilder.run(creep);
        }
        else if (creep.memory.role = 'repairer') {
            roleRepairer.run(creep);
        }
    }
    //auto spawning
    var minHarvester = 10;
    var minUpgrader = 1;
    var minBuilder = 1; 
    var minRepairer = 2;
    var numOfHarvester = _.sum(Game.creeps, (c)=> c.memory.role == 'harvester'); 
    var numOfUpgrader = _.sum(Game.creeps, (c)=> c.memory.role == 'upgrader'); 
    var numOfBuilder = _.sum(Game.creeps, (c)=> c.memory.role == 'builder'); 
    var numOfRepairer = _.sum(Game.creeps, (c)=> c.memory.role == 'repairer');

    var numTotal = numOfHarvester + numOfUpgrader + numOfBuilder;
    var name = undefined;
    console.log(numTotal)
    if (numOfHarvester < minHarvester) {
        name = Game.spawns.Spawn1.createCreep([WORK,WORK,CARRY,MOVE], undefined, 
        {role:'harvester', working: false});
    } 
    else if (numOfUpgrader < minUpgrader) {
        name = Game.spawns.Spawn1.createCreep([WORK,CARRY,MOVE,MOVE], undefined, 
        {role:'upgrader', working: false}); 
    }
    else if (numOfRepairer < minRepairer) {
        name = Game.spawns.Spawn1.createCreep([WORK,WORK,CARRY,MOVE], undefined, 
        {role:'repairer', working: false}); 
    }
    else if (numOfBuilder < minBuilder) {
        name = Game.spawns.Spawn1.createCreep([WORK,WORK,CARRY,MOVE], undefined, 
        {role:'builder', working: false}); 
    }
    
    else {
        name = Game.spawns.Spawn1.createCreep([WORK,CARRY,MOVE,MOVE], undefined, 
        {role:'builder', working: false}); 
        
    }
    
    //check if it is an error code (below 0)
    if (!(name < 0))  {
        console.log("Spawned new creep: "+name);
    }

    
}