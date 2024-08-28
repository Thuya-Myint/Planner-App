import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import todo from "../assets/images/todo.svg";
import progress from "../assets/images/progress.svg";
import completed from "../assets/images/completed.svg";
import logout from "../assets/images/logout1.svg";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import note from "../assets/images/note.svg";
import barista from "../assets/images/barista.svg";
import mindfulness from "../assets/images/mindFulness.svg";
import noti from "../assets/images/noti2.svg";
import addTask from "../assets/images/addTask.svg";
import editIcon from '../assets/images/edit.svg';
import deleteIcon from '../assets/images/delete.svg';
import database from "../config/firebase";
import { getDatabase, onValue, ref } from 'firebase/database';
import deletel from '../assets/images/deletel.svg';
import { PulseSpinner } from "react-spinners-kit";
import axios from "axios";
const Home = () => {
    const token = JSON.parse(localStorage.getItem("x-access-token"));
    const username = localStorage.getItem("username");
    const navigate = useNavigate();
    const [dateTime, setDateTime] = useState(new Date());
    const [visibleNoti, setVisibleNoti] = useState(false);
    const [bgColor, setBgColor] = useState("bg-yellow-300");
    const [border, setBorder] = useState("border-yellow-300");
    const [addingTask, setAddTask] = useState(false);
    const [todolist, setTodolist] = useState([]);
    const [prolist, setProlist] = useState([]);
    const [comlist, setComlist] = useState([]);
    const [notilist, setNotilist]=useState([]);
    const [todoDragEnter, setTodoDragEnter] = useState(false);
    const [proDragEnter, setProDragEnter] = useState(false);
    const [comDragEnter, setComDragEnter] = useState(false);
    const [notiDiv, setNotiDiv] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [task, setTask] = useState("");
    const [descript, setDescript] = useState("");
    const [draggable, setDraggable] = useState(true);
    const [edit, setEdit] = useState(false);
    const [spinnerColor, setSpinnerColor]=useState("#fddf47");
    const [loading, setLoading]=useState(false);
    const dragref = useRef();
    const clickref=useRef();
    const [handleSource, setHandleSource]=useState();
    const dataRef=useRef();
    dataRef.current="todo";
    const dbRef = ref(database, 'todos');
    const dbRef1=ref(database, 'noti');
    const dbRef2=ref(database, 'progress');
    const dbRef3=ref(database, 'completed');


    const nowDate = dateTime.toLocaleDateString("en-us", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const nowTime = dateTime.toLocaleTimeString("en-us", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,


    };
    const handleDragLeave = (desti) => {
        if (!isDragging) {
            setTodoDragEnter(false);
            setProDragEnter(false);
            setComDragEnter(false);
        }
        if (desti === 'todo')
            setTodoDragEnter(!todoDragEnter);
        else if (desti === 'pro')
            setProDragEnter(!proDragEnter);
        else if (desti === 'com')
            setComDragEnter(!comDragEnter);
    }
    const handleDragEnter = (desti) => {
        if (desti === 'todo')
            setTodoDragEnter(!todoDragEnter);
        else if (desti === 'pro')
            setProDragEnter(!proDragEnter);
        else if (desti === 'com')
            setComDragEnter(!comDragEnter);
    }
    const checkTokenExists = () => {
        if (!token || !username) {
            navigate("/");
            window.location.reload();
        }
    };
    useEffect(() => {
        checkTokenExists();
        fetchDatalist();
        getNoti();
        const unsubscribe=onValue(dbRef, snapshot=>{
            const data=snapshot.val();
            if(data){
                getTodolist();
                getNoti();
            }
        })
        const unsubscribe1=onValue(dbRef1, snapshot=>{
            const data=snapshot.val();
            if(data){
                getNoti();
            }
        })
        const unsubscribe2=onValue(dbRef2, snapshot=>{
            const data=snapshot.val();
            if(data){
                getProlist();
                getNoti();
            }
        })
        const unsubscribe3=onValue(dbRef3, snapshot=>{
            const data=snapshot.val();
            if(data){
                getComlist();
                getNoti();
            }
        })
        const timer = setInterval(() => {
            setDateTime(new Date());
        }, 1000);
        return () =>{ clearInterval(timer);
            unsubscribe();
            unsubscribe1();
            unsubscribe2();
            unsubscribe3();
        };
    }, [navigate, token, username]);

    const setColor = (bg, border, Ref, spinColor) => {
        setSpinnerColor(spinColor);
        setBgColor(bg);
        setBorder(border);
        if(Ref==="todo"){
            getTodolist();
            setHandleSource("todo");
        }
        else if(Ref==="progress"){
            getProlist();
            setHandleSource("progress");
        }
        else if(Ref==="completed"){
            getComlist();
            setHandleSource("completed");
        }
    };
    const handleOutClick = (e) => {
        setVisibleNoti(false);
        setNotiDiv('');
    };
    const handleInsideClick = (e) => {
        e.stopPropagation();
    };
    const handleNotiDivClick = () => {
        setVisibleNoti(!visibleNoti);
        setNotiDiv('active')
    }
    const handleDragStart = (index) => {
        setIsDragging(true);
        dragref.current = index;
    }
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') addData();
    }
    const fetchDatalist=()=>{
        getTodolist();
        getProlist();
        getComlist();

    }
    const getTodolist = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/todo/`,
                    {
                        headers: {
                            "x-access-token": token,
                        },
                    });
                if(response?.data?.dataSet){
                    const toDoArray = Object.values(response.data.dataSet);
                    setTodolist(toDoArray);
                }
            } catch (error) {
                console.error(error);
            }
    };
    const getProlist = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/progress/`,
                {
                    headers: {
                        "x-access-token": token,
                    },
                });
            if(response?.data?.dataSet){
                const toDoArray = Object.values(response.data.dataSet);
                setProlist(toDoArray);
            }
        } catch (error) {
            console.error(error);
        }
};
const getComlist = async () => {
    try {
        const response = await axios.get(`http://localhost:8080/api/completed/`,
            {
                headers: {
                    "x-access-token": token,
                },
            });
        if(response?.data?.dataSet){
            const toDoArray = Object.values(response.data.dataSet);
            setComlist(toDoArray);
        }
    } catch (error) {
        console.error(error);
    }
};
    const addNoti=async(action)=>{
        try {
            await axios.post("http://localhost:8080/api/noti/",{
                name:action+" "+task+" '",
            },{
                headers:{
                    'x-access-token':token
                }
            })
        } catch (error) {
            console.error(error);
        }

    }
    const addData = async () => {
        if (task && addingTask) {
            try {
                const response = await axios.post(`http://localhost:8080/api/${!handleSource?"todo":handleSource}/`,
                    {
                        task: task,
                        description: descript,
                    }, {
                    headers: {
                        "x-access-token": token,
                    },
                },);
                addNoti("Plan '");
                setTask("");

                setDescript("");
                setAddTask(false);

            } catch (error) {
                console.error(error);
            }
        }
    }
    const deleteTask = async (id,task) => {
        try {
            await axios.delete(`http://localhost:8080/api/${!handleSource?"todo":handleSource}/${id}`, {
                headers: {
                    'x-access-token': token
                }
            })
            addNoti(`Deleted ' ${task} `);
        } catch (error) {
            console.error(error);
        }
    }
    const updateTask=async()=>{
        try{
            const {id}=clickref.current;
            await axios.put(`http://localhost:8080/api/${!handleSource?"todo":handleSource}/${id}`,{
                task:task,
                description:descript,
                name:username
            },{
                headers:{
                    'x-access-token':token
                }
            });
            addNoti(`Updated ' `)
            setTask("");
            setDescript("");
            setEdit(false);
            setDraggable(true);
        }catch(error){
            console.log(error);
        }
    }
    const getNoti=async()=>{
        try {
            const notiData=await axios.get("http://localhost:8080/api/noti/",{
                headers:{
                    'x-access-tokens':token,
                }
            });
            if(notiData?.data?.data){
                setNotilist(Object.values(notiData?.data?.data));
            }
        } catch (error) {
            console.error(error);
        }
    }
    const deleteNoti=async(id)=>{
        try {
            await axios.delete(`http://localhost:8080/api/noti/${id}`, {
                headers:{
                    'x-access-token':token
                }
            })
        } catch (error) {
            console.log(error);
        }
    }
    const deleteAll=async()=>{
        try {
            await axios.delete('http://localhost:8080/api/noti/',{
                headers:{
                    'x-access-token':token
                }
            })
        } catch (error) {
            console.error(error);
        }
    }
    const handleEditTask = async (id, index, task, descript) => {
        clickref.current = {index, id}
        setTask(task);
        setDescript(descript);
        setDraggable(false);
        setEdit(true);
    }
    const handleCancelEdit = () => {
        setTask("");
        setDescript("");
        setEdit(false);
        setDraggable(true);
    }

    return (
        <div className="w-[100%] h-screen flex relative bg-slate-200">
        {
            loading?
            <div className="absolute w-full h-full bg-black bg-opacity-30 z-30 flex justify-center items-center">
                <PulseSpinner loading={loading} color={spinnerColor} size={40}/>
            </div>:""
        }
            <div className="w-[30%] h-screen py-5 px-5 custom-font-1 flex flex-col items-center">
                <div className="text-center">Name - {username}</div>
                <div
                    className={`w-[70%] border-b-4 transition-all duration-[200ms] ${border} mt-5`}
                ></div>
                <div className="w-full flex items-center h-[50%]">
                    <div className={`w-full h-full p-4 rounded-md`}>
                        <div
                            className={`transition-all duration-[200ms] ${todoDragEnter ? "bg-yellow-200 px-4 rounded-lg" : ""} flex items-center justify-between h-1/3 cursor-pointer`}
                            onClick={() => setColor("bg-yellow-300", "border-yellow-400", "todo", "#fddf47")}
                            onDragEnter={() => handleDragEnter('todo')} onDragLeave={() => handleDragLeave('todo')}
                        >
                            <img src={todo} alt="to do task" className=" w-8" />
                            <div className="">Task To Do</div>
                            <div className="w-4 h-4 rounded-full bg-yellow-200"></div>
                        </div>
                        <div
                            className={`transition-all duration-[200ms] ${proDragEnter ? "bg-purple-200 px-4 rounded-md" : ""} flex items-center justify-between h-1/3 cursor-pointer w-full`}
                            onClick={() => setColor("bg-purple-400", "border-purple-400","progress","#c084fc")}
                            onDragEnter={() => handleDragEnter('pro')} onDragLeave={() => handleDragLeave('pro')}
                        >
                            <img src={progress} alt="to do task" className=" w-8" />
                            <div>Task In Progress</div>
                            <div className=" w-4 h-4 rounded-full bg-purple-400"></div>
                        </div>
                        <div
                            className={`transition-all duration-[200ms] ${comDragEnter ? "bg-teal-300 px-4 rounded-md" : ""} flex items-center justify-between h-1/3 cursor-pointer`}
                            onClick={() => setColor("bg-teal-500", "border-teal-500","completed","#15b8a5")}
                            onDragEnter={() => handleDragEnter('com')} onDragLeave={() => handleDragLeave('com')}
                        >
                            <img src={completed} alt="to do task" className=" w-8" />
                            <div>Task Completed</div>
                            <div className=" w-4 h-4 rounded-full bg-teal-500"></div>
                        </div>
                    </div>
                </div>
                <div className="h-[30%] w-full px-10">
                    <Slider {...settings}>
                        <div className="">
                            <img
                                src={note}
                                alt="Notes"
                                className=" w-[150px] m-auto h-[150px]"
                            />
                        </div>
                        <div className="">
                            <img
                                src={barista}
                                alt="Notes"
                                className=" w-[150px] m-auto h-[150px]"
                            />
                        </div>
                        <div className="">
                            <img
                                src={mindfulness}
                                alt="Notes"
                                className=" w-[150px] m-auto h-[150px]"
                            />
                        </div>
                    </Slider>
                </div>
                <div className="w-full h-[10%] flex items-end">
                    <div
                        className={`w-full h-1/2 ${bgColor} transition-all duration-[200ms] rounded-md flex items-center justify-center  cursor-pointer`}
                    >
                        <img src={logout} alt="Log-Out" className=" w-6 mr-2" />
                        Log Out
                    </div>
                </div>
            </div>

            <div className="w-[70%] p-2">
                <div
                    className={`w-full border-2 border-x-2 ${border} transition-all duration-[200ms] h-[100%] p-2 rounded-lg shadow-lg`}
                >
                    <div className={`w-full h-[7%] ${bgColor} flex rounded-md`}>
                        <div className="w-[300px] h-full custom-font-1 px-4 rounded-md flex flex-col justify-center cursor-pointer">
                            <div>{nowDate}</div>
                            <div>{nowTime}</div>
                        </div>

                        <div className=" w-[840px] flex justify-end mt-[5.2px] mr-3 h-[40px]">
                            <div
                                className={`cursor-pointer rounded-full flex items-center noti-div ${bgColor} ${notiDiv}`}
                                onClick={handleNotiDivClick}
                            >
                                <img
                                    src={noti}
                                    alt=""
                                    className="w-[40px] noti-con absolute top-[23px] right-[29px]"
                                />
                                <div className="noti-text custom-font-1">Notification</div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-[90%] mt-4 flex overflow-auto p-2 flex-wrap gap-2">
                        {
                            bgColor==="bg-yellow-300"?
                            <div className={`w-[24%] h-[200px] bg-white rounded-md flex items-center justify-center custom-font cursor-pointer border-2 ${border} mb-4`}>
                            {addingTask ? (
                                <div className=" flex flex-col justify-center items-center">
                                    <input
                                        type="text"
                                        className="py-2 px-2 custom-font-1 mb-2 outline-none bg-slate-100 w-[90%]"
                                        placeholder="Task Name"
                                        value={task}
                                        onChange={(e) => setTask(e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        className="py-2 px-2 custom-font-1 mb-2 outline-none bg-slate-100 w-[90%]"
                                        placeholder="Description"
                                        value={descript}
                                        onChange={(e) => setDescript(e.target.value)}
                                        onKeyDown={(e) => handleKeyPress(e)}
                                    />
                                    <div className="w-full p-2 custom-font-1 mt-4">
                                        <button className="w-[80px] h-[30px] bg-yellow-200 mr-2 rounded-sm" onClick={addData}>
                                            add
                                        </button>
                                        <button
                                            className="w-[80px] h-[30px] bg-yellow-500 rounded-sm"
                                            onClick={() => setAddTask(false)}
                                        >
                                            cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div onClick={() => setAddTask(true)}>
                                    <img src={addTask} alt="" className="w-[80px]" />
                                </div>
                            )}
                        </div>:""
                        }

                        {
                            !handleSource || handleSource==="todo"?
                                todolist.map((tasks, index) => (
                                    !tasks.task?"":
                                    <div key={index} className={`${isDragging ? index === dragref.current ? "opacity-0 h-[50px]" : "" : ""} w-[24%] h-[200px] bg-slate-100 rounded-md flex flex-col justify-start  cursor-pointer text-wrap p-1 font-semibold mb-4 hover:shadow-md transition-all duration-[200px] relative card-del-edit`} draggable={draggable} onDragStart={() => handleDragStart(index)} onDragEnd={() => setIsDragging(false)}>
                                        {
                                            edit && index === clickref.current.index ?
                                                <div>
                                                    <input
                                                        type="text"
                                                        className={`p-2 mb-2 outline-none w-full ${bgColor} rounded-t-md`}
                                                        placeholder="Task Name"
                                                        value={task}
                                                        onChange={(e) => setTask(e.target.value)}
                                                        autoFocus
                                                    />
                                                    <input
                                                        type="text"
                                                        className="p-2 mb-2 outline-none w-full bg-white"
                                                        placeholder="Description"
                                                        value={descript}
                                                        onChange={(e) => setDescript(e.target.value)}
                                                        onKeyDown={(e) => handleKeyPress(e)}
                                                    />
                                                    <div className="w-full p-2 mt-4 flex justify-center">
                                                        <button className="w-[80px] h-[30px] bg-yellow-200 mr-2 rounded-sm" onClick={updateTask}>
                                                            Update
                                                        </button>
                                                        <button
                                                            className="w-[80px] h-[30px] bg-yellow-500 rounded-sm"
                                                            onClick={handleCancelEdit}
                                                        >
                                                            cancel
                                                        </button>
                                                    </div>
                                                </div>
                                                :
                                                <div>
                                                    <div className={`${bgColor} text-center p-2 transition-all duration-[200ms] rounded-t-md`} >Task - {tasks.task}</div>
                                                    <div className=" p-2 italic font-medium"> - description <span className=" not-italic">({tasks.description})</span></div>
                                                    <div className="absolute flex left-[40%] top-[80%] translate-x-0 translate-y-0 edit-del transition-all duration-[200ms]">
                                                        <img src={deleteIcon} alt="" className="w-6" onClick={() => deleteTask(tasks.id,tasks.task)} />
                                                        <img src={editIcon} alt="" className="w-7" onClick={() => handleEditTask(tasks.id, index, tasks.task, tasks.description)} />
                                                    </div>
                                                </div>

                                        }
                                    </div>
                                )):""
                        }
                        {
                            handleSource==="progress"?
                            prolist.map((tasks, index) => (
                                !tasks.task?"":
                                    <div key={index} className={`${isDragging ? index === dragref.current ? "opacity-0 h-[50px]" : "" : ""} w-[24%] h-[200px] bg-slate-100 rounded-md flex flex-col justify-start  cursor-pointer text-wrap p-1 font-semibold mb-4 hover:shadow-md transition-all duration-[200px] relative card-del-edit`} draggable={draggable} onDragStart={() => handleDragStart(index)} onDragEnd={() => setIsDragging(false)}>
                                        {
                                            edit && index === clickref.current.index ?
                                                <div>
                                                    <input
                                                        type="text"
                                                        className={`p-2 mb-2 outline-none w-full ${bgColor} rounded-t-md`}
                                                        placeholder="Task Name"
                                                        value={task}
                                                        onChange={(e) => setTask(e.target.value)}
                                                        autoFocus
                                                    />
                                                    <input
                                                        type="text"
                                                        className="p-2 mb-2 outline-none w-full bg-white"
                                                        placeholder="Description"
                                                        value={descript}
                                                        onChange={(e) => setDescript(e.target.value)}
                                                        onKeyDown={(e) => handleKeyPress(e)}
                                                    />
                                                    <div className="w-full p-2 mt-4 flex justify-center">
                                                        <button className="w-[80px] h-[30px] bg-yellow-200 mr-2 rounded-sm" onClick={updateTask}>
                                                            Update
                                                        </button>
                                                        <button
                                                            className="w-[80px] h-[30px] bg-yellow-500 rounded-sm"
                                                            onClick={handleCancelEdit}
                                                        >
                                                            cancel
                                                        </button>
                                                    </div>
                                                </div>
                                                :
                                                <div>
                                                    <div className={`${bgColor} text-center p-2 transition-all duration-[200ms] rounded-t-md`} >Task - {tasks.task}</div>
                                                    <div className=" p-2 italic font-medium"> - description <span className=" not-italic">({tasks.description})</span></div>
                                                    <div className="absolute flex left-[40%] top-[80%] translate-x-0 translate-y-0 edit-del transition-all duration-[200ms]">
                                                        <img src={deleteIcon} alt="" className="w-6" onClick={() => deleteTask(tasks.id,tasks.task)} />
                                                        <img src={editIcon} alt="" className="w-7" onClick={() => handleEditTask(tasks.id, index, tasks.task, tasks.description)} />
                                                    </div>
                                                </div>

                                        }
                                    </div>
                                )):""
                        }
                        {
                            handleSource==="completed"?
                            comlist.map((tasks, index) => (

                                    <div key={index} className={`${isDragging ? index === dragref.current ? "opacity-0 h-[50px]" : "" : ""} w-[24%] h-[200px] bg-slate-100 rounded-md flex flex-col justify-start  cursor-pointer text-wrap p-1 font-semibold mb-4 hover:shadow-md transition-all duration-[200px] relative card-del-edit`} draggable={draggable} onDragStart={() => handleDragStart(index)} onDragEnd={() => setIsDragging(false)}>
                                        {
                                            edit && index === clickref.current.index ?
                                                <div>
                                                    <input
                                                        type="text"
                                                        className={`p-2 mb-2 outline-none w-full ${bgColor} rounded-t-md`}
                                                        placeholder="Task Name"
                                                        value={task}
                                                        onChange={(e) => setTask(e.target.value)}
                                                        autoFocus
                                                    />
                                                    <input
                                                        type="text"
                                                        className="p-2 mb-2 outline-none w-full bg-white"
                                                        placeholder="Description"
                                                        value={descript}
                                                        onChange={(e) => setDescript(e.target.value)}
                                                        onKeyDown={(e) => handleKeyPress(e)}
                                                    />
                                                    <div className="w-full p-2 mt-4 flex justify-center">
                                                        <button className="w-[80px] h-[30px] bg-yellow-200 mr-2 rounded-sm" onClick={updateTask}>
                                                            Update
                                                        </button>
                                                        <button
                                                            className="w-[80px] h-[30px] bg-yellow-500 rounded-sm"
                                                            onClick={handleCancelEdit}
                                                        >
                                                            cancel
                                                        </button>
                                                    </div>
                                                </div>
                                                :
                                                <div>
                                                    <div className={`${bgColor} text-center p-2 transition-all duration-[200ms] rounded-t-md`} >Task - {tasks.task}</div>
                                                    <div className=" p-2 italic font-medium"> - description <span className=" not-italic">({tasks.description})</span></div>
                                                    <div className="absolute flex left-[40%] top-[80%] translate-x-0 translate-y-0 edit-del transition-all duration-[200ms]">
                                                        <img src={deleteIcon} alt="" className="w-6" onClick={() => deleteTask(tasks.id,tasks.task)} />
                                                        <img src={editIcon} alt="" className="w-7" onClick={() => handleEditTask(tasks.id, index, tasks.task, tasks.description)} />
                                                    </div>
                                                </div>

                                        }
                                    </div>
                                )):""
                        }
                    </div>
                </div>
            </div>
            {visibleNoti ? (
                <div
                    className="w-full h-full bg-black bg-opacity-30 absolute top-0 left-0 flex flex-col justify-center items-center cursor-pointer noti-modal"
                    onClick={(e) => handleOutClick(e)}
                >

                    <div
                        className="w-[50%] h-[80%] overflow-auto bg-white bg-opacity-100 shadow-lg p-4 border-2 border-slate-300 rounded-md z-30"
                        onClick={(e) => {
                            handleInsideClick(e);
                        }}
                    >
                    <div className="w-full flex justify-end">
                        <div className="w-fit text-right text-lg bg-red-500 text-white px-4 py-2 transition-all duration-[200ms] hover:bg-red-400 hover:text-slate-600 rounded-md mb-2 cursor-pointer " onClick={deleteAll}>Delete All</div>
                    </div>
                        {
                            notilist.map((noti, index)=>(
                                !noti.name?"":
                                <div className={`flex justify-between items-center p-4 ${index!==notilist.length-1?" border-b-2 ":""} hover:bg-slate-200 transition-all duration-[200ms] noti-info-div` }>
                                        <div className="w-[80%] noti-name transition-all duration-[150ms]">{noti.name}</div>
                                    <div className="">
                                        <div>{noti.date}</div>
                                        <div>{noti.time}</div>
                                    </div>
                                    <div className="delete-div">
                                        <img src={deletel} className="delete-img w-8" alt="delete notification"
                                            onClick={()=>deleteNoti(noti.id)}
                                        />
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            ) : (
                ""
            )}
        </div>
    );
};

export default Home;
