import dayjs from "dayjs";
import { profileStore } from "../Store/profileStore";
export const dateClient = (date, format = "DD/MM/YYYY h:m a") => {
  if (date) {
    return dayjs(date).format(format);
    return null;
  }
};

export const dateServer = (date, format = "YYYY-MM-DD h:m a") => {
  if (date) {
    return dayjs(date).format(format);
    return null;
  }
};

export const isPermissionAction = (permission_name) => {
  //"product.Create" "Cateogry.Create"
  const { permission } = profileStore.getState();
  if (permission) {
    let findIndex = permission?.findIndex(
      (item) => item.name == permission_name
    );
    //rk min see
    if (findIndex == -1) {
      return false; //no permission not found
    }
    return true;
  }
};
