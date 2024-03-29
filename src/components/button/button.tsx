import React from "react";
import { gradientPrimary, gradientSecondary } from "~/styles/cssVariables";

export interface IButton {
    color?: "yellow" | "violet";
    variant?: "filled" | "outlined";
    className?: string;
    children?: React.ReactNode;
    disabled?: boolean;
    onClick?: () => void;
}

export const Button: React.FC<IButton> = ({
    children,
    color = "violet",
    variant = "filled",
    className = "",
    disabled = false,
    onClick,
}) => {
    const filledClassViolet = `${gradientPrimary} disabled:bg-none hover:bg-gradient-to-tl text-white active:bg-violet-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`;
    const outlinedClassViolet = `text-indigo-500 bg-transparent disabled:text-slate-700 disabled:border-slate-700 border border-indigo-500 hover:bg-indigo-500 hover:text-white active:bg-violet-600 font-bold uppercase text-xs px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`;
    const filledClassYellow = `${gradientSecondary} disabled:bg-none hover:bg-gradient-to-tl text-black active:bg-yellow-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`;
    const outlinedClassYellow = `text-yellow-500 bg-transparent disabled:text-slate-700 disabled:border-slate-700 border border-yellow-500 hover:bg-yellow-500 hover:text-white active:bg-yellow-600 font-bold uppercase text-xs px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`;
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
            className={classes + className}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    );
};
