import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import { AuthContext } from "./Auth";
const test = [
    ["1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1"],
    ["1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1"],
    ["1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1"],
    ["1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1"],
    ["1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1"],
    ["1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1"],
    ["1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1"],
    ["1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1"],
    ["1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1"]
]
const Student = () => {
        const { currentUser, setCurrentUser, status, setStatus } = useContext(AuthContext);
        const [listTest, setListTest] = useState([]);
        let answerlist = [];
        const [error, setError] = useState(null);
        const Logout = () => {
            Axios.get("http://localhost:3001/logout").then((response) => {
                if (response.data.massage) {
                    setCurrentUser(null);
                    setStatus(null);
                }
            });
        };
        useEffect(() => {
            init();
        }, []);

        const init = async() => {
            await Axios.get("http://localhost:3001/score")
                .then(async(response) => {
                    console.log(response.data)
                    await setListTest(response.data)
                });

        }
        const handleStatus = event => {
            answerlist[event.target.name] = event.target.value
            console.log(answerlist);
        }
        const getChoiceContent = () => {
            let content = [];
            for (let i = 0; i < 20; i++) {
                content.push( <
                    div className = "row"
                    onChange = { handleStatus.bind(this) } >
                    <
                    br / >
                    <
                    div className = "form-check form-check-inline col col-sm-1 mx-auto" >
                    <
                    input className = "form-check-input"
                    id = "choice1"
                    type = "radio"
                    value = "1"
                    name = { i }
                    /> <
                    label class = "form-check-label"
                    for = "choice1" > 1 < /label> < /
                    div > <
                    div className = "form-check form-check-inline col col-sm-1 mx-auto" >
                    <
                    input className = "form-check-input"
                    id = "choice2"
                    type = "radio"
                    value = "2"
                    name = { i }
                    /> <
                    label class = "form-check-label"
                    for = "choice2" > 2 < /label> < /
                    div > <
                    div className = "form-check form-check-inline col col-sm-1 mx-auto" >
                    <
                    input className = "form-check-input"
                    id = "choice3"
                    type = "radio"
                    value = "3"
                    name = { i }
                    /> <
                    label class = "form-check-label"
                    for = "choice3" > 3 < /label> < /
                    div > <
                    div className = "form-check form-check-inline col  col-sm-1 mx-auto" >
                    <
                    input className = "form-check-input"
                    id = "choice4"
                    type = "radio"
                    value = "4"
                    name = { i }
                    /> <
                    label class = "form-check-label"
                    for = "choice4" > 4 < /label> < /
                    div > <
                    hr / >
                    <
                    /div>);
                }
                return content;
            };
            const submit = (tid) => {
                let point = 0
                console.log(answerlist);
                console.log(listTest[0].id);

                if (answerlist.length === 20) {
                    let i;
                    for (i = 0; i < 20; i++) {
                        if (answerlist[i] && answerlist[i] === test[tid - 1][i]) {
                            point++
                        } else if (!answerlist[i]) {
                            break;
                        }
                    }
                    if (i === 20) {
                        Axios.post("http://localhost:3001/addsession3", { id: listTest[0].id, point: point }).then((response) => {
                            if (response.data.massage) {
                                console.log(response.data.massage.sqlMessage)
                                setError(response.data.massage.sqlMessage)
                            } else {
                                answerlist = [];
                                window.location.reload()
                            }
                        });
                    } else {
                        setError("โปรดเลือกช้อยให้ครบ");
                    }

                } else {
                    setError("โปรดเลือกช้อยให้ครบ");
                }
                init();

            }




            return ( <
                div >
                <
                nav className = "navbar login-header" >
                <
                h1 className = "titleBar" > Student < /h1> <
                button className = "btn btn-secondary btn-md titleBar2"
                onClick = { Logout } > logout < /button> < /
                nav > <
                div className = "container" >
                <
                div className = "row" >
                <
                div className = "col-md-8  col-sm-10 col-lg-10 mx-auto" >
                <
                div className = "card card-signin my-5 card border-dark mb-3" >
                <
                div className = "card-body " >

                {
                    listTest && listTest[0] &&
                    <
                    div >

                    <
                    h3 > TEST { listTest[0].Tid } < /h3> <
                    div className = "container" > {!!error && error } { getChoiceContent() } <
                    button className = "btn btn-signin btn-secondary"
                    type = "submit"
                    onClick = {
                        () => { submit(listTest[0].Tid) }
                    } > submit < /button> < /
                    div > <
                    /div>
                } {
                    listTest == 0 &&
                        <
                        h3 > ทำข้ อสอบครบเเล้ ว < /h3>
                }


                <
                /div> < /
                div > <
                /div> < /
                div > <
                /div>

                <
                /div >
            );
        }

        export default Student;