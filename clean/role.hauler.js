const bodies = {
    ALPHA: [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE],
    BETA: [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE],
    GAMMA: [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE],
    DELTA: [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE],
    EPSILON: [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE],
    ZETA: [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE],
};

const roleHauler = {
    tag: 'hauler',
    body: (maxCapacity) => {
        if (maxCapacity < 500) return bodies.ALPHA;
        else if (maxCapacity < 800) return bodies.BETA;
        else if (maxCapacity < 1300) return bodies.GAMMA;
        else if (maxCapacity < 1800) return bodies.DELTA;
        else if (maxCapacity < 2300) return bodies.EPSILON;
        else if (maxCapacity >= 2300) return bodies.ZETA;
    },
    run: (creep) => {
        const freeSpace = creep.store.getFreeCapacity()
        const usedSpace = creep.store.getUsedCapacity()

        const sources = creep.room.find(FIND_DROPPED_RESOURCES)
        const sourceTarget = _.max(sources, 'amount')

        const sinkTypes = [STRUCTURE_SPAWN, STRUCTURE_EXTENSION]
        const sinks = creep.room.find(FIND_MY_STRUCTURES, { filter: structure => sinkTypes.includes(structure.structureType) })
        const sinkTarget = _.min(sinks, 'energy')

        const activeTask = creep.memory.task

        if (activeTask == "collect" && creep.pickup(sourceTarget) == ERR_NOT_IN_RANGE) creep.moveTo(sourceTarget, { visualizePathStyle: { stroke: "#eeeeee" } });
        if (activeTask == "submit" && creep.transfer(sinkTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) creep.moveTo(sinkTarget, { visualizePathStyle: { stroke: "#eeeeee" } });

        if (!activeTask) creep.memory.task = "collect"
        else if (activeTask == "collect" && freeSpace == 0) creep.memory.task = "submit"
        else if (activeTask == "submit" && usedSpace == 0) creep.memory.task = "collect"
    }
}

module.exports = roleHauler;