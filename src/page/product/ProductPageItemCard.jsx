import { useEffect, useState } from "react";
import Productcard from "../../component/product/productCard";
import { productStore } from "../../Store/productStore";

import { Row, Col, Button } from "antd";
import { request } from "../../utill/request";

function ProductPageItemCard() {
  // const { list, hanlewishlist } = productStore(); //take form global status

  const [state, setState] = useState({
    //declare jea object
    list: [],
    total: 0,
    loading: false,
    open: false,
    // validate: {},
  });

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    setState((p) => ({
      ...p,
      loading: true,
    }));

    // send to api  localhost:8000/api/category?page1&text_search=admin form is query parameter
    const res = await request("products", "get");
    // console.log(res);
    if (res && !res.errors) {
      setState((pre) => ({
        ...pre,
        list: res.list,
        loading: false,
      }));
    } else {
      setState((p) => ({
        ...p,
        loading: false,
      }));
    }
  };

  return (
    <div>
      <div>Product Card</div>

      <Row gutter={[16, 16]}>
        {state.list?.map((item, index) => (
          <Col key={index} xs={24} md={8} lg={6}>
            <Productcard {...item} />
          </Col>
        ))}
      </Row>
    </div>
  );
}
export default ProductPageItemCard;
