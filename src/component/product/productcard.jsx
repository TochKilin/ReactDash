import { Button, Row } from "antd";
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa6";
import { productStore } from "../../Store/productStore";
import config from "../../utill/config";

// Component name should be capitalized
const Productcard = ({
  product_name,
  description,
  price,
  discount,
  image,
  id,
  onAddToBage,
  wislist,
}) => {
  //  const onAddToBage = () =>{
  //         //can post data to api
  //     }
  const { hanlewishlist } = productStore();
  const onAddTowislist = () => {
    const param = {
      id: id,
      wislist: wislist,
    };
    hanlewishlist(param);
  };
  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          padding: 10,
          backgroundColor: "#eee",
          //width:"100%",
          margin: 5,
          borderRadius: 10,

          //marginBottom:5
          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        }}
      >
        <img
          src={config.image_path + image}
          alt=""
          style={{ width: "100%", height: "340px" }}
        />
        <Row justify={"space-between"}>
          <div style={{ fontWeight: "bold", fontSize: 15, color: "red" }}>
            {product_name + ""}
          </div>
          {wislist ? (
            <FaHeart
              onClick={onAddTowislist}
              style={{ fontSize: 20, marginTop: 3 }}
            />
          ) : (
            <FaRegHeart
              onClick={onAddTowislist}
              style={{ fontSize: 20, marginTop: 3 }}
            />
          )}
        </Row>
        <div>{description}</div>
        <div>
          {price}$ {10}%
        </div>
        <div style={{ fontWeight: "bold", color: "green" }}>{price}$</div>

        <div style={{ textAlign: "right" }}>
          <Button onClick={onAddToBage} type="primary">
            Add to bag
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Productcard;
