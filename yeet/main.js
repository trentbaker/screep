const roleHarvester = require("role.harvester");
const roleUpgrader = require("role.upgrader");
const roleBuilder = require("role.builder");

module.exports.loop = function () {
  for (var name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log("Clearing non-existing creep memory:", name);
    } else {
      Game.creeps[name].refresh;
    }
  }

   for (var name in Game.rooms) {
     console.log(`${name} has ${Game.rooms[name].energyAvailable} energy available`);
   }


  const creepTypes = {
    HARVESTER_ALPHA: {
      body: [WORK, CARRY, MOVE],
      level: 1,
      role: "harvester",
      namePrefix: "hrv_01",
    },
    HARVESTER_BETA: {
      body: [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
      level: 2,
      role: 'harvester',
      namePrefix: "hrv_02",
    },
    UPGRADER_ALPHA: {
      body: [WORK, CARRY, MOVE],
      level: 1,
      role: "upgrader",
      namePrefix: "upg_01",
    },
    UPGRADER_BETA: {
      body: [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
      level: 2,
      role: "upgrader",
      namePrefix: "upg_02",
    },
    BUILDER_ALPHA: {
      body: [WORK, CARRY, MOVE],
      level: 1,
      role: "builder",
      namePrefix: "bld_01",
    },
    BUILDER_BETA: {
      body: [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
      level: 2,
      role: "builder",
      namePrefix: "bld_02",
    },
  };

  const livingRoles = {
    HARVESTER: _.filter(
      Game.creeps,
      (creep) => creep.memory.role == creepTypes.HARVESTER_ALPHA.role
    ),
    UPGRADER: _.filter(
      Game.creeps,
      (creep) => creep.memory.role == creepTypes.UPGRADER_ALPHA.role
    ),
    BUILDER: _.filter(
      Game.creeps,
      (creep) => creep.memory.role == creepTypes.BUILDER_ALPHA.role
    ),
  };

  const spawnCreepType = (creepType) => {
    Game.spawns["Spawn1"].spawnCreep(
      creepType.body,
      `${creepType.namePrefix}_${Game.time}`,
      { memory: { role: creepType.role } }
    );}

  if (livingRoles.HARVESTER.length < 5) {
    spawnCreepType(creepTypes.HARVESTER_BETA);
  } else if (livingRoles.BUILDER.length < 2) {
    spawnCreepType(creepTypes.BUILDER_BETA);
  } else if (livingRoles.UPGRADER.length < 4) {
    spawnCreepType(creepTypes.UPGRADER_BETA);
  }

  // Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], "u1", { memory: { role: "upgrader" } });
  // Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], "b1", { memory: { role: "builder" } });
  // Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], "h1", { memory: { role: "harvester" } });

  var tower = Game.getObjectById("4118f0e6524323c1f5b947f5");
  if (tower) {
    var closestDamagedStructure = tower.pos.findClosestByRange(
      FIND_STRUCTURES,
      {
        filter: (structure) => structure.hits < structure.hitsMax,
      }
    );
    if (closestDamagedStructure) {
      tower.repair(closestDamagedStructure);
    }

    var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (closestHostile) {
      tower.attack(closestHostile);
    }
  }

  for (var name in Game.creeps) {
    var creep = Game.creeps[name];
    switch (creep.memory.role) {
      case "harvester":
        roleHarvester.run(creep);
        break;
      case "upgrader":
        roleUpgrader.run(creep);
        break;
      case "builder":
        roleBuilder.run(creep);
        break;
    }
  }
};
