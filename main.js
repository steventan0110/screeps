require('prototype.spawn')()
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleMiner = require('role.miner');
var roleLongDistanceHarvester = require('role.longDistanceHarvester');
var roleMover= require('role.mover');

var HOME = 'W12N18';

module.exports.loop = function() {
    //detect enemies and attack them
    var hostiles = Game.rooms.W12N18.find(FIND_HOSTILE_CREEPS);
    //find all towers  
    towers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER);
    if (hostiles.length > 0) {
        for (let tower of towers) {
            var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (target != undefined) {
                tower.attack(target);
            }
        }
    }
    //heal my creeps:
    if (hostiles.length == 0) {
        //after finish attacking the enemy, tower starts to heal
        for (let tower of towers) {
            var target = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: (c) => c.hits < c.hitsMax 
            });
            if (target != undefined) {
                tower.heal(target);
            }
        }
    }
    //clear memory
    for (let name in Memory.creeps) {
        var cp = Game.creeps[name];
        if (cp == undefined) {
            delete Memory.creeps[name];
        }
        else {
            cp.say(cp.memory.role);
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
        else if (creep.memory.role == 'miner') {
            roleMiner.run(creep);
        }
        else if (creep.memory.role == 'mover') {
            roleMover.run(creep);
        }
        
    }
    
    
    
    //auto spawning
    var spawn = Game.spawns.Spawn1;
    var sources = spawn.room.find(FIND_SOURCES);
    var minHarvester = 6;
    var minUpgrader = 2;
    var minBuilder = 3; 
    var minRepairer = 3;
    var minLongDistanceHarvester = 3;
    var minMover = 2;
    var numOfHarvester = _.sum(Game.creeps, (c)=> c.memory.role == 'harvester'); 
    var numOfUpgrader = _.sum(Game.creeps, (c)=> c.memory.role == 'upgrader'); 
    var numOfBuilder = _.sum(Game.creeps, (c)=> c.memory.role == 'builder'); 
    var numOfRepairer = _.sum(Game.creeps, (c)=> c.memory.role == 'repairer');
    var numOfMiner = _.sum(Game.creeps, (c)=> c.memory.role == 'miner');
    var numOfMover = _.sum(Game.creeps, (c)=> c.memory.role == 'mover');
    var numOfLongDistanceHarvesterW12N17 = _.sum(Game.creeps, 
        (c)=> c.memory.role == 'longDistanceHarvester' && c.memory.target == 'W12N17');
    
    var numTotal = numOfHarvester + numOfUpgrader + numOfBuilder + numOfRepairer + numOfLongDistanceHarvesterW12N17;
    var name = undefined;
    var energy = Game.spawns.Spawn1.room.energyCapacityAvailable;
    console.log("harvester: "+ numOfHarvester + "upgrader: "+ numOfUpgrader +"builder: "+ numOfBuilder +"repairer: "+ 
    numOfRepairer +"LDharvester: "+ numOfLongDistanceHarvesterW12N17 + "miner: " +numOfMiner + "mover: "+ numOfMover);


    // if (numOfHarvester == 0 && (numOfMiner == 0 || numOfMover == 0)) {
    //     if (numOfMiner > 0) {
    //         spawn.createMover(spawn.room.energyAvailable);
    //     }
    //     else {
    //         name = spawn.createCustomCreep(spawn.room.energyAvailable, 'harvester');
    //     }
    // } else {
    //     name = undefined;

    //     // for (let source of sources) {
    //     //     //check if it has miner already
    //     //     if (!_.some(Game.creeps, c => c.memory.role == 'miner' && c.memory.sourceId == source.id)) {
    //     //         //check if container exists
    //     //         let container = source.pos.findInRange(FIND_STRUCTURES, 1, {
    //     //             filter: (s) => s.structureType == STRUCTURE_CONTAINER
    //     //         });
    //     //         if (container.length > 0) {
    //     //             name = spawn.createMiner(source.id);
                
    //     //         }
    //     //     }
    //     // }
    // }

    if (name == undefined) {
        // if (numOfMover < minMover) {
        //     name = spawn.createMover(300, 'mover');
        // }
        if (numOfHarvester < minHarvester) {
            if (numOfHarvester <= 1) {
                name = Game.spawns.Spawn1.createCustomCreep(spawn.room.energyAvailable, 'harvester');
            } else {
                name = Game.spawns.Spawn1.createCustomCreep(energy, 'harvester');
            }
        }
        else if (numOfUpgrader < minUpgrader) {
            name = Game.spawns.Spawn1.createCustomCreep(energy, 'upgrader');
        }
        else if (numOfBuilder < minBuilder) {
            name = Game.spawns.Spawn1.createCustomCreep(energy, 'builder');
        }
        else if (numOfRepairer < minRepairer) {
            name = Game.spawns.Spawn1.createCustomCreep(energy, 'repairer');
        }
        else if (numOfLongDistanceHarvesterW12N17 < minLongDistanceHarvester) {
            console.log("reach here" + numOfLongDistanceHarvesterW12N17);
            name = Game.spawns.Spawn1.createLongDistanceHarvester(energy, 3, HOME, 'W12N17', 0);
        }

        else {
            //name = Game.spawns.Spawn1.createCustomCreep(energy, 'builder');
            name = -1; //don't need excessive ones
        }
    }
    
    //check if it is an error code (below 0)
    if (!(name < 0))  {
        console.log("Spawned new creep: "+name);
    }

    
}