import React, { useEffect, useRef, useState } from "react";
import deleteIcon from "../../assets/images/delete-svgrepo-com.svg";
import editIcon from "../../assets/images/edit-svgrepo-com.svg";
import axios from "axios";

const ThreeContainers = ({ title, dataList, bgColor, clas, source, token, plan, onEditClick, drgEntSrc, dragDrop, refToHandle, entHandler, srcEntRef }) => {
    const dragRef = useRef(null);
    const [dragging, isDragging] = useState(false);
    const [entering, isEntering] = useState(false);
    const [drgEntSource, setDrgEntSource] = useState("");
    const [id, setId] = useState();
    const [task, setTask] = useState();
    const [descri, setDescri] = useState();
    const [drgFrom, setDrgFrom] = useState();

    const addNoti = async (task) => {
        try {
            await axios.post("http://localhost:8080/api/noti/", {
                task: plan + " " + task + " '",
            }, {
                headers: {
                    'x-access-token': token
                }
            })
        } catch (error) {
            console.error(error);
        }

    }
    const deleteTask = async (id, task) => {
        try {
            await axios.delete(`http://localhost:8080/api/${!source ? "todo" : source}/${id}`, {
                headers: {
                    'x-access-token': token
                }
            })
            addNoti(`Deleted ' ${task} `);
        } catch (error) {
            console.error(error);
        }
    }
    const handleDragStart = (id, dragSrc, tas, descript) => {
        setDrgFrom(dragSrc);
        setId(id);
        setTask(tas);
        setDescri(descript);
        isDragging(true);
        dragDrop(id, tas, descript, dragSrc, drgEntSource);
    };
    const handleDragEnter = (dsrc) => {
        isEntering(true);
        entHandler(dsrc);
        setDrgEntSource(dsrc);
    }
    const handleDragOver = (e) => {
        e.preventDefault();
    }
    const handleDragLeave = (e) => {
        e.preventDefault();
        const rect = e.currentTarget.getBoundingClientRect();
        const { clientX, clientY } = e;
        if (clientX < rect.left ||
            clientX >= rect.right ||
            clientY < rect.top ||
            clientY >= rect.bottom)
            isEntering(false)
    }
    const handleDrop = async (e) => {
        e.preventDefault();
        const { id, pTask, pDescript, fromRef } = refToHandle.current;
        const { drgEntSrc } = srcEntRef.current;
        if (fromRef !== drgEntSrc) {
            try {
                await axios.delete(`http://localhost:8080/api/${fromRef}/${id}`, {
                    headers: {
                        'x-access-token': token
                    }
                });
                await axios.post(`http://localhost:8080/api/${drgEntSrc}/`, {
                    id: id,
                    task: pTask,
                    description: pDescript,
                }, {
                    headers: {
                        'x-access-token': token
                    }
                })
                setDrgFrom("");
                setId("");

            } catch (error) {
                console.error("Delete task error on drop:", error);
            }

        }
        isEntering(false);
    };
    const handleDragEnd = (e) => {
        e.preventDefault();
        isDragging(false);
    }
    return (
        <div className={`transition-all duration-[200ms] w-[29.5%] h-[600px] ${entering && srcEntRef.current.drgEntSrc != refToHandle.fromRef ? "bg-black bg-opacity-30 p-2 rounded-md shadow-xl" : ""}`} onDragEnter={() => handleDragEnter(drgEntSrc)} onDragLeave={(e) => handleDragLeave(e)}
            onDragOver={(e) => handleDragOver(e)} onDrop={(e) => handleDrop(e)}>
            <div className={`${bgColor} h-[8%] flex items-center pl-5 text-lg`}>
                {title}
            </div>
            {dataList.map((data, index) => (
                data ?
                    <div
                        key={index}
                        className={` cursor-pointer flex w-full  h-[5%] text-lg items-center px-2 py-6 ${index < dataList.length - 1 ? "border-b-[1px] border-slate-400" : ""}
                    ${clas} ${dragging ? id == data.id ? "opacity-0 transform scale-150" : "" : ""}`} draggable onDragStart={() => handleDragStart(data.id, source, data.task, data.description)} onDragEnd={(e) => handleDragEnd(e)}
                    >
                        <div className="w-[15%] text-start text-white list">
                            {index + 1}
                        </div>
                        <div className="w-[50%] text-start text-slate-50 listData">
                            {data.task}
                        </div>

                        <div className="w-[35%] text-end text-slate-300 listDesc">
                            {data.description}
                        </div>
                        <div className="hidden del-edt items-center h-full">
                            <img
                                src={deleteIcon}
                                alt="delete Icon"
                                className="w-6 mr-2 cursor-pointer"
                                onClick={() => deleteTask(data.id, data.task)}
                            />
                            <img
                                src={editIcon}
                                alt="edit Icon"
                                className="w-6 cursor-pointer"
                                onClick={() => onEditClick(true, data.task, data.description, data.id, source)}
                            />
                        </div>
                    </div> : ""
            ))}
        </div>
    );
};

export default ThreeContainers;
