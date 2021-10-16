import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { employeeUpdate, headerShow, handelModal, handelsSpecialChareactor } from '../actions/AccountStatementAction'
import AccountNumbersUtils from "../utils/AccountNumbersUtils";
function Employee() {
      const [username, setUsername] = useState("");
      const [fullname, setfullname] = useState("");
      const [company, setCompany] = useState("");
      const [id, setId] = useState("")
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
                  let employeeInfo = await AccountNumbersUtils.getEmployee()
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

      const update = (id, name) => {
            let format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
            if (format.test(name)) {
                  dispatch(handelsSpecialChareactor(true))
            }
            else {
                  const object = {
                        id: id,
                        name: name
                  }
                  AccountNumbersUtils.update(object)
            }
      }
      const update1 = (id, name) => {
            let format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
            if (format.test(name)) {
                  dispatch(handelsSpecialChareactor(true))
            }
            else {
                  const object = {
                        id: id,
                        name: name
                  }
                  AccountNumbersUtils.update1(object)
            }
      }
      const update2 = (id, name) => {
            let format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
            if (format.test(name)) {
                  dispatch(handelsSpecialChareactor(true))
            } else {
                  const object = {
                        id: id,
                        name: name
                  }
                  AccountNumbersUtils.update2(object)
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
                                    <table className="table table-striped ">
                                          <thead>
                                                <tr className="">
                                                      <th className="">#</th>
                                                      <th className="col-3">Username</th>
                                                      <th className="col-3">Full name</th>
                                                      <th className="col-3">Company</th>
                                                      <th className="col-3"></th>
                                                </tr>
                                          </thead>
                                          <tr className="">
                                                <td className=""></td>
                                                <td className=" pt-3"><input className="" type="text" onChange={(event) => setUsername(event.target.value)} onfocus="this.value=''" value={username} /></td>
                                                <td className=" pt-3"><input className="" type="text" onChange={(event) => setfullname(event.target.value)} value={fullname} /></td>
                                                <td className=" pt-3"><input id="company" name="company" autoComplete="company" className="" type="text" onChange={(event) => setCompany(event.target.value)} value={company} /></td>
                                                <td className=" pt-3"><button type="submit" onClick={handleSubmit} className="btn btn-primary" style={{ width: "80px" }}>Add</button></td>
                                          </tr>
                                          <tbody>
                                                {
                                                      myState.EmployeeData[0] && (myState.EmployeeData).map((Element, index) => {
                                                            const { id, username, fullname, company } = Element;
                                                            return (<tr>
                                                                  <td className="pt-3">{index + 1}</td>
                                                                  <td className="col-3 pt-3"><input className="" value={username} onChange={(event) => dispatch(employeeUpdate({
                                                                        index: index,
                                                                        type: 'username',
                                                                        value: event.target.value
                                                                  }))} onBlur={() => update1(id, username)} /></td>
                                                                  <td className="col-3 pt-3"><input className="" onChange={(event) => dispatch(employeeUpdate({
                                                                        index: index,
                                                                        type: 'fullname',
                                                                        value: event.target.value
                                                                  }))} value={fullname} onBlur={() => update(id, fullname)} /></td>
                                                                  <td className="col-3 pt-3"><input onChange={(event) => dispatch(employeeUpdate({
                                                                        index: index,
                                                                        type: 'company',
                                                                        value: event.target.value
                                                                  }))} value={company} onBlur={() => update2(id, company)} /></td>

                                                                  <td className="col-3"><button type="button" onClick={() => modalShow(id)} className="btn btn-danger">Remove</button></td>
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
                        </Modal.Footer>
                  </Modal>}
            </div>
      )
}
export default Employee
