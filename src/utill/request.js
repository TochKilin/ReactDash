import axios from "axios";
import config from "./config";
import { profileStore } from "../store/profileStore";

export const request = (url = "", method = "", data = {}) => {
  let { access_token } = profileStore.getState();

  let headers = {
    "Content-Type": "application/json", // data = json
  };
  if (data instanceof FormData) {
    headers = {
      "Content-Type": "multipart/form-data", // data = form data
    };
  }
  return axios({
    url: config.base_url + url,
    method: method, //can have get post put delete
    data: data,
    headers: {
      ...headers,
      Accept: "application/json",
      Authorization: "Bearer " + access_token,
    },
  })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error);
      const response = error.response;
      if (response) {
        const status = response.status;
        const data = response.data;

        let errors = {};
        //const message = data?.message;
        // let errors = {
        //   message: data?.message,
        // };

        if (status == 500) {
          errors.message = "Internal Server Errors please contact Admin";
        }

        if (data.errors) {
          Object.keys(data.errors).map((key) => {
            errors[key] = {
              help: data.errors[key][0], //error message
              validateStatus: "error",
              hasFeedback: true,
            };
          });
        }
        //    Object.keys(data.errors).map((key)=>{
        //         errors[key] = {

        //             help:data.errors[key][0], //error message
        //             validateStatus:"error",
        //             hasFeedback:true,

        //         };
        //    });

        //  name : {
        //  validateStatus:"error",
        //  help:"Please fill Name",
        //  hasFeedback:true,
        // },
        // code : {
        // validateStatus:"error",
        //  help:"Please fill Code",
        //  hasFeedback:true,
        // },
        console.log(errors);
        return {
          // status: status,
          errors: errors,
          // message : message
        };

        // switch(status){
        //     case 404:{
        //         //unprocessable Content
        //         return{
        //             status: status,
        //             ...data
        //         }
        //         break;
        //     }
        // }
      }
    });
};
