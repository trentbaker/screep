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
        if (maxCapacity < 550) return bodies.ALPHA;
        else if (maxCapacity < 750) return bodies.BETA;
        else if (maxCapacity < 1250) return bodies.GAMMA;
        else if (maxCapacity < 1750) return bodies.DELTA;
        else if (maxCapacity < 2250) return bodies.EPSILON;
        else if (maxCapacity >= 2250) return bodies.ZETA;
    },
    run: (creep) => {

        // creep.refresh()
        // if no target, set to nearest
        if (!creep.memory.jobsite) creep.memory.jobsite = creep.room.find(FIND_SOURCES)[0].id;

        const target = Game.getObjectById(creep.memory.jobsite)
        console.log(bucket)


        if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, { visualizePathStyle: { stroke: "#ffaa00" } });
        }


    },
};

module.exports = roleMiner;
