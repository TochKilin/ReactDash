import React, { useState } from "react";
import {Space,Input,Button,List,Table,message, Modal} from 'antd';

function RolePage() {

    const [state, setState] = useState({
         List: [],
        // List:[
        //     {
        //         id: 1,
        //         name : "admin",
        //         group : "admin",
        //     },
        //     {
        //         id: 2,
        //         name : "seo",
        //         group : "admin",
        //     },
        //     {
        //         id: 3,
        //         name : "IT manager",
        //         group : "It",
        //     },
        //     {
        //         id: 4,
        //         name : "IT Manger Assistance",
        //         group : "admin",
        //     },

        // ],
        loading: false,
        total:3333,

    });
        const onclicknew = ()=>{
        //create new record role
        // var objRole = {
        //     id: 1,
        //     name: "Mobile",
        //     group: "id",
        // };
        // setState((p)=>({
        //     ...p,
        //     List:[...p.List,objRole],
        // }));
    };

    const [objRole,setObjRole] = useState({
        id:"",
        name:"",
        group:"",
    });

    const [idEdit,setIdEdit] = useState(null);

    const onSave = () =>{
        //check required
        if(objRole.id == ""){
            message.success("please Enter id");
            return;
             
        }else if(objRole.name == ""){
             message.success("please Enter name");
            return;
        }else if(objRole.group == ""){
             message.success("please Enter group");
            return;
        }
        if(idEdit == null){
            //check id or role
        const indexFound = state.List.findIndex((item)=>item.id== objRole.id);
        //alert(indexFound);
        if(indexFound != -1){
            message.success("id Alread exsit");
            return;
        }
        //save
        setState((p)=>({
            ...p,
            List:[...p.List,objRole],
        }));
        //cleare when submit save
        setObjRole((p)=>({
             id:"",
            name:"",
            group:"",
        }));
            message.success("You Enter success");

        }else{
            //edit
            //save
        var indexUpdate = state.List.findIndex((item)=>item.id==idEdit);
        // state.List[indexUpdate].id = objRole.id;
        state.List[indexUpdate].name = objRole.name;
        state.List[indexUpdate].group = objRole.group;
        setState((p)=>({
            ...p,
            list:[...state.List], //refrest state
        }));
        //cleare when submit save
        setObjRole((p)=>({
             id:"",
            name:"",
            group:"",
        }));
            setIdEdit(null);
            message.success("Update  success");
        }
        
    }
    //cleare data
    const onClear = () =>{
        setObjRole((p)=>({
             id:"",
            name:"",
            group:"",
        }));
    }
    const onDelete = (item,index) =>{
        //alert(JSON.stringify(item));
        // alert(1);
        Modal.confirm({
            title:"delete data",
            content:"are you to delete this record?",
            onOk:()=>{
        const newList = state.List.filter((data) => data.id != item.id ); //remoce from list
        setState((p)=>({
            ...p,
            List:newList,
        }));
        message.success("delete succesfull");
            },
        });
        };

        const onEdit = (item,index) =>{
            setIdEdit(item.id);
            setObjRole((p)=>({
                ...p,
                ...item
                // id: item.id,
                // name: item.name,
                // group: item.group,

            }));
        };
    
    return(


    <div>
        <div className="main-page-header"> 
            <Space>  
                <div>  role,total{state.List.length}  </div>
                <Input.Search allowClear placeholder="Search"/>
             </Space> 

            <div>
            
               {/* <div>
                 <Button type="primary" onClick={onclicknew}>New</Button>
               </div> */}
            
            </div>
        </div>
            {/* <h1>{objRole.id}-{objRole.name}-{objRole.group}</h1> */}
            <div style={{padding:"20px",background:"pink",marginTop:"2px"}}>
                <Space>
                    <Input 
                    disabled={idEdit ? true :false}
                        placeholder="id" 
                        value={objRole.id} 
                        onChange={(event)=>
                        setObjRole(p=>({...p,id:event.target.value}))}/>
                    <Input placeholder="name" value={objRole.name} onChange={(event)=>
                        setObjRole(p=>({...p,name:event.target.value}))}/>
                    <Input placeholder="group" value={objRole.group} onChange={(event)=>
                        setObjRole(p=>({...p,group:event.target.value}))}/>
                    <Button onClick={onClear}>Clear</Button>
                    <Button type="primary" onClick={onSave}>{idEdit ? "Updat" : "Save New"}</Button>
                </Space>
            </div>
        {state.List.length == 0 && <div style={{textAlign:"center",marginTop:"20px",fontSize:"18px"}}>No Record</div>}
        {state.List.map((item,index)=>(
            <div key={index} style={{paddingBottom:"15px",backgroundColor:"#EEEE",marginBottom:"10px",borderRadius:"4px"}}>
               <Space>
               <div style={{
                width:"40px",
                height:"40px",
                borderRadius:"20px",
                backgroundColor:"gray"}}/>

               <div>
                <div style={{fontWeight:"bold"}}>{item.id}-{item.name}</div>
                <div>Dep.{item.group}</div>
                </div>
                </Space>
                <div style={{textAlign:"right"}}>
                <Space>
                 <Button type="primary" onClick={()=>onEdit(item,index)}>Edit</Button>
                <Button danger type="primary" onClick={()=>onDelete(item,index)}>
                    Delete
                </Button>
                </Space>
                </div>
            </div>
        ))}
    </div>

    )
}
export default RolePage;