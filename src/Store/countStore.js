import { create } from 'zustand'

export const countStore = create((set) => ({
  count: 10,
  category:[
    {
      id :1,
      name : "A"
    },
    {
      id :2,
      name : "B"
    }

  ],
  loading:false,
  increase: () => set((pre) => ({ count: pre.count + 1 })),
  descrease: () => set((pre)=>({count: pre.count-1})),
  reset: () => set({ count: 0, category:[] }),
  update: (value) => set({ count: value }),

}));
