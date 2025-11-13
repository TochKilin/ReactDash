import { create } from 'zustand'
import samsung25 from "../assets/image/samsung25.avif";
import Item from 'antd/es/list/Item';
export const productStore = create((set) => ({

  list:[
    {
      id :1,
      name : "MaceBook 2022",
      Des:"Ram ssd33 14 inch",
      price: 2000,
      image : samsung25,
      wislist :1,
    },
    {
      id :2,
      name : "MaceBook 2023",
      Des:"Ram ssd33 14 inch",
      price: 2000,
       image : samsung25,
       wislist :0,
    },
    {
      id :3,
      name : "MaceBook 2023",
      Des:"Ram ssd33 14 inch",
      price: 2000,
       image : samsung25,
       wislist :1,
    },
    {
      id :4,
      name : "MaceBook 2023",
      Des:"Ram ssd33 14 inch",
      price: 2000,
       image : samsung25,
       wislist :1,
    },
    {
      id :5,
      name : "MaceBook 2023",
      Des:"Ram ssd33 14 inch",
      price: 2000,
       image : samsung25,
       wislist :0,
    },
    {
      id :6,
      name : "MaceBook 2023",
      Des:"Ram ssd33 14 inch",
      price: 2000,
       image : samsung25,
    },
    {
      id :7,
      name : "MaceBook 2023",
      Des:"Ram ssd33 14 inch",
      price: 2000,
      image : samsung25,
    },
    
    
  ],
  hanlewishlist : (param)  => {
    set((pre) =>{
      const indexproduct = pre.list?.findIndex((Item) => Item.id == param.id);
      //alert(indexproduct);
      pre.list[indexproduct].wislist = !param.wislist;//update only wishlist keyt
      pre.list[indexproduct].price = 3000;
      return{
        list : pre.list,
      }
    })
  },

}));
