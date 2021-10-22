import React, { useEffect, useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import { headerShow } from '../actions/AccountStatementAction'

const UserInput = () => {
  const history = useHistory();
  const dispatch = useDispatch()
  const [token, setToken] = useState("");
  const [key, setKey] = useState("");
  const [show, setShow] = useState(false);
  const handleSubmit = () => {
    if (token === "" || key === "") {
      setShow(true);
    }
    else {
      localStorage.setItem("token", token);
      localStorage.setItem("key", key);
      history.push('/Employee');
    }
  }
  const getUserToken = () => {
    const gettoken = localStorage.getItem("token");
    const getkey = localStorage.getItem("key");
    if (gettoken !== null && getkey !== null) {
      history.push('/Employee');

    }
  }


  useEffect(() => {
    dispatch(headerShow(true))
    getUserToken()
  }, [])
  return (
    <div>

      {show && <Modal show={show}>
        <Modal.Header><h3>Login</h3>
          <button className="close" onClick={() => setShow(false)} data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body>Please enter all Details</Modal.Body>
        <Modal.Footer>
          <Button type='button' onClick={() => setShow(false)} style={{ width: "80px" }}> Ok </Button>
        </Modal.Footer>
      </Modal>}

      <div className="container">
        <div className="row col-7 mx-auto align-items-center d-flex justify-content-center mt-5">
          <form className="form-horizontal hr mt-4" required>
            <div className="form-group form-inline">
              <div className="control-label col-sm-4 col-lg-5">
                <lebel className="font-size "> AWS Token </lebel>
              </div>
              <div className="col-sm-4">
                <input type="text" className=" form-control" id="user" onChange={(event) => setToken(event.target.value)} value={token}></input>
              </div>
            </div>
            <div className="form-group form-inline">
              <div className="control-label col-sm-4 col-lg-5">
                <lebel className="font-size "> AWS Secret Key </lebel>
              </div>
              <div className="col-sm-3  ">
                <input type="text" className="form-control" id="username" onChange={(event) => setKey(event.target.value)} value={key}></input>
              </div>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-12">
              <button
                type="button"
                className=" btn btn-primary btn-lg btn-block"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </form>

        </div>
      </div>


    </div>


  );
}
export default UserInput;
