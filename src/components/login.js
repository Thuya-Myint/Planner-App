import React, { useState, useRef } from "react";
import image from "../assets/images/login.jpg";
import show from "../assets/images/eye-outline.svg";
import hide from "../assets/images/eye-off-outline.svg";
import reminder from "../assets/images/reminder.svg";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { PulseSpinner } from "react-spinners-kit";
const Login = () => {

    const [login, setLogin] = useState(true);
    const [entering, setEntering] = useState(false);
    const [pentering, setPentering] = useState(false);
    const [name, setName] = useState("");
    const [pass, setPassword] = useState("");
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);
    const inputRef1 = useRef(null);
    const navigate = useNavigate();

    const toastForFail = async () => {
        toast.error("LogIn Fail", {
            positon: "top-right",
        });
    };
    const toastForWarn = async () => {
        toast.warn("E-mail Or Password is Required!", {
            position: "top-right",
        });
    };
    const toastForChange = async () => {
        toast.warn("No User Exists! Please, Sign In?", {
            position: "top-right",
        });
    };
    const handleKeyPress = (e) => {
        if (e.key === "Enter") handleLogin();
    };
    const handleLogin = async () => {
        setLoading(true);
        if (!name || !pass) {
            toastForWarn();
            setLoading(false);
            return console.log("Email Or Password Required!");
        }
        try {
            // find user by name/email
            const userData = await axios.get(
                `http://localhost:8080/api/user/${name}`,
            );
            const { _id, email, password } = userData.data;

            const token = await axios.post(
                `http://localhost:8080/api/logIn/${_id}/${email}/${password}`,
                {
                    password: pass,
                },
            );
            localStorage.setItem("x-access-token", JSON.stringify(token.data));
            localStorage.setItem("username", name);
            const tok = JSON.parse(localStorage.getItem("x-access-token"));
            const username = localStorage.getItem("username");
            if (tok && username) {
                setLoading(false);
                navigate("/mainbody");
            }
        } catch (error) {
            if(!error.response){
                toastForFail();
                setLoading(false);
                return;
            }
            const specError = error.response.data;
            console.log(specError);
            if (specError === "Fail Authentication" && login) {
                setLoading(false);
                toastForFail();
            } else if (specError === "User Not Exists!") {
                if (login) {
                    toastForChange();
                    setLoading(false);
                } else {
                    const token = await axios.post("http://localhost:8080/api/signIn", {
                        email: name,
                        password: pass,
                    });
                    localStorage.setItem(
                        "authorization token",
                        JSON.stringify(token.data),
                    );
                    localStorage.setItem("username", name);
                    const tok = JSON.parse(localStorage.getItem("authorization token"));
                    const username = localStorage.getItem("username");
                    if (tok && username) {
                        setLoading(false);
                        navigate("/mainbody");
                    }
                }
            }
        }
    };
    const handleDivClick = () => {
        if (name === "") {
            setEntering(!entering);
        }

        if (!entering && pass === "") {
            inputRef.current.blur();
            setPentering(false);
        }
        inputRef.current.focus();
    };
    const handleDivClick1 = () => {
        if (pass === "") {
            setPentering(!pentering);
        }

        if (!pentering && name === "") {
            inputRef1.current.blur();
            setEntering(false);
        }
        inputRef1.current.focus();
    };

    return (
        <div className="flex justify-center items-center w-full h-screen relative">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            {loading ? (
                <div className=" absolute w-full h-full bg-black opacity-40 z-30 flex justify-center items-center">
                    <PulseSpinner loading={loading} color="#FDE047" size={40} />
                </div>
            ) : (
                ""
            )}
            <div className="w-2/3 h-2/3 flex shadow-lg">
                <img src={image} alt="login" className="w-1/2 h-full" />
                <div className="w-1/2 h-full p-4 relative flex justify-center items-center flex-col">
                    <div className="text-center custom-font text-2xl">
                        {login ? "LogIn" : "Sign Up"}
                    </div>
                    <div className="mt-10 relative w-full">
                        <div className="w-full flex justify-center items-center flex-col">
                            <div
                                className={`w-[60%]  absolute h-fit flex items-center cursor-pointer transition-all duration-500 ${entering ? "top-[-13px] w-fit bg-white px-2" : "ms-4"}`}
                                onClick={handleDivClick}
                            >
                                Name
                            </div>
                            <input
                                ref={inputRef}
                                type="text"
                                className="border-black border-[1px] w-[60%] py-2 px-2 outline-none cursor-pointer rounded-md"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                aria-label="Name"
                            />
                        </div>

                        <div className="w-full flex justify-center items-center flex-col mt-8">
                            <div
                                className={`w-[60%]  absolute h-fit flex items-center cursor-pointer transition-all duration-500 ${pentering ? "top-[60px] w-fit bg-white px-2" : "ms-4"}`}
                                onClick={handleDivClick1}
                            >
                                Password
                            </div>
                            <input
                                ref={inputRef1}
                                type={visible ? "text" : "password"}
                                className="border-black border-[1px] w-[60%] py-2 px-2 outline-none cursor-pointer rounded-md"
                                value={pass}
                                onChange={(e) => setPassword(e.target.value)}
                                aria-label="Password"
                                onKeyDown={(e) => handleKeyPress(e)}
                            />
                            <img
                                src={visible ? show : hide}
                                alt="show-hide"
                                className="absolute w-5 right-24 cursor-pointer"
                                onClick={() => setVisible(!visible)}
                            />
                        </div>
                        {/* <div className="flex items-center justify-end w-[60%] mt-2">
              <input type="checkbox" className="mr-2" />
              <div>Remember Password!</div>
            </div> */}
                        <div className="text-center text-slate-400 mt-10 transition-all duration-300 cursor-pointer hover:text-slate-700 hover:font-semibold">
                            Forgot Password!
                        </div>
                        <div className="flex justify-center mt-4">
                            <input
                                type="submit"
                                value={login ? "login" : "Sign Up"}
                                className="text-center w-[60%] bg-yellow-300  py-2 font-semibold transition-all duration-300 hover:tracking-widest cursor-pointer"
                                onClick={handleLogin}
                            />
                        </div>
                        <div
                            className="mt-6 text-center cursor-pointer transition-all duration-500 hover:underline "
                            onClick={() => setLogin(!login)}
                        >
                            {login ? "Sign up or Sign In" : "LogIn"}
                        </div>
                    </div>
                    <img
                        src={reminder}
                        alt=""
                        className="w-[100px] absolute right-0 bottom-0"
                    />
                </div>
            </div>
        </div>
    );
};

export default Login;
