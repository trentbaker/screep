
const roleUpgrader = require("role.upgrader");
const roleBuilder = require("role.builder");
const roleTower = require("role.tower");
const roleMiner = require("role.miner");
const roleHauler = require("role.hauler");

const roles = {
  miner: roleMiner,
  hauler: roleHauler,
  upgrader: roleUpgrader,
  builder: roleBuilder,
}

const generateBody = (gene, required, price) => {
  const geneCost = _.sum(_.map(gene, part => BODYPART_COST[part]))
  const requireCost = _.sum(_.map(required, part => BODYPART_COST[part]))

  const geneCount = parseInt((price - requireCost) / geneCost)
  const geneParts = _.flatten(Array(geneCount).fill(gene))

  const moveFillerCount = (price-((geneCount*geneCost)+requireCost))/BODYPART_COST[MOVE]
  const moveFiller = Array(moveFillerCount).fill(MOVE)

  return [...geneParts, ...required, ...moveFiller]
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
      const nameTag = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
      const spawn = Game.spawns["Spawn1"]
      const maxPrice = spawn.room.energyCapacityAvailable
      const relevantRole = _.find(roles, { 'tag': role })
      const newBody = generateBody(relevantRole.body.gene, relevantRole.body.required, maxPrice)
      const newName = `${role}_${newBody.length}_${nameTag(8)}`


      spawn.spawnCreep(newBody, newName, { memory: { role: role } })
      return false // eject
    }
  })
}

/*
 Game.spawns['Spawn1'].spawnCreep([WORK, WORK, MOVE, CARRY], "t1", { memory: { role: "miner" } });
 */

// main game loop
module.exports.loop = () => {

  garbageCollect()

  logRoomData()

  const livingRoles = _.countBy(Game.creeps, creep => creep.memory.role)

  const populationTargets = {
    miner: 2,
    hauler: 3,
    upgrader: 3,
    builder: 3,
  }

  spawnCreeps(populationTargets, livingRoles)

  const towers = _.filter(Game.structures, { 'structureType': 'tower' })
  _.forEach(towers, tower => roleTower.run(tower))

  // take role based action on each creep
  _.forEach(Game.creeps, (creep) => {
    _.find(roles, { 'tag': creep.memory.role }).run(creep)
  })
};