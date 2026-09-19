window.DR = window.DR || {};

(function attachLevel(DR) {
  "use strict";

  const U = DR.Utils;

  class LevelGenerator {
    static generate(seed) {
      const rng = U.mulberry32(seed);
      const layers = [];
      for (let layer = 1; layer <= 3; layer += 1) {
        const count = U.randInt(rng, 3, 5);
        const rooms = [];
        let combatCount = 0;
        for (let i = 0; i < count; i += 1) {
          let type = "combat";
          if (i !== 0) {
            const roll = rng();
            if (roll < 0.18) type = "event";
            else if (roll < 0.34) type = "blessing";
          }
          if (type === "combat") combatCount += 1;
          rooms.push({
            id: `L${layer}-${i + 1}`,
            layer,
            index: i + 1,
            type,
            seed: Math.floor(rng() * 1_000_000),
          });
        }
        if (combatCount < 2 && rooms.length > 1) rooms[rooms.length - 1].type = "combat";
        layers.push({ layer, rooms });
      }
      return { seed, layers };
    }
  }

  DR.LevelGenerator = LevelGenerator;
})(window.DR);
