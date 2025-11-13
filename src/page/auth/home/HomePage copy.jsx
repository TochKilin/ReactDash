import { useState } from "react";
import "./homePage.css";
import { Table, Tabs, Modal, Menu, Input, Button, Drawer } from "antd";
import { profileStore } from "../../../store/profileStore";

const HomePage = () => {
  const { permission } = profileStore();
  // Group permissions by module
  const modules = permission?.reduce((acc, perm) => {
    const [moduleName, action] = perm.name.split(".");
    const module = acc.find((m) => m.name === moduleName);
    if (module) {
      module.permissions.push({ name: action, fullName: perm.name });
    } else {
      acc.push({
        name: moduleName,
        permissions: [{ name: action, fullName: perm.name }],
      });
    }
    return acc;
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        User Permissions
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules?.map((module, idx) => (
          <div
            key={idx}
            className="bg-white border border-gray-200 rounded-xl shadow hover:shadow-lg transition p-5"
          >
            <h2 className="text-xl font-semibold text-blue-600 mb-4">
              {module.name}
            </h2>
            <div className="flex flex-col gap-2">
              {module.permissions.map((perm, i) => (
                <label
                  key={i}
                  className="flex items-center justify-between p-3 bg-gray-100 rounded-lg hover:bg-blue-50 cursor-pointer transition"
                >
                  <span className="text-gray-700 font-medium truncate">
                    {perm.name}
                  </span>
                  <input
                    type="checkbox"
                    className="ml-3 h-5 w-5 text-blue-600 accent-blue-500"
                  />
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
