import { useState } from "react";

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
    return (
        <>
            <div onClick={() => setShowModal(true)}>{buttonElement}</div>
            {showModal && (
                <>
                    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
                        <div className="relative my-6 mx-auto w-auto max-w-3xl">
                            {/*content*/}
                            <div className="relative flex w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
                                {/*header*/}
                                <div className="flex items-start justify-between rounded-t border-b border-solid border-slate-200 p-5">
                                    <h3 className="text-3xl font-semibold">
                                        {header}
                                    </h3>
                                    <button
                                        className="float-right ml-auto border-0 bg-transparent p-1 text-3xl font-semibold leading-none text-black opacity-5 outline-none focus:outline-none"
                                        onClick={() => setShowModal(false)}
                                    >
                                        <span className="block h-6 w-6 bg-transparent text-2xl text-black opacity-5 outline-none focus:outline-none">
                                            x
                                        </span>
                                    </button>
                                </div>
                                {/*body*/}
                                <div className="relative flex-auto p-6">
                                    {body}
                                </div>
                                {/*footer*/}
                                <div className="flex items-center justify-end rounded-b border-t border-solid border-slate-200 p-6">
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
