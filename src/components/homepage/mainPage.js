import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ThreeContainers from "./ThreeContainers";
import TopBar from "./top";
import RightSide from "./rightSide";
import axios from "axios";
import database from "../../config/firebase";
import { onValue, ref } from "firebase/database";
const MainBody = () => {
    const token = JSON.parse(localStorage.getItem("x-access-token"));
    const username = localStorage.getItem("username");
    const navigate = useNavigate();
    const [todolist, setTodolist] = useState([]);
    const [prolist, setProlist] = useState([]);
    const [comlist, setComlist] = useState([]);
    const [notilist, setNotilist] = useState([]);
    const todoRef = ref(database, 'todos');
    const notiRef = ref(database, 'noti');
    const proRef = ref(database, 'progress');
    const comRef = ref(database, 'completed');
    const [editing, setEditing] = useState(false);
    const [task, setTask] = useState();
    const [description, setDescription] = useState();
    const [id, setId] = useState();
    const [source, setSource] = useState();
    const [dgSrc, setDgSrc] = useState();
    const dndRef = useRef();
    const entSrcRef = useRef();
    const checkTokenExists = () => {
        if (!token || !username) {
            navigate("/");
            window.location.reload();
        }
    };
    useEffect(() => {
        checkTokenExists();
        fetchDatalist();
        const unsubscribeToDo = onValue(todoRef, snapshot => {
            const data = snapshot.val();
            if (data) {
                getTodolist();
            }
        })
        const unsubscribeProgress = onValue(proRef, snapshot => {
            const data = snapshot.val();
            if (data) {
                getProlist();
            }
        })
        const unsubscribeCompleted = onValue(comRef, snapshot => {
            const data = snapshot.val();
            if (data) {
                getComlist();
            }
        })
        const unsubscribeNoti = onValue(notiRef, snapshot => {
            const data = snapshot.val();
            if (data) {
                getNoti();
            }
        })
        return () => {
            unsubscribeToDo();
            unsubscribeProgress();
            unsubscribeCompleted();
            unsubscribeNoti();
        }
    }, [token, navigate, username]);

    const fetchDatalist = () => {
        getTodolist();
        getProlist();
        getComlist();
        getNoti();
    };
    const getTodolist = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/todo/`, {
                headers: {
                    "x-access-token": token,
                },
            });
            if (response?.data?.dataSet) {
                // if(response.data.dataSet.hasOwnProperty('placeholder') && response.data.dataSet.placeholder==="")return;
                const toDoArray = Object.values(response.data.dataSet);
                setTodolist(toDoArray.filter(item => item !== ""));

            }
        } catch (error) {
            console.error(error);
        }
    };
    const getProlist = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/progress/`, {
                headers: {
                    "x-access-token": token,
                },
            });
            if (response?.data?.dataSet) {
                const toDoArray = Object.values(response.data.dataSet);
                setProlist(toDoArray);
            }
        } catch (error) {
            console.error(error);
        }
    };
    const getComlist = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/completed/`, {
                headers: {
                    "x-access-token": token,
                },
            });
            if (response?.data?.dataSet) {
                const toDoArray = Object.values(response.data.dataSet);
                setComlist(toDoArray);
            }
        } catch (error) {
            console.error(error);
        }
    };
    const getNoti = async () => {
        try {
            const notiData = await axios.get("http://localhost:8080/api/noti/", {
                headers: {
                    "x-access-token": token,
                },
            });
            if (notiData.data) {
                setNotilist(Object.values(notiData?.data?.data));
            }
        } catch (error) {
            console.error(error);
        }
    };
    const handleEdit = (boolean, tas, desc, id, source) => {
        setEditing(boolean);
        setTask(tas);
        setDescription(desc)
        setId(id);
        setSource(source);
    }
    const handleDragDrop = (id, pTask, pDescript, fromRef) => {
        dndRef.current = { id, pTask, pDescript, fromRef };
    }
    const handleDragEnter = (drgEntSrc) => {
        entSrcRef.current = { drgEntSrc };
    }
    return (
        <div className="w-screen h-screen main-body relative overflow-hidden">
            <div className="h-[8%]">
                <TopBar notifications={notilist} />
            </div>
            <div className="w-full h-[92%] flex gap-16 text-center p-4">

                <ThreeContainers
                    title={"To Do List"}
                    dataList={todolist}
                    bgColor={"to-do-div"}
                    clas={"todo-Clas"}
                    source={"todo"}
                    token={token}
                    plan={"Plan To "}
                    onEditClick={handleEdit}
                    drgEntSrc={"todo"}
                    dragDrop={handleDragDrop}
                    refToHandle={dndRef}
                    entHandler={handleDragEnter}
                    srcEntRef={entSrcRef}
                />
                <ThreeContainers
                    title={"In Progress List"}
                    dataList={prolist}
                    bgColor={"pro-div"}
                    clas={"pro-Clas"}
                    source={"progress"}
                    token={token}
                    plan={"Progessing "}
                    onEditClick={handleEdit}
                    drgEntSrc={"progress"}
                    dragDrop={handleDragDrop}
                    refToHandle={dndRef}
                    entHandler={handleDragEnter}
                    srcEntRef={entSrcRef}
                />
                <ThreeContainers
                    title={"Completed List"}
                    dataList={comlist}
                    bgColor={"com-div"}
                    clas={"com-Clas"}
                    source={"completed"}
                    token={token}
                    plan={"Completed "}
                    onEditClick={handleEdit}
                    drgEntSrc={"completed"}
                    dragDrop={handleDragDrop}
                    refToHandle={dndRef}
                    entHandler={handleDragEnter}
                    srcEntRef={entSrcRef}
                />
            </div>
            <RightSide token={token} tokenExists={checkTokenExists} update={editing} setUpdate={setEditing} tas={task} setTas={setTask} desc={description} setDesc={setDescription} id={id} src={source} />
        </div>
    );
};

export default MainBody;
