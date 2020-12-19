const bodies = {
    ALPHA: [WORK, CARRY, MOVE],
    BETA: [WORK, CARRY, MOVE, WORK, CARRY, MOVE],
    GAMMA: [WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE],
    DELTA: [WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE],
    EPSILON: [WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE],
    ZETA: [WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE]
};

const roleUpgrader = {
    tag: 'upgrader',
    body: (maxCapacity) => {
        if (maxCapacity <= 300) return bodies.ALPHA;
        else if (maxCapacity <= 400) return bodies.BETA;
        else if (maxCapacity <= 800) return bodies.GAMMA;
        else if (maxCapacity <= 1200) return bodies.DELTA;
        else if (maxCapacity <= 1800) return bodies.EPSILON;
        else if (maxCapacity >= 2200) return bodies.ZETA;
    },
    run: (creep) => {
        const actions = {
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
            upgrade: (creep) => {
                if (!creep.memory.sink) creep.memory.sink = creep.room.controller.id

                const target = Game.getObjectById(creep.memory.sink)

                if (!target) {
                    creep.memory.sink = false
                    return
                } else if (creep.upgradeController(target) == ERR_NOT_IN_RANGE) creep.moveTo(target, { visualizePathStyle: { stroke: "#eeeeee" } })
            },
        }
        const freeSpace = creep.store.getFreeCapacity()
        const usedSpace = creep.store.getUsedCapacity()

        const activeTask = creep.memory.task

        if (activeTask == "refill") actions.refill(creep)
        else if (activeTask == "upgrade") actions.upgrade(creep)

        if (!activeTask) creep.memory.task = "refill"
        else if (activeTask == "refill" && freeSpace == 0) creep.memory.task = "upgrade"
        else if (activeTask == "upgrade" && usedSpace == 0) creep.memory.task = "refill"
    }
}

module.exports = roleUpgrader;