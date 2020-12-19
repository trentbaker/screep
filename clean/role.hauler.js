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
        if (maxCapacity <= 500) return bodies.ALPHA;
        else if (maxCapacity <= 800) return bodies.BETA;
        else if (maxCapacity <= 1300) return bodies.GAMMA;
        else if (maxCapacity <= 1800) return bodies.DELTA;
        else if (maxCapacity <= 2300) return bodies.EPSILON;
        else if (maxCapacity >= 2300) return bodies.ZETA;
    },
    run: (creep) => {
        const actions = {
            collect: (creep) => {
                if (!creep.memory.source) {
                    const onTheGround = _.max(creep.room.find(FIND_DROPPED_RESOURCES), 'amount')
                    const containers = creep.room.find(FIND_MY_STRUCTURES, { filter: structure => structure.structureType == STRUCTURE_CONTAINER })
                    const container = _.min(containers, 'amount')

                    if (onTheGround) creep.memory.source = onTheGround.id
                    else if (container) creep.memory.source = container.id
                    else creep.memory.source = false
                }

                const target = Game.getObjectById(creep.memory.source)

                if (!target) {
                    creep.memory.source = false
                    return
                } else if (creep.pickup(target) == ERR_NOT_IN_RANGE) creep.moveTo(target, { visualizePathStyle: { stroke: "#eeeeee" } })
            },
            deposit: (creep) => {
                if (!creep.memory.sink) {
                    const sinkTypes = [STRUCTURE_SPAWN, STRUCTURE_EXTENSION]
                    const sinks = creep.room.find(FIND_MY_STRUCTURES, { filter: structure => sinkTypes.includes(structure.structureType) })
                    creep.memory.sink = _.min(sinks, sink => sink.store.getFreeCapacity()).id
                }

                const target = Game.getObjectById(creep.memory.sink)

                if (!target) {
                    creep.memory.sink = false
                    return
                } else if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) creep.moveTo(target, { visualizePathStyle: { stroke: "#eeeeee" } })
            }
        }

        const freeSpace = creep.store.getFreeCapacity()
        const usedSpace = creep.store.getUsedCapacity()

        const activeTask = creep.memory.task

        if (!activeTask) creep.memory.task = "collect"
        else if (activeTask == "collect" && freeSpace == 0) creep.memory.task = "deposit"
        else if (activeTask == "collect" && !Game.getObjectById(creep.memory.source)) creep.memory.source = false
        else if (activeTask == "deposit" && usedSpace == 0) creep.memory.task = "collect"

        if (creep.memory.task == "collect") actions.collect(creep)
        else if (creep.memory.task == "deposit") actions.deposit(creep)
    }
}

module.exports = roleHauler;