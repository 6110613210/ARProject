import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import { AuthContext } from "./Auth";
import { Line } from 'react-chartjs-2';
import axios from "axios";


const Techer = () => {
   const { currentUser, setCurrentUser, status, setStatus } = useContext(AuthContext);
   const [showpage, setShowPage] = useState("listname")
   const [studentlist, setStudentList] = useState([]);
   const [student, setStudent] = useState(null)
   const [error, setError] = useState(null);
   const [data, setData] = useState({})
   const [pretest, setPretest] = useState(null);
   useEffect(() => {
      getStudentList();
   }, []);

   const getStudentList = () => {
      Axios.get("http://localhost:3001/students").then((response) => {
         setStudentList(response.data);
         console.log(response.data);
      });
   };
   const Logout = () => {
      Axios.get("http://localhost:3001/logout").then((response) => {
         if (response.data.massage) {
            setCurrentUser(null);
            setStatus(null);
         }
      });
   };
   const back = () => { setStudent([]); setShowPage("listname") };

   const handlePretest = event => {
      setPretest(event.target.value);
   }
   const postAddPretest = () => {
      Axios.post("http://localhost:3001/addpretest", { username: student.username, pretest: pretest })
         .then((response) => {
            if (!response.data.massage) {
               console.log(response.data.massage)
               setError(response.data.massage);
            } else {
               getStudentList();
               back();
            }
         });
   };

   const postScore = async (SID) => {
      let s1 = [];
      let s2 = [];
      let s3 = [];
      await Axios.post("http://localhost:3001/score", { student: SID })
         .then(async (response) => {
            if (response.data.massage) {
               await setError(response.data.massage);
            } else {
               await setStudent({ username: SID, listdata: response.data });
               response.data.forEach(element => {
                  s1.push(element.session1);
                  s2.push(element.session2);
                  s3.push(element.session3);
               });
               await setData({
                  labels: ['TEST1', 'TEST2', 'TEST3'],
                  datasets: [
                     {
                        label: 'session1',
                        backgroundColor: 'rgb(75,192,192)',
                        borderColor: 'rgb(75,192,192)',
                        borderWidth: 3,
                        data: s1

                     },
                     {
                        label: 'session2',
                        backgroundColor: 'rgb(80, 97, 199)',
                        borderColor: 'rgb(80, 97, 199)',
                        borderWidth: 3,
                        data: s2
                     },
                     {
                        label: 'session3',
                        backgroundColor: 'rgb(199, 80, 82)',
                        borderColor: 'rgb(199, 80, 82)',
                        borderWidth: 3,
                        data: s3

                     }
                  ]
               });
               await setShowPage("score");
            }
         });
   };

   return (
      <div>
         <nav className="navbar login-header">
            <h1 className="titleBar"> Teacher </h1>
            <button className="btn btn-secondary btn-md titleBar2"
               onClick={Logout}> logout </button>
         </nav>
         <div className="container">
            <div className="row">
               <div className="col-sm-10   col-lg-10 mx-auto">
                  <div className="card card-signin my-5 card border-dark mb-3">
                     <div className="card-body">
                        {error &&
                           <p>{error}</p>
                        }

                        {(showpage === "listname") &&
                           <div>
                              <h3> รายชื่อนักเรียน </h3>
                              {studentlist.map((val, key) => {
                                 return (<ul className="list-group">
                                    <li className="list-group-item d-flex align-items-center">
                                       <div className="fw-bold col mx-auto">
                                          <button className="badge btn btn-secondary btn-sm space" onClick={() => { postScore(val.username) }} > ... </button>
                                          {val.username}
                                       </div>

                                       {val.type !== "" ? <p id="type"> {val.type} </p> :
                                          <button className="btn btn-primary btn-sm " onClick={() => { setShowPage("addpretest"); setStudent({ username: val.username }) }} > Add Pretest  </button>}
                                    </li>
                                 </ul>

                                 );
                              })}
                           </div>
                        }

                        {(showpage === "score") &&
                           <div>

                              <div>
                                 <h2 class="mid">{student.username} </h2>
                                 <button className="btn btn-secondary " onClick={() => { back() }} > back </button>
                              </div>
                              <table className="table bottomGraph">
                                 <thead>
                                    <tr>
                                       <th scope="col"></th>
                                       <th scope="col">SECTION 1</th>
                                       <th scope="col">SECTION 2</th>
                                       <th scope="col">SECTION 3</th>
                                    </tr>
                                 </thead>
                                 <tbody>
                                    {student.listdata.map((val, key) => {
                                       return (
                                          <tr>
                                             <th scope="row">TEST {val.Tid}</th>
                                             <td>{val.session1}</td>
                                             <td>{val.session2}</td>
                                             <td>{val.session3}</td>
                                          </tr>
                                       );
                                    })}
                                 </tbody>
                              </table>
                              <hr />
                              <div id="curve_chart">
                                 <Line data={data} options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    layout: {
                                       padding: {
                                          top: 5,
                                          left: 15,
                                          right: 15,
                                          bottom: 15
                                       }
                                    }
                                 }}
                                 />
                              </div>

                           </div>
                        }
                        {(showpage === "addpretest") &&
                           <div>
                              <h2 className=" text-center">{student.username} Pre test</h2>
                              {error &&
                                 <p>{error}</p>
                              }
                              <div className="form-signin">
                                 <div className="form-label-group">
                                    <input type="number" id="inputpretest" className="form-control"
                                       placeholder="0" min="0" max="100" onChange={handlePretest} required />
                                    <label for="inputpretest">คะเเนน pretest</label>
                                 </div>

                                 <button className="btn btn-signin btn-secondary" type="submit" onClick={() => { postAddPretest() }} >Add Pretest</button>
                              </div>

                           </div>
                        }

                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

export default Techer;
