import React, { Children } from "react";
import { Spin } from "antd";
function MainPage({loading=false,children}) {
    
    
    return (
        <div>
            <Spin spinning={loading}>
                {children}
            </Spin>
        </div>
    )
}

export default MainPage