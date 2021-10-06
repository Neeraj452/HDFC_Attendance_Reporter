import React, {useState, useEffect,useCallback} from 'react'
import { useSelector, useDispatch} from 'react-redux';
import Dexie from "dexie";
import { Button, Modal } from 'react-bootstrap';
import {fileUpload,fileClear,headerShow,sendFile} from '../actions/AccountStatementAction'
import Dropzone from './Dropzone';
function UploadRecord() {
      const [item, setitem] = useState("")
      const [show, setShow]= useState(false) 
      const [id, setId] = useState("")
      const [postFile, setFile] = useState("");
      const dispatch = useDispatch()
      const myState = useSelector((store)=> store.accountStatementReducer)
      console.log("myState",myState.FileData)
      const db = new Dexie("ReactDexie");
      db.version(1).stores({
          posts1: "++id, file,filename, date"
      })
      db.open().catch((err) => {
          console.log(err.stack || err)
      })
     
     
      const onDrop = useCallback(acceptedFiles => {
            console.log("acceptedFiles",acceptedFiles)
            handalFile(acceptedFiles);
          });
     
          
      
      
          myState.FileData.sort((a, b) =>{
          let da =(new Date(a.date)).getTime()/1000.0,
              db = (new Date(b.date)).getTime()/1000.0;
           return db - da;
           });

      const getPosts = async() => {
            var allPosts = await db.posts1.toArray();
            console.log("allPosts",allPosts)
            dispatch(fileUpload(allPosts))
           
        }
      
       useEffect(()=>{
              getPosts(); 
              dispatch(headerShow(false)) 
        
       },[]) 
       var file2=null;
      const handalFile =(files)=>{
            const promise = new Promise((resolve) => {
                  const reader = new FileReader();
                  reader.onload = function () {
                    resolve(reader.result);
                  }
                  reader.readAsDataURL(files[0]);
                });

                promise.then(files => {
                   file2 = files;
                 
                });
            const monthNames = ["Jan", "Feb", "Mar", "April", "May", "June",
            "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

            const d= new Date();
            const hour = d.getHours()
            const suffix = hour >= 12 ? "PM":"AM";
            var h = d.getHours()
            if(h===12){
                h = 12
            }
            if(h>12){
                h= h-12
            }
            if(h<10){
                  h= "0"+h
            }
            var m = d.getMinutes()
            if(m<10){
                  m= "0"+m
            }

            const time = h + ":"+ m +" "+suffix
            const date =(monthNames[d.getMonth()] +" " + d.getDate() +" " +d.getFullYear() + " "+ time)  
           
           setTimeout(function(){   
            let object ={
                  file:file2,
                  filename:files[0].name,
                  date:date
            }

            db.posts1.add(object).then(async() => {
                  let allPosts = await db.posts1.toArray();
                  dispatch(fileUpload(allPosts))
              });
           },1000)
            
           
          
      }
      const modalShow=(id)=>{
            setId(id)
            setShow(true)


      }

       const dataClear= (id)=>{
            db.posts1.delete(id)
            dispatch(fileClear(id))
            setShow(false)
       }

       
      const Download =()=>{
            myState.FileData.map((Element)=>{
            const {file}=Element
            return setitem(file)
      })
      
}

      return( 
      
 
            <div className="container mb-5">
                   <main className="App">
                  <Dropzone onDrop={onDrop}  />
                     </main>
          {myState.FileData.length>0 &&        
            <div className="row">
             <div className="col-12 mx-auto"> 
                <h5 className="mb-3">
                <strong></strong>
                </h5>
      
                    <table className="table  table-striped">
                        <thead>
                        <tr  className="">
                            <th className="col-sm-2">#</th>
                            <th  className="col-sm-3">Username</th>
                            <th className="col-sm-3">Date</th>
                            <th className="col-sm-3"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {   
                             myState.FileData &&(myState.FileData).map((Element,index)=>{
                                       const {id,filename,date} = Element
                                       return (
                                             <tr><td className="col-sm-2 py-4">{index+1}</td>
                                             <td className="col-sm-3 py-4" >{filename}</td>
                                             <td className=" col-sm-3 py-4">{date}</td>
                                             <td className="pt-3"><a href={item} download={filename} onClick={Download}><button type="button" className=" btn btn-primary mr-1">Download</button></a> 
                                             <button type="button" onClick={()=>modalShow(id)} className=" btn btn-danger col-sm-4  ">Remove</button>
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

{show && <Modal show={show}>
       <Modal.Header><h3>Remove Record</h3>
                   <button className="close" onClick={()=>setShow(false)} data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                            </button>
      </Modal.Header>
       <Modal.Body>Are you sure want to remove this record </Modal.Body>

       <Modal.Footer>
             <Button onClick={()=>dataClear(id)}>Yes</Button>
            
       </Modal.Footer>
     </Modal>}
    </div>

      )
}

export default UploadRecord;
