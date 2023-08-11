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
                            <p>Waves completed: </p>
                            <p className="text-right">
                                {reward.afkWaves.toFixed(0)}
                            </p>
                            <p>Credits earned: </p>
                            <p className="text-right">
                                {reward.creditReward.toFixed(0)}
                            </p>
                            <p>{resourceKeys.metal} earned: </p>
                            <p className="text-right">
                                {(
                                    reward.craftingRewards.metal *
                                    Math.floor(reward.afkWaves / 10)
                                ).toFixed(0)}
                            </p>
                            <p>{resourceKeys.energy} earned: </p>
                            <p className="text-right">
                                {(
                                    reward.craftingRewards.energy *
                                    Math.floor(reward.afkWaves / 10)
                                ).toFixed(0)}
                            </p>
                            <p>{resourceKeys.gilding} earned: </p>
                            <p className="text-right">
                                {(
                                    reward.craftingRewards.gilding *
                                    Math.floor(reward.afkWaves / 10)
                                ).toFixed(0)}
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
