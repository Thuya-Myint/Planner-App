import React, { act, useEffect, useRef, useState } from 'react'
import axios from 'axios';
const RightSide = ({ token, tokenExists, update, setUpdate, tas, setTas, desc, setDesc, id, src }) => {
    const [adding, setAdding] = useState(false);
    const [task, setTask] = useState("");
    const [descript, setDescript] = useState("");
    const [source, setSource] = useState("");
    const handleAddTask = () => {
        setAdding(!adding);
    }
    const handleClose = () => {
        if (update) {
            setUpdate(false);
            setTas("");
            setDesc("");
        } else {
            setAdding(false);
            setTask("");
            setDescript("");
        }
    }
    const addData = async (action) => {
        console.log(action);
        if (action === "add") {
            if (task && adding) {
                try {
                    const response = await axios.post(`http://localhost:8080/api/todo/`,
                        {
                            task: task,
                            description: descript,
                        }, {
                        headers: {
                            "x-access-token": token,
                        },
                    });
                    addNoti("Plan '");
                    setAdding(false);

                } catch (error) {
                    console.error(error);
                }
            }
        } else if (action === "update") {
            try {
                await axios.put(`http://localhost:8080/api/${src}/${id}`,
                    {
                        task: tas,
                        description: desc
                    }, {
                    headers: {
                        'x-access-token': token
                    },
                });
                handleClose();
            } catch (error) {
                console.error(error);
            }
        }
    }
    const addNoti = async (action) => {
        try {
            await axios.post("http://localhost:8080/api/noti/", {
                task: action + " " + task + " '",
            }, {
                headers: {
                    'x-access-token': token
                }
            })
            setTask("");
            setDescript("");
        } catch (error) {
            console.error(error);
        }

    }
    return (
        <div className={`transition-all duration-[400ms] w-1/4 h-[100%] right-side absolute top-[10%] ${adding || update ? "right-4" : "right-[-25%]"} `}>

            <div className='text-lg bg-head p-2'>{update ? "Update Task" : "Add Task"}</div>
            <div className='py-2 px-4'>
                <div >Task</div>
                <input value={update ? tas : task || ""} type="text" className=' w-full h-[30px] p-2 mb-2' onChange={(e) => update ? setTas(e.target.value) : setTask(e.target.value)} />
                <div >Description</div>
                <input value={update ? desc : descript || ""} type="text" className=' w-full h-[30px] p-2' onChange={(e) => update ? setDesc(e.target.value) : setDescript(e.target.value)} />
                <div className='flex mt-6 gap-2 font-bold'>
                    <div className=' w-1/2 h-[30px] bg-head flex items-center justify-center cursor-pointer' onClick={() => addData(update ? "update" : "add")}>{update ? "update" : "add"}</div>
                    <div className=' w-1/2 h-[30px]  flex items-center justify-center bg-slate-100 cursor-pointer' onClick={handleClose}>Cancel</div>
                </div>

            </div>
            <div className={`transition-all duration-[400ms] absolute left-[-10%] cursor-pointer bg-white w-[30px] h-full ${adding || update ? "hidden" : "flex"}  flex-col justify-center items-center top-0`} onClick={handleAddTask}>
                <div>A</div>
                <div>D</div>
                <div>D</div>
                <div> - </div>
                <div>T</div>
                <div>A</div>
                <div>S</div>
                <div>K</div>
            </div>
            <div></div>
        </div>
    )
}

export default RightSide
