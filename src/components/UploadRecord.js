import React, { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';
import { headerShow, handelModal } from '../actions/AccountStatementAction'
import Dropzone from './Dropzone';
import PromisifyFileReader from 'promisify-file-reader';
import AccountNumbersUtils from '../utils/AccountNumbersUtils';
function UploadRecord() {
      const [id, setId] = useState("")
      const dispatch = useDispatch()
      const myState = useSelector((store) => store.accountStatementReducer)
      const onDrop = useCallback(acceptedFiles => {
            handalFile(acceptedFiles[0]);
      });

      myState.FileData.sort((a, b) => {
            let da = (new Date(a.date)).getTime() / 1000.0,
                  db = (new Date(b.date)).getTime() / 1000.0;
            return db - da;
      });

      useEffect(() => {
            AccountNumbersUtils.getFileInfo()
            dispatch(headerShow(false))
      }, [])
      const saveLineToStorageUtils = async (line, index) => {
            if (!line || !line.trim()) return;
            let lineParts = line.split("\t").map(linePart => linePart.trim());
            console.log("lineParts", lineParts)
            let objectToStore = {
                  recordId: myState.FileData.length > 0 ? myState.FileData[myState.FileData.length - 1].infoId + 1 : 0,
                  No: lineParts[0],
                  Mchn: lineParts[1],
                  EnNo: lineParts[2],
                  Name: lineParts[3],
                  Mode: lineParts[4],
                  IOMd: lineParts[5],
                  DateTime: lineParts[6],
            }
            AccountNumbersUtils.addFileDetails(objectToStore)
      }
      const handalFile = async (FileObjects) => {
            console.log(FileObjects)
            console.log("FileObjectsname", FileObjects.name);
            let lines = (await PromisifyFileReader.readAsText(FileObjects)).split("\n");
            console.log("line", lines)

            for (let i = 1; i < lines.length; i++) {
                  let line = lines[i];
                  saveLineToStorageUtils(line, i);
            }
            const monthNames = ["Jan", "Feb", "Mar", "April", "May", "June",
                  "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

            const d = new Date();
            const hour = d.getHours()
            const suffix = hour >= 12 ? "PM" : "AM";
            var h = d.getHours()
            if (h === 12) {
                  h = 12
            }
            if (h > 12) {
                  h = h - 12
            }
            if (h < 10) {
                  h = "0" + h
            }
            var m = d.getMinutes()
            if (m < 10) {
                  m = "0" + m
            }

            const time = h + ":" + m + " " + suffix
            const date = (monthNames[d.getMonth()] + " " + d.getDate() + " " + d.getFullYear() + " " + time)
            let object = {
                  infoId: myState.FileData.length > 0 ? myState.FileData[myState.FileData.length - 1].infoId + 1 : 0,
                  filename: FileObjects.name,
                  date: date
            }
            AccountNumbersUtils.addFileInfo(object)
      }
      const modalShow = (id, infoId) => {
            let object = {
                  id, infoId
            }
            setId(object)
            dispatch(handelModal(true))
      }
      return (


            <div className="container mb-5">
                  <main className="App">
                        <Dropzone onDrop={onDrop} />
                  </main>
                  {myState.FileData.length > 0 &&
                        <div className="row">
                              <div className="col-12 mx-auto">
                                    <h5 className="mb-3">
                                          <strong></strong>
                                    </h5>

                                    <table className="table  table-striped">
                                          <thead>
                                                <tr className="">
                                                      <th className="col-sm-2">#</th>
                                                      <th className="col-sm-3">File Name</th>
                                                      <th className="col-sm-3">Date</th>
                                                      <th className="col-sm-3"></th>
                                                </tr>
                                          </thead>
                                          <tbody>
                                                {
                                                      myState.FileData && (myState.FileData).map((Element, index) => {
                                                            const { id, infoId, filename, date } = Element
                                                            return (
                                                                  <tr>
                                                                        <td className="col-sm-2 py-4">{index + 1}</td>
                                                                        <td className="col-sm-3 py-4" >{filename}</td>
                                                                        <td className=" col-sm-3 py-4">{date}</td>
                                                                        <td className="pt-3"><button type="button" onClick={() => AccountNumbersUtils.Download(infoId)} className=" btn btn-primary mr-1">Download</button>
                                                                              <button type="button" onClick={() => modalShow(id, infoId)} className=" btn btn-danger col-sm-4  ">Remove</button>
                                                                        </td>
                                                                  </tr>
                                                            )
                                                      })
                                                }
                                          </tbody>
                                    </table>
                              </div>
                        </div>
                  }
                  {myState.show && <Modal show={myState.show}>
                        <Modal.Header><h3>Remove Record</h3>
                              <button className="close" onClick={() => dispatch(handelModal(false))} data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                              </button>
                        </Modal.Header>
                        <Modal.Body>Are you sure want to remove this record?</Modal.Body>
                        <Modal.Footer>
                              <Button onClick={() => AccountNumbersUtils.deleteFileInfo(id)} style={{ width: "80px" }}>Yes</Button>
                        </Modal.Footer>
                  </Modal>}
            </div>

      )

}

export default UploadRecord;


