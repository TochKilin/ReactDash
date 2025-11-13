import { useState } from "react";
import "./homePage.css";
import { Table, Tabs, Modal, Menu, Input, Button, Drawer } from "antd";
import { profileStore } from "../../../store/profileStore";

const HomePage = () => {
  const { permission } = profileStore();

  const [selectedUser, setSelectedUser] = useState("");
  const [checkedPermissions, setCheckedPermissions] = useState({});

  const users = [
    { id: 1, name: "Admin" },
    { id: 2, name: "Editor" },
    { id: 3, name: "Staff" },
  ];

  // Group permission by module
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

  // Handle checkbox toggle
  const handleCheck = (permName) => {
    setCheckedPermissions((prev) => ({
      ...prev,
      [permName]: !prev[permName],
    }));
  };

  const handleSave = () => {
    console.log("Saving permissions for:", selectedUser);
    console.log("Permissions:", checkedPermissions);
    alert(`Permissions saved for ${selectedUser}`);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Permission Management
      </h1>

      {/* User Select */}
      <div className="bg-white p-5 rounded-xl shadow mb-6">
        <label className="block mb-2 text-lg font-semibold text-gray-700">
          Select User / Role
        </label>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Choose User/Role --</option>
          {users.map((user) => (
            <option key={user.id} value={user.name}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      {/* Permission Grid */}
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
                    checked={!!checkedPermissions[perm.fullName]}
                    onChange={() => handleCheck(perm.fullName)}
                    className="ml-3 h-5 w-5 text-blue-600 accent-blue-500"
                  />
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          disabled={!selectedUser}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition"
        >
          Save Permissions
        </button>
      </div>
    </div>
  );
};

export default HomePage;
