import React, { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';
import { headerShow, handelModal, handelFileError } from '../actions/AccountStatementAction'
import Dropzone from './Dropzone';
import PromisifyFileReader from 'promisify-file-reader';
import AccountNumbersUtils from '../utils/AccountNumbersUtils';
import DateUtils from '../utils/DateUtils'
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
            let lineParts = line.split("\t");
            let recordInfo = await AccountNumbersUtils.getupload_file_info()
            let recordDetails = await AccountNumbersUtils.getupload_file_details()
            let objectToStore = {
                  id: recordDetails.length + index,
                  recordId: recordInfo.length > 0 ? recordInfo[recordInfo.length - 1].id + 1 : 1,
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
            let lines = (await PromisifyFileReader.readAsText(FileObjects)).split("\n");
            let lineParts1 = lines[0].split("\t").map(linePart => linePart.trim());
            if (lineParts1[0] === "No" && lineParts1[1] === "Mchn" && lineParts1[2] === "EnNo" && lineParts1[4] === "Name" && lineParts1[6] === "Mode" && lineParts1[7] === "IOMd" && lineParts1[8] === "DateTime") {
                  for (let i = 1; i < lines.length; i++) {
                        let line = lines[i];
                        saveLineToStorageUtils(line, i);
                  }
                  let recordInfo = await AccountNumbersUtils.getupload_file_info()
                  let date = await DateUtils.formatForFileName()
                  let object = {
                        id: recordInfo.length > 0 ? recordInfo[recordInfo.length - 1].id + 1 : 1,
                        filename: FileObjects.name,
                        date: date
                  }
                  AccountNumbersUtils.addFileInfo(object)
            }
            else {
                  dispatch(handelFileError(true))
            }
      }
      const modalShow = (id) => {
            setId(id)
            dispatch(handelModal(true))
      }
      return (
            <div className="container">
                  <main className="App">
                        <Dropzone onDrop={onDrop} accept="txt/" />
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
                                                      <th className="col-sm-1">#</th>
                                                      <th className="col-sm-4">File Name</th>
                                                      <th className="col-sm-4">Date</th>
                                                      <th className="col-sm-1"></th>
                                                      <th className="col-sm-1"></th>
                                                </tr>

                                          </thead>
                                          <tbody>
                                                {
                                                      myState.FileData && (myState.FileData).map((Element, index) => {
                                                            const { id, filename, date } = Element
                                                            return (
                                                                  <tr>
                                                                        <td className="col-sm-1 py-4">{index + 1}</td>
                                                                        <td className="col-sm-4 py-4" >{filename}</td>
                                                                        <td className="col-sm-4 py-4">{date}</td>
                                                                        <td className="col-sm-1 pt-3"><button type="button" onClick={() => AccountNumbersUtils.Download(id)} className=" btn btn-primary mr-1">Download</button>
                                                                        </td>
                                                                        <td className="col-sm-1 pt-3"><button type="button" onClick={() => modalShow(id)} className=" btn btn-danger">Remove</button></td>

                                                                  </tr>
                                                            )
                                                      })
                                                }
                                          </tbody>
                                    </table>
                              </div>
                        </div>
                  }
                  {
                        myState.show && <Modal show={myState.show}>
                              <Modal.Header><h3>Remove Record</h3>
                                    <button className="close" onClick={() => dispatch(handelModal(false))} data-dismiss="modal" aria-label="Close">
                                          <span aria-hidden="true">&times;</span>
                                    </button>
                              </Modal.Header>
                              <Modal.Body>Are you sure want to remove this record?</Modal.Body>
                              <Modal.Footer>
                                    <Button onClick={() => AccountNumbersUtils.deleteFileInfo(id)} style={{ width: "80px" }}>Yes</Button>
                              </Modal.Footer>
                        </Modal>
                  }

                  {
                        myState.fileerror && <Modal show={myState.fileerror}>
                              <Modal.Header><h3>Error</h3>
                                    <button className="close" onClick={() => dispatch(handelFileError(false))} data-dismiss="modal" aria-label="Close">
                                          <span aria-hidden="true">&times;</span>
                                    </button>
                              </Modal.Header>
                              <Modal.Body>Invalid file</Modal.Body>
                              <Modal.Footer>
                                    <Button onClick={() => dispatch(handelFileError(false))} style={{ width: "80px" }}>Ok</Button>
                              </Modal.Footer>
                        </Modal>
                  }
            </div >
      )
}
export default UploadRecord;


