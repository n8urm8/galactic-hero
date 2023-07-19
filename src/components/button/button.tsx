import React from "react";

export interface IButton {
    color?: "yellow" | "violet";
    variant?: "filled" | "outlined";
    children?: React.ReactNode;
    disabled?: boolean;
    onClick?: () => void;
}

export const Button: React.FC<IButton> = ({
    children,
    color = "violet",
    variant = "filled",
    disabled = false,
    onClick,
}) => {
    const filledClassViolet = `bg-violet-500 text-white active:bg-violet-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`;
    const outlinedClassViolet = `text-violet-500 bg-transparent border border-violet-500 hover:bg-violet-500 hover:text-white active:bg-violet-600 font-bold uppercase text-xs px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`;
    const filledClassYellow = `bg-yellow-500 text-white active:bg-yellow-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`;
    const outlinedClassYellow = `text-yellow-500 bg-transparent border border-yellow-500 hover:bg-yellow-500 hover:text-white active:bg-yellow-600 font-bold uppercase text-xs px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`;
    const variantClass =
        variant == "outlined"
            ? color == "yellow"
                ? outlinedClassYellow
                : outlinedClassViolet
            : color == "yellow"
            ? filledClassYellow
            : filledClassViolet;
    const classes = `disabled:bg-stone-500 disabled:text-black disabled:border-stone-500 ${variantClass}`;

    return (
        <button
            type="button"
            className={classes}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    );
};
