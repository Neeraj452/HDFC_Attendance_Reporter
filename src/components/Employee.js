import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { employeeUpdate, headerShow, handelModal, handelsSpecialChareactor } from '../actions/AccountStatementAction'
import AccountNumbersUtils from "../utils/AccountNumbersUtils";
function Employee() {
      const [username, setUsername] = useState("");
      const [fullname, setfullname] = useState("");
      const [company, setCompany] = useState("");
      const [id, setId] = useState("");
      const dispatch = useDispatch()
      const myState = useSelector((store) => store.accountStatementReducer);
      useEffect(() => {
            AccountNumbersUtils.getEmployee()
            dispatch(headerShow(false))
      }, [])
      const handleSubmit = async (e) => {
            e.preventDefault();
            let format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
            if (format.test(username) || format.test(fullname) || format.test(company)) {
                  dispatch(handelsSpecialChareactor(true))
            }
            else if (username !== "" && fullname !== "" && company !== "") {
                  let employeeInfo = await AccountNumbersUtils.getEmployeeId()
                  let object = {
                        id: employeeInfo.length > 0 ? employeeInfo[employeeInfo.length - 1].id + 1 : 1,
                        username: username,
                        fullname: fullname,
                        company: company
                  }
                  AccountNumbersUtils.addEmployee(object)
                  setUsername("")
                  setfullname("")
                  setCompany("")
            }
      }
      myState.EmployeeData.sort((a, b) => {
            let fa = a.username.toLowerCase(),
                  fb = b.username.toLowerCase();

            if (fa < fb) {
                  return -1;
            }
            if (fa > fb) {
                  return 1;
            }
            return 0;
      })
      const updateEmployeeDetails = (id, name, details) => {
            let format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

            if (format.test(name)) {
                  dispatch(handelsSpecialChareactor(true))
            }
            else {
                  const object = {
                        id: id,
                        name: name
                  }
                  AccountNumbersUtils.updateEmployeeDetails(object, details)
            }
      }

      const modalShow = (id) => {
            setId(id)
            dispatch(handelModal(true))
      }
      return (
            <div className="container">
                  <div className="row">
                        <div className="col-12 mx-auto text-center">
                              <h5 className="mb-4">
                                    <strong>Employee Table</strong>
                              </h5>
                              <form className="">
                                    <table className="table table-striped">
                                          <thead>
                                                <tr className="">
                                                      <th className="col-sm-1">#</th>
                                                      <th className="col-sm-3">Username</th>
                                                      <th className="col-sm-3">Full name</th>
                                                      <th className="col-sm-3">Company</th>
                                                      <th className="col-sm-2"></th>
                                                </tr>
                                          </thead>
                                          <tr className="">
                                                <td className="col-sm-1"></td>
                                                <td className="col-sm-3 pt-3"><input className="" type="text" onChange={(event) => setUsername(event.target.value)} value={username} /></td>
                                                <td className="col-sm-3 pt-3"><input className="" type="text" onChange={(event) => setfullname(event.target.value)} value={fullname} /></td>
                                                <td className="col-sm-3 pt-3"><input id="company" name="company" autoComplete="company" type="text" onChange={(event) => setCompany(event.target.value)} value={company} /></td>
                                                <td className="col-sm-2 pt-2"><button type="submit" onClick={handleSubmit} className="btn btn-primary mt-2" style={{ width: "80px" }}>Add</button></td>
                                          </tr>
                                          <tbody>
                                                {
                                                      myState.EmployeeData[0] && (myState.EmployeeData).map((Element, index) => {
                                                            const { id, username, fullname, company } = Element;
                                                            return (<tr>
                                                                  <td className=" col-sm-1 pt-sm-3">{index + 1}</td>
                                                                  <td className="col-sm-3 pt-3" ><input type="text" onChange={(event) => dispatch(employeeUpdate({
                                                                        index: index,
                                                                        type: 'username',
                                                                        value: event.target.value
                                                                  }))} onBlur={() => updateEmployeeDetails(id, username, "username")} className={myState.box_type === "username" && myState.box_index === index ? myState.box_color ? "border border-danger" : "border border-success" : null} value={username} /></td>
                                                                  <td className="col-sm-3 pt-3"><input type="text" className={myState.box_type === "fullname" && myState.box_index === index ? myState.box_color ? "border border-danger" : "border border-success" : null} onChange={(event) => dispatch(employeeUpdate({
                                                                        index: index,
                                                                        type: 'fullname',
                                                                        value: event.target.value
                                                                  }))} value={fullname} onBlur={() => updateEmployeeDetails(id, fullname, "fullname")} /></td>
                                                                  <td className="col-sm-3 pt-3"><input type="text" className={myState.box_type === "company" && myState.box_index === index ? myState.box_color ? "border border-danger" : "border border-success" : null} onChange={(event) => dispatch(employeeUpdate({
                                                                        index: index,
                                                                        type: 'company',
                                                                        value: event.target.value
                                                                  }))} value={company} onBlur={() => updateEmployeeDetails(id, company, "company")} /></td>

                                                                  <td className="col-sm-2"><button type="button" onClick={() => modalShow(id)} className="btn btn-danger mt-2">Remove</button></td>
                                                            </tr>
                                                            )
                                                      })
                                                }
                                          </tbody>
                                    </table>
                              </form>

                        </div>
                  </div>
                  {myState.show && <Modal show={myState.show}>
                        <Modal.Header><h3>Remove Employee</h3>
                              <button className="close" onClick={() => dispatch(handelModal(false))} data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                              </button>
                        </Modal.Header>
                        <Modal.Body>Are you sure want to remove this employee? </Modal.Body>

                        <Modal.Footer>
                              <Button onClick={() => AccountNumbersUtils.dataDelete1(id)} style={{ width: "80px" }}>Yes</Button>

                        </Modal.Footer>
                  </Modal>}
                  {myState.showSpecial && <Modal show={myState.showSpecial}>
                        <Modal.Header><h3>Error</h3>
                              <button className="close" onClick={() => dispatch(handelsSpecialChareactor(false))} data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                              </button>
                        </Modal.Header>
                        <Modal.Body>Please Remove Special Charactors </Modal.Body>
                        <Modal.Footer>
                              <Button onClick={() => dispatch(handelsSpecialChareactor(false))} style={{ width: "80px" }}>Ok</Button>
                        </Modal.Footer>
                  </Modal>}
            </div>
      )
}
export default Employee
