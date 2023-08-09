import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { Modal } from "../modal";
import { CraftingReward, resourceKeys } from "~/utils/gameTypes";

export const AfkRewards = () => {
    const [reward, setReward] = useState({
        afkWaves: 0,
        creditReward: 0,
        craftingRewards: {} as CraftingReward,
    });

    const afkRewardAPI = api.waveInfo.offlineWaveRewards.useMutation();

    useEffect(() => {
        const fetchRewards = async () => {
            const rewards = await afkRewardAPI.mutateAsync();
            //console.log(rewards);
            if (typeof rewards == "object") {
                setReward(rewards);
            }
        };
        fetchRewards().catch((e) => console.log(e));
    }, []);
    return (
        <>
            {reward.creditReward > 0 && (
                <Modal
                    buttonElement={""}
                    header={"AFK Rewards"}
                    body={
                        <div>
                            <p>Waves completed: {reward.afkWaves}</p>
                            <p>Credits earned: {reward.creditReward}</p>
                            <p>
                                {resourceKeys.metal} earned:{" "}
                                {reward.craftingRewards.metal *
                                    Math.floor(reward.afkWaves / 10)}
                            </p>
                            <p>
                                {resourceKeys.energy} earned:{" "}
                                {reward.craftingRewards.energy *
                                    Math.floor(reward.afkWaves / 10)}
                            </p>
                            <p>
                                {resourceKeys.gilding} earned:{" "}
                                {reward.craftingRewards.gilding *
                                    Math.floor(reward.afkWaves / 10)}
                            </p>
                        </div>
                    }
                    footer={""}
                    autoShow
                />
            )}
        </>
    );
};
