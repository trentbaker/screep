const roleHauler = {
    tag: 'hauler',
    body: {
        gene: [MOVE, CARRY],
        required: [],
    },
    run: (creep) => {
        const actions = {
            collect: (creep) => {
                if (!creep.memory.source) {
                    const onTheGround = _.max(creep.room.find(FIND_DROPPED_RESOURCES), 'amount')
                    const containers = creep.room.find(FIND_MY_STRUCTURES, { filter: structure => structure.structureType == STRUCTURE_CONTAINER })
                    const container = _.max(containers, 'amount')

                    if (onTheGround) creep.memory.source = onTheGround.id
                    else if (container) creep.memory.source = container.id
                    else creep.memory.source = false
                }

                const target = Game.getObjectById(creep.memory.source)
                creep.memory.yoten = target

                if (!target || target.amount == 0) {
                    creep.memory.source = false
                    return
                } else if (creep.pickup(target) == ERR_NOT_IN_RANGE) creep.moveTo(target, { visualizePathStyle: { stroke: "#eeeeee" } })
            },
            deposit: (creep) => {
                if (!creep.memory.sink) {
                    const sinkTypes = [STRUCTURE_SPAWN, STRUCTURE_EXTENSION]
                    const sinks = creep.room.find(FIND_MY_STRUCTURES, { filter: structure => sinkTypes.includes(structure.structureType) })
                    const unfilledSinks = _.filter(sinks, sink => sink.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
                    creep.memory.sink = _.min(unfilledSinks, sink => sink.store.getFreeCapacity(RESOURCE_ENERGY)).id
                }

                const target = Game.getObjectById(creep.memory.sink)

                if (!target || !target.store.getFreeCapacity(RESOURCE_ENERGY)) {
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
        else if (activeTask == "deposit" && usedSpace == 0) creep.memory.task = "collect"

        if (creep.memory.task == "collect") actions.collect(creep)
        else if (creep.memory.task == "deposit") actions.deposit(creep)
    }
}

module.exports = roleHauler;