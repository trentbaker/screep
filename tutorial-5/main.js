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
    HARVESTER: {
      body: [WORK, CARRY, MOVE],
      role: "harvester",
      namePrefix: "hrv_01",
    },
    HARVEESTER: {
      body: [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
      role: 'harvester',
      namePrefix: "hrv_02",
    },
    UPGRADER: {
      body: [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
      role: "upgrader",
      namePrefix: "upg_02",
    },
    BUILDER: {
      body: [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
      role: "builder",
      namePrefix: "bld_02",
    },
  };

  const livingRoles = {
    HARVESTER: _.filter(
      Game.creeps,
      (creep) => creep.memory.role == creepTypes.HARVESTER.role
    ),
    UPGRADER: _.filter(
      Game.creeps,
      (creep) => creep.memory.role == creepTypes.UPGRADER.role
    ),
    BUILDER: _.filter(
      Game.creeps,
      (creep) => creep.memory.role == creepTypes.BUILDER.role
    ),
  };
  // yeet

  const spawnCreepType = (creepType) => {
    Game.spawns["Spawn1"].spawnCreep(
      creepType.body,
      `${creepType.namePrefix}_${Game.time}`,
      { memory: { role: creepType.role } }
    );}

  if (livingRoles.HARVESTER.length < 5) {
    spawnCreepType(creepTypes.HARVEESTER);
  } else if (livingRoles.BUILDER.length < 5) {
    spawnCreepType(creepTypes.BUILDER);
  } else if (livingRoles.UPGRADER.length < 2) {
    spawnCreepType(creepTypes.UPGRADER);
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
