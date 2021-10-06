import Dexie from 'dexie'
const productdb = (dbname,table)=>{
      const db = new Dexie(dbname);
      db.version(1).stores(table)
      db.open();
      return db
}
const bulkcreate = (dbtable,data)=>{
      let flag = empty(data)
      if(flag){
            dbtable.bulkAdd([data]);
            console.log("data inserted successfully")
      }
      else{
            console.log("please provide Data")
      }
      return flag
      
}

const empty = (object)=>{
      let flag =false;
      for (const value in object){
            if(object[value]!=="" && object.hasOwnProperty(value)){
                  flag=true;
            }
            else{
                  flag=false;           }
      }
      return flag
}
const getData = (dbname, fn) => {
      let index = 0;
      let obj = [];
      dbname.count(count => {
        
        if (count) {
          dbname.each(table => {
            obj = SortObj(table);
            fn(obj, index++); // call function with data argument
          });
        } else {
          fn(0);
        }
      });
    };
    
    const SortObj = (sortobj) => {
      let obj = [];
      obj = {
        id: sortobj.id,
        username: sortobj.username,
        full_name: sortobj.full_name,
        company: sortobj.company
      };
      return obj;
    }

export default productdb;
export {
      bulkcreate,
      getData
}