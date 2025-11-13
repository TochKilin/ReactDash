import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// import profile_img from"../../assets/image/kilin.jpg";
import profile_img from "../assets/image/kilin.jpg";
//  profile: {
//     id : null,
//     name : null,
//     email : null,
//     image : profile_img,
//     address: "",
//     role : null,
//     permission : null,
//     menu: null,
//   },
//////---------reload data and refresh---------
// export const profileStore = create((set) => ({
//   //profile: null,
//   profile: null,
//   access_token: null,

//   // setProfile: (params) => set((pre) => ({ profile: {...pre.profile, ...params} })),

//   setProfile: (params) => set((pre) => ({ profile: params })),
//   setAccessToken: (params) => set((pre) => ({ access_token: params })),
//   logout: (params) => set((pre) => ({ profile: null })),

//   //   descrease: () => set((pre)=>({count: pre.count-1})),
//   //   reset: () => set({ count: 0, category:[] }),
//   //   update: (value) => set({ count: value }),
// }));

//-----------no reload data-----------
export const profileStore = create()(
  persist(
    (set, get) => ({
      profile: null,
      access_token: null,
      permission: null,
      setProfile: (params) => set((pre) => ({ profile: params })), //is a funtion
      setAccessToken: (params) => set((pre) => ({ access_token: params })), // is a function
      setPermission: (params) => set((pre) => ({ permission: params })), // is a function
      logout: (params) => set((pre) => ({ profile: null })),
    }),
    {
      name: "profile", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
