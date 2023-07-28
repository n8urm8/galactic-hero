import { createRef, useEffect, useState } from "react";

export interface IModal {
    buttonElement: React.ReactNode;
    header: React.ReactNode;
    body: React.ReactNode;
    footer: React.ReactNode;
}

export const Modal: React.FC<IModal> = ({
    buttonElement,
    header,
    body,
    footer,
}) => {
    const [showModal, setShowModal] = useState(false);
    const modalRef = createRef<HTMLDivElement>();
    useEffect(() => {
        //console.log("modal ref current? ", modalRef.current);
        const handler = (event) => {
            if (!modalRef.current) {
                return;
            }
            if (!modalRef.current.contains(event.target)) {
                setShowModal(false);
            }
        };
        document.addEventListener("click", handler, true);
        return () => {
            document.removeEventListener("click", handler);
        };
    }, [modalRef]);
    return (
        <>
            <div className="cursor-pointer" onClick={() => setShowModal(true)}>
                {buttonElement}
            </div>
            {showModal && (
                <>
                    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
                        <div className="relative my-6 mx-auto w-auto min-w-[300px] max-w-3xl">
                            {/*content*/}
                            <div
                                ref={modalRef}
                                className="relative flex w-full flex-col rounded-lg border-2 bg-stone-600 shadow-lg outline-none focus:outline-none"
                            >
                                {/*header*/}
                                <div className="flex items-start justify-between rounded-t border-b border-solid border-slate-200 p-1">
                                    <h3 className="pt-2 pl-2 text-xl font-semibold text-white">
                                        {header}
                                    </h3>
                                    <button
                                        className="float-right ml-auto border-0 bg-transparent p-1 text-3xl font-semibold leading-none text-white  outline-none focus:outline-none"
                                        onClick={() => setShowModal(false)}
                                    >
                                        <span className="block w-6 bg-transparent text-xl text-white outline-none focus:outline-none">
                                            x
                                        </span>
                                    </button>
                                </div>
                                {/*body*/}
                                <div className="relative flex-auto p-4">
                                    {body}
                                </div>
                                {/*footer*/}
                                <div className="flex items-center justify-end rounded-b border-t border-solid border-slate-200 p-2">
                                    {footer}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
                </>
            )}
        </>
    );
};
