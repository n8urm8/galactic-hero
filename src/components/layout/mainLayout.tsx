import React from "react";
import { Navbar } from "../navbar";
import { Footer } from "../footer";

interface IMainLayout {
    children: React.ReactNode;
}

export const MainLayout: React.FC<IMainLayout> = ({ children }) => {
    return (
        <>
            <Navbar transparent={true} />
            {children}
            <Footer />
        </>
    );
};
