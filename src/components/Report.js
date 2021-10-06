import React,{useEffect} from 'react';

import {headerShow} from '../actions/AccountStatementAction'
import {useDispatch} from 'react-redux'

function Report() {
     const dispatch = useDispatch()

      useEffect(() => {
           dispatch(headerShow())
      }, [])
      return (
            <div>          
             <div>
               <h1>WelCome to Reporter</h1>    
            </div>
            </div> 

)
}

export default Report
