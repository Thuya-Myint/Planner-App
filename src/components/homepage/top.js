import React from "react";
import { useState, useEffect } from "react";
import notiCon from "../../assets/images/noti2.svg";
import minimize from "../../assets/images/contract-outline.svg";

const TopBar = ({ notifications }) => {
    const userName = localStorage.getItem("username");
    const [visible, setVisible] = useState(false);
    const handleLogOut = () => {
        localStorage.clear();
        window.location.reload();

    }
    return (
        <div className="items-center h-full flex top-bar p-5 text-lg">
            <div className="">
                {userName ? userName.charAt(0).toUpperCase() + userName.slice(1) : ""}
            </div>
            <div className="flex items-center w-full justify-end cursor-pointer" onClick={handleLogOut}>
                Log Out
            </div>
            <img
                src={notiCon}
                alt=""
                className="ml-2 w-10 rounded-full bg-slate-400 cursor-pointer"
                onClick={() => setVisible(true)}
            />

            {visible ? (
                <div
                    className="w-[100vw] h-[100vh] bg-black absolute top-0 left-0 z-40 bg-opacity-45 flex justify-center items-center"
                    onClick={() => setVisible(false)}
                >
                    <div
                        className="w-[60%] h-[60%] bg-white overflow-x-hidden overflow-y-auto p-2"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="h-[90%] text-sm ">
                            <div className="flex justify-between">
                                <div className="text-slate-500">Notifications</div>

                            </div>
                            {notifications.map((noti, index) =>
                                noti ? (
                                    <div
                                        key={index}
                                        className={`noti-paren cursor-pointer flex justify-between transition-all duration-[200ms] items-center p-2 text-black ${index <= notifications.length - 1 ? "border-b-[1px] border-slate-300" : ""} hover:bg-black hover:bg-opacity-20 hover:px-8 `}
                                    >
                                        <div>{index + 1}</div>
                                        <div className="noti-task">{noti.task}</div>
                                        <div>
                                            <div className="text-end">{noti.time}</div>
                                            <div className="text-end">{noti.date}</div>
                                        </div>
                                    </div>
                                ) : (
                                    ""
                                ),
                            )}
                        </div>
                        <div className="flex text-sm absolute gap-10 top-[12%] right-[20%] bg-slate-100 p-4 rounded-t-md">
                            <div className="text-white bg-red-600 w-fit p-2 rounded-sm cursor-pointer">
                                delete all
                            </div>
                            <img
                                src={minimize}
                                alt=""
                                className="w-8 cursor-pointer "
                                onClick={() => setVisible(false)}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                ""
            )}
        </div>
    );
};

export default TopBar;
