const roleMiner = {
    tag: "miner",
    body: {
        gene: [WORK],
        required: [MOVE, CARRY],
    },
    run: (creep) => {
        const actions = {
            mine: (creep) => {
                if (!creep.memory.source) {
                    const sources = creep.room.find(FIND_SOURCES)
                    creep.memory.source = _.min(sources, (source) => source.pos.findInRange(FIND_CREEPS, 2)).id
                }

                const target = Game.getObjectById(creep.memory.source)

                if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: "#eeeeee" } });
                } else if (!target) creep.memory.source = false
            },
            genesis: (creep) => {
                const spawn = creep.room.find(FIND_MY_STRUCTURES, { filter: structure => structure.structureType == STRUCTURE_SPAWN })[0]
                if (!creep.memory.genesis) creep.memory.genesis = "mine"
                else if (creep.memory.genesis == "mine" && creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) actions.mine(creep)
                else if (creep.memory.genesis == "mine" && creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) creep.memory.genesis = "deposit"
                else if (creep.memory.genesis == "deposit" && creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) creep.memory.genesis = "mine"
                else if (creep.memory.genesis == "deposit") {
                    if (creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(spawn, { visualizePathStyle: { stroke: "#eeeeee" } })
                    }
                }
            },
        }

        if (!creep.memory.task) creep.memory.task = "genesis"
        if (creep.memory.task == "mine") actions.mine(creep)
        else if (creep.memory.task == "genesis") actions.genesis(creep)

        const isSupported = creep.room.find(FIND_MY_CREEPS, { filter: creep => creep.memory.role == 'hauler' }).length > 0
        const activeTask = creep.memory.task

        if (activeTask == "mine") actions.mine(creep)
        else if (activeTask == "genesis" && isSupported) creep.memory.task = "mine"
        else if (activeTask == "genesis") actions.genesis(creep)

        // if (!activeTask) creep.memory.task = "refill"
        // else if (activeTask == "refill" && freeSpace == 0) creep.memory.task = "upgrade"
        // else if (activeTask == "upgrade" && usedSpace == 0) creep.memory.task = "refill"


        //-----
        // // if no target, set to nearest
        // if (!creep.memory.jobsite) creep.memory.jobsite = creep.room.find(FIND_SOURCES)[0].id;

        // const target = Game.getObjectById(creep.memory.jobsite)
        // const isSupported = creep.room.find(FIND_MY_CREEPS, { filter: creep => creep.memory.role == 'hauler' }).length > 0
        // const freeSpace = creep.store.getFreeCapacity()
        // const sinkTypes = [STRUCTURE_SPAWN]
        // const sinks = creep.room.find(FIND_MY_STRUCTURES, { filter: structure => sinkTypes.includes(structure.structureType) })
        // const sinkTarget = sinks[0]

        // if (freeSpace == 0 && !isSupported && creep.transfer(sinkTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        //     creep.moveTo(sinkTarget, { visualizePathStyle: { stroke: "#eeeeee" } })
        // } else if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
        //     creep.moveTo(target, { visualizePathStyle: { stroke: "#eeeeee" } });
        // }
    },
};

module.exports = roleMiner;