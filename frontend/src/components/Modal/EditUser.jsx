import React, { useState, useRef, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";


const EditUserModal = ({ toggleModal, user }) => {
  const token = localStorage.getItem("token");
  const inputRef = useRef();
  

  const [image] = useState(user.avatar || "");
  const [username, setUsername] = useState(user.username || "");
  const [email, setEmail] = useState(user.email || "");
  const [password, setPassword] = useState("1234567890"); 
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        toggleModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [toggleModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username,
          email,
          avatar: image,
          password, 
        }),
      });

      toast.success("User updated successfully!");
      setTimeout(() => {
        setLoading(false);
        toggleModal();
      }, 1000);
    } catch (error) {
      toast.error("Failed to update user information");
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    setLoading(true);
    try {
      await fetch(`/api/users/${user.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("User deleted successfully!");
      setTimeout(() => {
        setLoading(false);
        toggleModal();
      }, 1000);
    } catch (error) {
      toast.error("Failed to delete user");
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center">
      <div className="bg-[#2f3136] rounded-lg p-6 w-[500px] max-w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white">My Account</h2>
          <button
            onClick={toggleModal}
            className="text-white hover:text-gray-400 flex items-center"
          >
            <IoClose size={24} />
          </button>
        </div>
        <div className="overflow-y-auto">
          <div className="flex items-center mb-4">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Cat_November_2010-1a.jpg/1200px-Cat_November_2010-1a.jpg"
              alt="Avatar"
              className="w-[72px] h-[72px] rounded-full object-cover"
            />
            <div className="ml-4">
              <h3 className="text-white text-2xl">{username}</h3>
            </div>
          </div>
          <div className="bg-primary-3 rounded-lg p-4 mb-4">
            <div className="mb-4">
              <label className="text-sm text-gray-400 block">User Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 my-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="text-sm text-gray-400 block">Email</label>
              <p className="text-white">{email}</p>
            </div>
            <div className="mb-4">
              <label className="text-sm text-gray-400 block">Password</label>
              <div className="flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-2 my-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} 
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="ml-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={handleDelete}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 transition"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete User"}
          </button>
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={toggleModal}
            className="mr-4 px-5 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={`px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-500 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("root")
  );
};

export default EditUserModal;
