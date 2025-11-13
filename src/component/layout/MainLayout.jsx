import React, { useEffect, useState } from "react";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Input, Layout, Menu, Space, theme } from "antd";
import { data, Outlet, useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/image/logo-1.jpg";
//import profile_img from"../../assets/image/kilin.jpg";
import profile_img from "../../assets/image/kilin.jpg";
import { countStore } from "../../Store/countStore";
import { profileStore } from "../../store/profileStore";
import { DownOutlined, SmileOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";
import config from "../../utill/config";

const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const items_menu_left_tmp = [
  getItem("Dashboard", "/", <PieChartOutlined />),
  getItem("POS", "/pos", <DesktopOutlined />),
  getItem("Order", "/order", <DesktopOutlined />),

  getItem("Report", "/report", <DesktopOutlined />, [
    getItem("Top Sale", "/report/top_sale"),
    getItem("Order", "/report/order"),
    getItem("Purchase", "/report/purchase"),
    getItem("Expense", "/report/expense"),
  ]),

  getItem("Costumer", "/costumer", <DesktopOutlined />, [
    getItem("Costumer", "/costumer"),
    getItem("Costumer type", "/costumer_type"),
  ]),

  getItem("Inventory", "/product", <UserOutlined />, [
    getItem("Product", "/product"),
    getItem("Product View Card", "/product-card"),
    getItem("Category", "/category"),
    getItem("Brand", "/brand"),
  ]),

  //getItem('product', '/product', <UserOutlined />),
  // getItem('about', '/about', <UserOutlined />),
  // getItem('Role', '/role', <UserOutlined />),
  //getItem('Category', '/category', <UserOutlined />),
  //getItem('province', '/province', <UserOutlined />),

  getItem("Purchase", "/purchase", <UserOutlined />, [
    getItem("Purchase", "/purchase"),
    getItem("Suplier", "/suplier"),

    //getItem('Alex', '5'),
  ]),

  getItem("Expens", "/expens", <UserOutlined />, [
    getItem("Expens", "/expens"),
    getItem("Expens type", "/expens_type"),

    //getItem('Alex', '5'),
  ]),

  getItem("Employee", "/employee", <UserOutlined />, [
    getItem("Position", "/position"),
    getItem("Employee", "/employee"),
    getItem("Payroll", "/payroll"),

    //getItem('Alex', '5'),
  ]),

  getItem("User", "/user", <UserOutlined />, [
    getItem("User", "/user"),
    getItem("Role", "/role"),
    getItem("Permission", "/permission"),
    //getItem('Alex', '5'),
  ]),
  getItem("Setting", "/setting", <UserOutlined />, [
    getItem("Language", "/lang"),
    getItem("Currency", "/currency"),
    getItem("Province", "/province"),
    getItem("Payment Method", "/payment_method"),

    //getItem('Alex', '5'),
  ]),
  //getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
  //getItem('Files', '9', <FileOutlined />),
];
console.log(items_menu_left_tmp);

const items_dropdown_profile = [
  {
    key: "1",
    label: "Change Profile",
    icon: <SmileOutlined />,
  },
  {
    key: "2",
    label: "Change Password",
    icon: <SmileOutlined />,
  },
  {
    key: "logout",
    label: "Logout",
    icon: <SmileOutlined />,
    danger: true,
  },
];

const MainLayout = () => {
  const { count } = countStore();
  const { profile, logout, permission } = profileStore();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const location = useLocation();

  useEffect(() => {
    //alert(JSON.stringify(permission));
    // alert(location.pathname);
    protectRoute();
    renderMenuLeft();
    if (!profile) {
      navigate("/login");
    }
  }, []);

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const protectRoute = () => {
    //const route_path = "/role";
    let findIndex = permission?.findIndex(
      (item) => "/" + item.web_route_key == location.pathname
    );

    if (findIndex == -1) {
      for (let i = 0; i < permission.length; i++) {
        //use for loop cuz support with break
        if (permission[i].web_route_key != null) {
          navigate(permission[i].web_route_key);
          break;
        }
      }
    }
  };

  const renderMenuLeft = () => {
    //level one
    let menu_left = [];
    items_menu_left_tmp?.map((item) => {
      // item.key
      let findLevelIndex = permission?.findIndex(
        (item1) => item.key == "/" + item1.web_route_key
      );
      if (findLevelIndex != -1) {
        menu_left.push(item);
      }
      //end level

      //level two 2

      if (item?.children && item?.children.length > 0) {
        let childTmp = [];
        item?.children.map((data1) => {
          permission?.map((data2) => {
            if ("/" + data2.web_route_key == data1.key) {
              childTmp.push(data1);
            }
          });
        });
        if (childTmp.length > 0) {
          item.children = childTmp; //update new childdren
          menu_left.push();
        }
      }

      //end level 2
    });

    setItems(menu_left);
    // permission
  };

  if (!profile) {
    return null;
  }
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
          onClick={(item) => navigate(item.key)}
        />
      </Sider>
      <Layout>
        {/* <Header style={{ padding: 0, background: colorBgContainer }} /> */}
        <div className="layout-header">
          <Space>
            <img src={logo} alt="" className="layout-logo" />
            <div>
              <div className="txt-branname">KILIN WEB</div>
              <div>BUILD IT TEAM</div>
            </div>
            <Input.Search placeholder="Search" />
          </Space>

          <div>
            <Dropdown
              menu={{
                items: items_dropdown_profile,
                onClick: (item) => {
                  if (item.key === "logout") {
                    navigate("login");
                    logout();
                  }
                  //alert(item.key)
                },
                //onClick : ((item) => navigate(item.key)),
              }}
            >
              {/* <a onClick={(e) => e.preventDefault()}> */}
              <Space>
                <Space>
                  <div>
                    <div className="txt-username">{profile?.name}</div>
                    <div> {profile?.role} </div>
                  </div>
                  <img
                    src={config.image_path + profile?.image}
                    alt=""
                    className="layout-profile"
                  />
                  {/* <h1>{profile?.image}</h1> */}
                </Space>
                <DownOutlined />
              </Space>
              {/* </a> */}
            </Dropdown>
          </div>
        </div>
        <Content style={{ margin: "0 16px" }}>
          {/* <Breadcrumb style={{ margin: '16px 0' }} items={[{ title: 'User' }, { title: 'Bill' }]} /> */}
          <div
            style={{
              padding: 24,
              minHeight: 600,
              marginTop: 10,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};
export default MainLayout;

// import { Outlet,Link } from "react-router-dom";

// const MainLayout = () => {
//     return (
//         <div>

//                 <div style={{background:"pink",padding:"10px"}}>

//                     <div>
//                         BrandName
//                     </div>
//                     <div>
//                         <Link to="/">Home</Link>
//                         <Link to="/about">About</Link>
//                         <Link to="/login">Login</Link>
//                         <Link to="/register">Register</Link>
//                     </div>

//                 </div>

//                 <div style={{backgroundColor:"red",height:"660px",padding:"10px"}}>
//                     <Outlet/>
//                 </div>
//                 <div style={{background:"pink",padding:"10px"}}>
//                     <h1>footer</h1>
//                     <div>Facebook</div>
//                     <div>Facebook</div>
//                     <div>Facebook</div>
//                     <div>Facebook</div>
//                 </div>

//         </div>
//     );
// };
// export default  MainLayout;
