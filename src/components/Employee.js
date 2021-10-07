import React, {useState,useEffect} from 'react';
import { Button, Modal } from 'react-bootstrap';
import Dexie from 'dexie';

import { useSelector, useDispatch } from 'react-redux';
import {addList, employeeUpdate,dataDelete,headerShow} from '../actions/AccountStatementAction'

function Employee() {
      const [username, setUsername] = useState("");
      const [full_name, setFull_name] = useState("");
      const [company, setCompany] = useState("");
      const [show, setShow]= useState(false) 
      const [showSpecial, setShowSpecial]= useState(false)
      const [id, setId] = useState("")
      const dispatch = useDispatch()
      const myState = useSelector((store)=> store.accountStatementReducer);
      
      const db = new Dexie("DexieEmployee");
     
      db.version(1).stores({
          Employee:'++id,username,full_name,company'
      })
     
      
      const getData1 = async() => {
            var allPosts = await db.Employee.toArray();
            console.log("allPosts",allPosts)
            dispatch(addList(allPosts))
            }
      
      useEffect(() => {
            getData1()

            dispatch(headerShow(false)) 
            
      },[])
     
    
      const handleSubmit= (e)=>{
            e.preventDefault();
            var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
            
            if(format.test(username) || format.test(full_name) || format.test(company))
            {
                  setShowSpecial(true)
            }
            else{
                  let object={
                        username:username,
                        full_name:full_name,
                        company:company
                       }
      
                       db.Employee.add(object).then(async() => {
                        let allPosts = await db.Employee.toArray();
                        dispatch(addList(allPosts))
                    });     
      
          
            
                setUsername("")
                setFull_name("")
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
      
      const update =(id,full_name)=>{
            var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
            if( format.test(full_name))
            {
                  setShowSpecial(true)
            }
            else{
            db.Employee.update(id,{"full_name":full_name}) 
      } }
      const update1 =(id,username)=>{
            var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
            if(format.test(username))
            {
                  setShowSpecial(true)
            }
            else{
            db.Employee.update(id,{"username":username}) 
            }      }
      const update2 =(id,company)=>{
            var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
            if(format.test(company))
            {
                  setShowSpecial(true)
            }else{
            db.Employee.update(id,{"company":company}) 
            }
      }
      const modalShow=(id)=>{
            setId(id)
            setShow(true)


      }
      const dataDelete1=(id)=>{
            db.Employee.delete(id)
            dispatch(dataDelete(id))
            setShow(false)    
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
                            <td className=" pt-3"><input className=""  type="text" onChange={(event)=> setUsername(event.target.value)}  onfocus="this.value=''" value={username}/></td>
                            <td className=" pt-3"><input className="" type="text" onChange={(event)=> setFull_name(event.target.value)}  value={full_name}/></td>
                            <td className=" pt-3"><input id="company" name="company" autoComplete="company" className="" type="text" onChange={(event)=> setCompany(event.target.value)}   value={company}/></td>
                            <td className=" pt-3"><button  type="submit" onClick={handleSubmit} className="btn btn-primary" style={{width: "80px"}}>Add</button></td>
                       </tr>
                        <tbody>
                        {
                      myState.EmployeeData[0] && (myState.EmployeeData).map((Element,index)=>{
                           const {id,username,full_name,company}=Element;
                           return (<tr>
                                       <td className="pt-3">{index+1}</td>
                                       <td className="col-3 pt-3"><input className="" value={username} onChange={(event)=> dispatch(employeeUpdate({
                                                   index: index,
                                                   type: 'username',
                                                   value: event.target.value
                                                   }))} onBlur={()=>update1(id,username)}/></td>   
                                       <td className="col-3 pt-3"><input className=""  onChange ={(event)=>dispatch(employeeUpdate({
                                             index:index,
                                             type:'fullname',
                                             value:event.target.value}))} value={full_name} onBlur={()=>update(id,full_name)}/></td>
                                       <td className="col-3 pt-3"><input  onChange={(event)=> dispatch(employeeUpdate({
                                             index:index,
                                             type:'company',
                                             value:event.target.value}))} value={company} onBlur={()=>update2(id,company)}/></td>

                                       <td className="col-3"><button type="button"  onClick={()=>modalShow(id)}  className="btn btn-danger">Remove</button></td>
                                       </tr>
                           )
                               
                           
                     })
               }
                        </tbody>
                    </table>
                    </form>
                
            </div>
        </div>
        {show && <Modal show={show}>
       <Modal.Header><h3>Remove Employee</h3>
       <button className="close" onClick={()=>setShow(false)} data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
       </Modal.Header>
       <Modal.Body>Are you sure want to remove this employee? </Modal.Body>

       <Modal.Footer>
             <Button onClick={()=>dataDelete1(id)} style={{width: "80px"}}>Yes</Button>
           
       </Modal.Footer>
     </Modal>}
     {showSpecial && <Modal show={showSpecial}>
       <Modal.Header><h3>Error</h3>
       <button className="close" onClick={()=>setShowSpecial(false)} data-dismiss="modal" aria-label="Close">
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
