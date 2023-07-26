import React, { useState } from "react";
import { Button } from "./button";

export interface IConfirmButton {
    baseText: string;
    confirmText: string;
    onClick: () => void;
    color: "yellow" | "violet";
    disabled?: boolean;
}

export const ConfirmButton: React.FC<IConfirmButton> = ({
    baseText,
    confirmText,
    onClick,
    color,
    disabled = false,
}) => {
    const [confirming, setConfirming] = useState<boolean>(false);

    const handleConfirmClick = () => {
        onClick();
        setConfirming(false);
    };

    return (
        <>
            {!confirming ? (
                <Button
                    color={color}
                    onClick={() => setConfirming(true)}
                    disabled={disabled}
                >
                    {baseText}
                </Button>
            ) : (
                <Button
                    color={color}
                    onClick={handleConfirmClick}
                    className="bg-green-600"
                >
                    {confirmText}
                </Button>
            )}
        </>
    );
};
