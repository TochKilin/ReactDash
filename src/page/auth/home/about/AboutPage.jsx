import { Button, Col, Row } from "antd";
import { countStore } from "../../../../Store/countStore";
import { productStore } from "../../../../Store/productStore";
import ProductCard from "../../../../component/product/productCard";

const AboutPage = () =>{
    const {list} = productStore();
    const newlist = [list[1],list[4],list[6]];
    const onAddToBage = () =>{
        alert("test")
    }

    return (
        <div>

            <div>AboutPage</div>
            
            <Row>
            {newlist?.map((item,index)=>(
                <Col key={index} xs={24} md={8} lg={6}>
                    <ProductCard {...item} description={item.Des} onAddToBage={onAddToBage}/>
                </Col>
            ))}
            </Row>
        </div>
    );
};

export default AboutPage;
