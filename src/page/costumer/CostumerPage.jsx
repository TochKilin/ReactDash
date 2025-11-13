import { Button } from "antd";
import React from "react";
import { MdDelete,MdEdit } from "react-icons/md";
import { } from "react-icons/md";
function CostumerPage() {

    return (
        <div>
            <MdDelete style={{color:"red",fontSize:"33"}}/>
            <Button onClick={()=>alert("click me")}><MdDelete style={{color:"red",fontSize:"14"}}/></Button>
            <Button><MdEdit style={{color:"red",fontSize:"14"}}/></Button>
            <h1>Costumer</h1>
        </div>
    )
}
export default CostumerPage;