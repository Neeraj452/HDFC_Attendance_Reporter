import React, {useState, useEffect,useCallback} from 'react'
import { useSelector, useDispatch} from 'react-redux';
import Dexie from "dexie";
import { Button, Modal } from 'react-bootstrap';
import {fileUpload,fileClear,headerShow,sendFile} from '../actions/AccountStatementAction'
import Dropzone from './Dropzone';
import PromisifyFileReader from 'promisify-file-reader';
function UploadRecord() {
      const [show, setShow]= useState(false) 
      const [id, setId] = useState("")
      const dispatch = useDispatch()
      const myState = useSelector((store)=> store.accountStatementReducer)
      console.log("myState",myState.FileData)
      const db = new Dexie("ReactDexie");
      db.version(1).stores({
          posts1: "++id,id1, No,Mchn, EnNo, Name, Mode, IOMd, DateTime"
      })
      db.version(1).stores({
            posts: "++id,id2,filename,date"
        })
      db.open().catch((err) => {
          console.log(err.stack || err)
      })
     
     
      const onDrop = useCallback(acceptedFiles => {
            console.log("acceptedFiles",acceptedFiles)
            handalFile(acceptedFiles[0]);
          });
      
          myState.FileData.sort((a, b) =>{
          let da =(new Date(a.date)).getTime()/1000.0,
              db = (new Date(b.date)).getTime()/1000.0;
           return db - da;
           });

      const getPosts = async() => {
            var allPosts = await db.posts.toArray();
            console.log("allPosts",allPosts)
            dispatch(fileUpload(allPosts))
           
        }
      
       useEffect(()=>{
              getPosts(); 
              dispatch(headerShow(false)) 
        
       },[]) 
     
       const saveLineToStorageUtils= async(line)=>{
            
            if (!line || !line.trim()) return;
            let lineParts = line.split("\t").map(linePart => linePart.trim());
            console.log("lineParts",lineParts)
            let objectToStore = {
                  id1:random,
                  No:lineParts[0],
                  Mchn:lineParts[1],
                  EnNo:lineParts[2],
                  Name:lineParts[3], 
                  Mode:lineParts[4],
                  IOMd:lineParts[5],
                  DateTime:lineParts[6],
            }
             db.posts1.add(objectToStore);
       }
       var random=Math.random()
      const handalFile =async(FileObjects)=>{
            
            console.log(FileObjects)

            console.log("FileObjectsname",FileObjects.name);
            let lines = ( await PromisifyFileReader.readAsText(FileObjects)).split("\n");
             console.log("line", lines)
            
             for (let i = 1; i < lines.length; i++) {
                  let line = lines[i];
                  saveLineToStorageUtils(line);
              }

            
      
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
            let object ={
                  id2:random,
                  filename:FileObjects.name,
                  date:date
            }

            db.posts.add(object).then(async() => {
                  let allPosts = await db.posts.toArray();
                  dispatch(fileUpload(allPosts))
              });
      
            
         
      }

      

      const modalShow=(id)=>{
            setId(id)
            setShow(true)


      }

       const dataClear= (id2)=>{
            db.posts1.delete(id2)
            db.posts.delete(id2)
            dispatch(fileClear(id2))
            setShow(false)
       }

       
      const Download =async(id2)=>{
            let text=[]
              let  allDataFile1=await db.posts1.toArray()
              let finaldata=allDataFile1.filter((Element)=>{
                    return Element.id1===id2
              })
              await finaldata.map((Element,index)=>{
                    const{No,Mchn, EnNo, Name, Mode, IOMd, DateTime}=Element
                    text[0]= "No"+"     "+"Mchn" +"     " + "EnNo"+"        "  +" Name"+"    "  + "Mode"+"    " +" IOMd"+"    " +"DateTime"
                    text[index+1]= No +" "+ Mchn +"      "+  EnNo +"     "+  Name +"    "+  Mode +"          "+  IOMd +"   "+  DateTime;
              })
              text = text.join("\n")
              console.log("finaldata", text)
              setTimeout(await function(){
              const element = document.createElement("a");
              const file = new Blob([text], {type: 'text/plain'});
              element.href = URL.createObjectURL(file);
              element.download = "filename";
              document.body.appendChild(element);
              element.click();
              },1000)
              return 
      
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
                                       const {id,id2,filename,date} = Element
                                       return (
                                             <tr><td className="col-sm-2 py-4">{index+1}</td>
                                             <td className="col-sm-3 py-4" >{filename}</td>
                                             <td className=" col-sm-3 py-4">{date}</td>
                                             <td className="pt-3"><button type="button" onClick={()=>Download(id2)} className=" btn btn-primary mr-1">Download</button> 
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
       <Modal.Body>Are you sure want to remove this record? </Modal.Body>

       <Modal.Footer>
             <Button onClick={()=>dataClear(id)} style={{width: "80px"}}>Yes</Button>
            
       </Modal.Footer>
     </Modal>}
    </div>

      )
     
}

export default UploadRecord;


