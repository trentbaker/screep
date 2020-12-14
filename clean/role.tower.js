const roleTower = {
    run: (tower) => {
        const toRepair = _.filter(tower.room.find(FIND_MY_STRUCTURES), structure => {
            structure.hits && structure.hitsMax && structure.hits < structure.hitsMax
        })

        _.forEach(toRepair, structure => tower.repair(structure))
    }
}

module.exports = roleTower