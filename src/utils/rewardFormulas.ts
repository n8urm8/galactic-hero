import { CraftingReward } from "./gameTypes";

export function getWaveCreditReward(wave: number) {
    const reward = wave * (wave / 1000 + 1);

    return Math.round(reward);
}

export function getWaveCraftingReward(wave: number) {
    const reward: CraftingReward = {} as CraftingReward;
    if (wave % 10 != 0) {
        reward.energy = 0;
        reward.metal = 0;
        reward.gilding = 0;
    } else {
        reward.energy = (wave / 5) * (wave / 1000 + 1);
        reward.metal = wave * (wave / 1000 + 1);
        reward.gilding = (wave / 10) * (wave / 1000 + 1);
    }

    return reward;
}
