// const roleHarvester = require("role.harvester");
// const roleUpgrader = require("role.upgrader");
// const roleBuilder = require("role.builder");
const roleTower = require("role.tower");
const roleMiner = require("role.miner");
const roleHauler = require("role.hauler");

const roles = {
  miner: roleMiner,
  hauler: roleHauler,
}

const garbageCollect = () => {
  for (var name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log("Clearing non-existing creep memory:", name);
    } else {
      Game.creeps[name].refresh;
    }
  }
}

const logRoomData = () => {
  for (var name in Game.rooms) {
    const avail = Game.rooms[name].energyAvailable
    const total = Game.rooms[name].energyCapacityAvailable
    console.log(`${name}: ${avail}/${total}`);
  }
}

const spawnScaledCreep = (maxCapacity, role) => {
  Game.spawns["Spawn1"].spawnCreep(role.body(maxCapacity), `${role.tag}_${Game.time}`, { memory: { role: role.tag } });
}

const spawnCreeps = (target, living) => {
  _.forEach(target, (targetPop, role) => {
    const livingPop = living[role] ? living[role] : 0
    console.log(`${livingPop}/${targetPop} living ${role}s`)
    if (!livingPop || livingPop < targetPop) {
      const spawn = Game.spawns["Spawn1"]
      const maxPrice = spawn.room.energyCapacityAvailable
      const relevantRole = _.find(roles, { 'tag': role })
      const newBody = relevantRole.body(maxPrice)
      const newName = `${role}_${newBody.length}_${Game.time}`

      spawn.spawnCreep(newBody, newName, { memory: { role: role } })
    }
  })
}

/*
 Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, MOVE, CARRY], "t1", { memory: { role: "miner" } });
 */

// main game loop
module.exports.loop = () => {

  garbageCollect()

  logRoomData()

  const livingRoles = _.countBy(Game.creeps, creep => creep.memory.role)

  const populationTargets = {
    miner: 4,
    hauler: 4,
  }

  spawnCreeps(populationTargets, livingRoles)

  const towers = _.filter(Game.structures, { 'structureType': 'tower' })
  _.forEach(towers, tower => roleTower.run(tower))

  // take role based action on each creep
  _.forEach(Game.creeps, (creep) => {
    _.find(roles, { 'tag': creep.memory.role }).run(creep)
  })
};