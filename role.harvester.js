var roleHarvester = {
  /** @param {Creep} creep **/
  run: (creep) => {
    const actions = {
      MINE: () => {
        const sources = creep.room.find(FIND_SOURCES);
        const source = sources[1];
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
          creep.moveTo(source, { visualizePathStyle: { stroke: "#ffaa00" } });
        }
      },
      SELECT_TARGET: () =>
        creep.room.find(FIND_STRUCTURES, {
          filter: (structure) => {
            return (
              [STRUCTURE_SPAWN, STRUCTURE_TOWER, STRUCTURE_EXTENSION, STRUCTURE_STORAGE, STRUCTURE_CONTAINER].includes(
                structure.structureType
              ) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            );
          },
        }),

    };

    if (creep.store.getFreeCapacity() > 0) actions.MINE();
    else {
      const targets = actions.SELECT_TARGET();
      if (targets) {
        if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], {
            visualizePathStyle: { stroke: "#ffffff" },
          });
        }
      }
    }
  },
};

module.exports = roleHarvester;
