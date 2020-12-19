const bodies = {
    ALPHA: [WORK, CARRY, WORK, MOVE],
    BETA: [WORK, CARRY, WORK, CARRY, WORK, CARRY, MOVE, MOVE],
    GAMMA: [WORK, CARRY, WORK, CARRY, WORK, CARRY, WORK, CARRY, WORK, CARRY, MOVE],
    DELTA: [WORK, CARRY, WORK, CARRY, WORK, CARRY, WORK, CARRY, WORK, CARRY, WORK, CARRY, WORK, CARRY, WORK, CARRY, MOVE, MOVE],
    EPSILON: [WORK, CARRY, WORK, CARRY, WORK, CARRY, WORK, CARRY, WORK, CARRY, WORK, CARRY, WORK, CARRY, WORK, CARRY, WORK, CARRY, WORK, CARRY, WORK, CARRY, MOVE, MOVE, MOVE],
    ZETA: [WORK, CARRY, WORK, CARRY, WORK, CARRY, WORK, CARRY, WORK, CARRY, WORK, CARRY, WORK, CARRY, WORK, CARRY, WORK, CARRY, WORK, CARRY, WORK, CARRY, WORK, CARRY, WORK, CARRY, WORK, CARRY, WORK, CARRY, MOVE]
};

const roleBuilder = {
    tag: 'builder',
    body: (maxCapacity) => {
        if (maxCapacity <= 300) return bodies.ALPHA;
        else if (maxCapacity <= 550) return bodies.BETA;
        else if (maxCapacity <= 800) return bodies.GAMMA;
        else if (maxCapacity <= 1300) return bodies.DELTA;
        else if (maxCapacity <= 1800) return bodies.EPSILON;
        else if (maxCapacity >= 2300) return bodies.ZETA;
    },
    run: (creep) => {
        const actions = {
            build: (creep) => {
                if (!creep.memory.sink) {
                    const availableWork = creep.room.find(FIND_MY_CONSTRUCTION_SITES)
                    if (availableWork.length) creep.memory.sink = availableWork[0].id
                }

                const target = Game.getObjectById(creep.memory.sink)

                if (!target || !creep.store.getUsedCapacity()) {
                    creep.memory.sink = false
                    return
                } else if (creep.build(target) == ERR_NOT_IN_RANGE) creep.moveTo(target, { visualizePathStyle: { stroke: "#eeeeee" } })
            },
            refill: (creep) => {
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
        }

        const freeSpace = creep.store.getFreeCapacity()
        const usedSpace = creep.store.getUsedCapacity()

        const activeTask = creep.memory.task

        if (activeTask == "refill") actions.refill(creep)
        else if (activeTask == "build") actions.build(creep)

        if (!activeTask) creep.memory.task = "refill"
        else if (activeTask == "refill" && freeSpace == 0) creep.memory.task = "build"
        else if (activeTask == "build" && usedSpace == 0) creep.memory.task = "refill"
    }
}

module.exports = roleBuilder;