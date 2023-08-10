import { gradientTertiery } from "~/styles/cssVariables";

interface IChip {
    active: boolean;
    action: () => void;
    size: "lg" | "sm" | "fit";
    children: React.ReactNode;
}

export const Chip: React.FC<IChip> = ({ active, action, size, children }) => {
    const style = active
        ? `${gradientTertiery} 
          cursor-pointer rounded-md text-center text-black hover:bg-blue-50 hover:text-black`
        : "cursor-pointer rounded-md border border-slate-500 text-center hover:bg-blue-50 hover:text-black";
    const width =
        size === "lg" ? "w-24 py-1" : size == "sm" ? "w-12" : "w-fit p-1";

    return (
        <p onClick={action} className={`${style} ${width}`}>
            {children}
        </p>
    );
};
