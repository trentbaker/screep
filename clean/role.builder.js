const roleBuilder = {
    tag: 'builder',
    body: {
        gene: [WORK, CARRY],
        required: [MOVE],
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