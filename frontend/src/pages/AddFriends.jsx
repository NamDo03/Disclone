import React, { useState } from "react";
import ImgaddFR from "../assets/Wumpus_None_Blocked.webp";
import { sendFriendInvite } from "../api/userService";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";

const AddFriends = () => {
  const [inputValue, setInputValue] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [color, setColor] = useState(null);
  const [borderColor, setBorderColor] = useState("border-white");
  const currentUser = useSelector((state) => state.user.currentUser);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setBorderColor("border-white");
  };

  const handleSendRequest = async () => {
    if (inputValue.trim() === "") return;

    setLoading(true);
    setMessage(null);
    try {
      if (!currentUser.id) {
        throw new Error("Missing authentication information");
      }

      // Gọi hàm sendFriendInvite với đúng tham số
      const result = await sendFriendInvite(currentUser.id, inputValue);
      setMessage(result.message);
      setColor("text-green");
      setBorderColor("border-green");
    } catch (error) {
      setMessage(error.message);
      setColor("text-red-500");
      setBorderColor("border-red-500");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-primary-1 h-screen text-white flex flex-col items-center p-4">
      <div className="flex flex-col bg-primary-1 p-8 rounded-lg w-full">
        <h2 className="text-xl font-bold mb-3">ADD FRIENDS</h2>
        <p className="mb-4 text-gray-300">
          You can add friends with their Discord username
        </p>
        <div className="relative w-full">
          <input
            type="text"
            placeholder="You can add friends with their Discord username"
            className={`bg-zinc-900 p-3 w-full text-white placeholder-zinc-500 rounded-md pr-40 border-[1px] ${borderColor}`}
            value={inputValue}
            onChange={handleInputChange}
          />
          <button
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-md w-28 h-10 text-sm ${
              inputValue.trim() === ""
                ? "cursor-not-allowed opacity-60"
                : "cursor-pointer opacity-100"
            }`}
            style={{
              backgroundColor: inputValue.trim() === "" ? "#5865F2" : "#5865F2",
            }}
            disabled={inputValue.trim() === "" || loading}
            onClick={handleSendRequest}
          >
            {loading ? "Sending..." : "Send Request"}
          </button>
        </div>

        {/* Thông báo kết quả */}
        {message && <p className={`mt-4 ${color}`}>{message}</p>}
      </div>

      <div className="flex flex-col items-center text-center border-t w-full">
        <img src={ImgaddFR} alt="Wumpus" className="mb-4 w-72 h-48" />
        <p className="text-gray-400 text-lg">
          Wumpus is waiting on friends. You don't have though!
        </p>
      </div>
    </div>
  );
};

export default AddFriends;
