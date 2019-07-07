require('prototype.spawn')()
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleLongDistanceHarvester = require('role.longDistanceHarvester');

var HOME = 'W12N18';

module.exports.loop = function() {
    //detect enemies and attack them
    var hostiles = Game.rooms.W12N18.find(FIND_HOSTILE_CREEPS);
    towers = Game.rooms.W12N18.find(FIND_MY_STRUCTURES, {
            filter: (s)=> s.structureType == STRUCTURE_TOWER
        });
    if (hostiles.length > 0) {
        for (let tower of towers) {
            var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (target != undefined) {
                tower.attack(target);
            }
        }
    }
    //heal my creeps:
    
    for (let tower of towers) {
        var target = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: (c) => c.hits < c.hitsMax 
        });
        if (target != undefined) {
            tower.heal(target);
        }
    }
    //clear memory
    for (let name in Memory.creeps) {
        var cp = Game.creeps[name];
        if (cp == undefined) {
            delete Memory.creeps[name];
        }
    }
    for (let name in Game.creeps) {
        var creep = Game.creeps[name];
        //console.log(name +" is working: "+ creep.memory.working);
   
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
            
        }
        else if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        else if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        else if (creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
        else if (creep.memory.role == 'longDistanceHarvester') {
            roleLongDistanceHarvester.run(creep);
        }
    }
    
    
    
    //auto spawning
    var minHarvester = 10;
    var minUpgrader = 3;
    var minBuilder = 1; 
    var minRepairer = 2;
    var minLongDistanceHarvester = 3;
    var numOfHarvester = _.sum(Game.creeps, (c)=> c.memory.role == 'harvester'); 
    var numOfUpgrader = _.sum(Game.creeps, (c)=> c.memory.role == 'upgrader'); 
    var numOfBuilder = _.sum(Game.creeps, (c)=> c.memory.role == 'builder'); 
    var numOfRepairer = _.sum(Game.creeps, (c)=> c.memory.role == 'repairer');
    var numOfLongDistanceHarvesterW12N17 = _.sum(Game.creeps, 
        (c)=> c.memory.role == 'longDistanceHarvester' && c.memory.target == 'W12N17');
    console.log("num of builder"+ minBuilder);
    var numTotal = numOfHarvester + numOfUpgrader + numOfBuilder + numOfRepairer + numOfLongDistanceHarvesterW12N17;
    var name = undefined;
    var energy = Game.spawns.Spawn1.room.energyCapacityAvailable;
    console.log("harvester: "+ numOfHarvester + "upgrader: "+ numOfUpgrader +"builder: "+ numOfBuilder +"repairer: "+ 
    numOfRepairer +"LDharvester: "+ numOfLongDistanceHarvesterW12N17);
    //console.log(numOfLongDistanceHarvesterW12N17 + "smaller than "+minLongDistanceHarvesterW12N17);
    if (numOfHarvester < minHarvester) {
        name = Game.spawns.Spawn1.createCustomCreep(energy, 'harvester');
        //in case all creeps are destroyed by invaders:
            if (numOfHarvester == 0) {
                
                name = Game.spawns.Spawn1.createCustomCreep(Game.spawns.Spawn1.room.energyAvailable, 'harvester');
            }
    } 
    else if (numOfUpgrader < minUpgrader) {
        name = Game.spawns.Spawn1.createCustomCreep(energy, 'upgrader');
    }
    else if (numOfRepairer < minRepairer) {
        name = Game.spawns.Spawn1.createCustomCreep(energy, 'repairer');
    }
    else if (numOfBuilder < minBuilder) {
        name = Game.spawns.Spawn1.createCustomCreep(energy, 'builder');
    }
    else if (numOfLongDistanceHarvesterW12N17 < minLongDistanceHarvester) {
        console.log("reach here" + numOfLongDistanceHarvesterW12N17);
        name = Game.spawns.Spawn1.createLongDistanceHarvester(energy, 3, HOME, 'W12N17',0);
    }
    
    else {
        name = Game.spawns.Spawn1.createCustomCreep(energy, 'builder');
        
    }
    
    //check if it is an error code (below 0)
    if (!(name < 0))  {
        console.log("Spawned new creep: "+name);
    }

    
}