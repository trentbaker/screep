const bodies = {
    ALPHA: [WORK, WORK, MOVE, CARRY],
    BETA: [WORK, WORK, WORK, WORK, MOVE, CARRY],
    GAMMA: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, CARRY],
    DELTA: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, CARRY],
    EPSILON: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, CARRY],
    ZETA: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, CARRY]
};

const roleMiner = {
    tag: "miner",
    body: (maxCapacity) => {
        if (maxCapacity <= 550) return bodies.ALPHA;
        else if (maxCapacity <= 750) return bodies.BETA;
        else if (maxCapacity <= 1250) return bodies.GAMMA;
        else if (maxCapacity <= 1750) return bodies.DELTA;
        else if (maxCapacity <= 2250) return bodies.EPSILON;
        else if (maxCapacity >= 2250) return bodies.ZETA;
    },
    run: (creep) => {

        // if no target, set to nearest
        if (!creep.memory.jobsite) creep.memory.jobsite = creep.room.find(FIND_SOURCES)[0].id;

        const target = Game.getObjectById(creep.memory.jobsite)
        const isSupported = creep.room.find(FIND_MY_CREEPS, { filter: creep => creep.memory.role == 'hauler'}).length > 0
        const freeSpace = creep.store.getFreeCapacity()
        const sinkTypes = [STRUCTURE_SPAWN]
        const sinks = creep.room.find(FIND_MY_STRUCTURES, { filter: structure => sinkTypes.includes(structure.structureType) })
        const sinkTarget = sinks[0]

        if (freeSpace == 0 && !isSupported && creep.transfer(sinkTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sinkTarget, { visualizePathStyle: { stroke: "#eeeeee" } })
        } else if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, { visualizePathStyle: { stroke: "#eeeeee" } });
        }
    },
};

module.exports = roleMiner;