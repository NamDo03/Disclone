import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { PiMagnifyingGlass } from "react-icons/pi";
import { IoChatbubbleSharp } from "react-icons/io5";
import { getFriends } from "../api/userService";
import { TiUserDelete } from "react-icons/ti";
import useModal from "../hooks/useModal";
import DeleteModal from "../components/Modal/DeleteModal";

const AllFriends = ({ setActiveComponent }) => {
  const { isOpenModal, toggleModal } = useModal();
  const [searchTerm, setSearchTerm] = useState("");
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUser = useSelector((state) => state.user.currentUser);
  const userId = currentUser?.id;

  useEffect(() => {
    const fetchFriends = async () => {
      if (!userId) {
        setError("User ID is not available");
        setLoading(false);
        return;
      }

      try {
        const data = await getFriends(userId);
        setFriends(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchFriends();
  }, [userId]);

  const handleDeleteFriend = (friendId) => {
    setFriends((prevFriends) =>
      prevFriends.filter((friend) => friend.id !== friendId)
    );
  };

  const filteredFriends = friends.filter((friend) =>
    friend.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center">Loading friends...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      <div className="flex items-center pl-10 pt-4">
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          type="text"
          className="bg-primary-3 py-2 rounded-md px-3 outline-none"
          placeholder="Search for friends"
        />
        <PiMagnifyingGlass
          size={24}
          className="text-zinc-400 absolute ml-[200px]"
        />
      </div>
      <div className="pl-10 pr-[300px]">
        <p className="text-zinc-400 text-md ml-2 mt-4">
          Total Friends - {filteredFriends.length}
        </p>
        <div className="h-[1px] mt-5 bg-zinc-500" />
        <div className="overflow-y-auto">
          {filteredFriends.length > 0 ? (
            filteredFriends.map((friend) => (
              <div
                key={friend.id}
                className="flex justify-between items-center px-3 py-2 rounded-lg group hover:bg-zinc-700"
              >
                <div className="flex items-center gap-3">
                  <img
                    className="w-9 h-9 object-cover rounded-full"
                    src={friend.avatar_url}
                    alt={friend.username}
                  />
                  <p className="text-zinc-300">{friend.username}</p>
                </div>
                {isOpenModal && (
                  <DeleteModal
                    onDeleteFriends={handleDeleteFriend}
                    toggleModal={toggleModal}
                    type="friends"
                    friendId={friend.id}
                  />
                )}
                <div className="flex gap-2">
                  <button className="px-4 py-2 rounded-[16px] hover:bg-primary-3 text-white">
                    <IoChatbubbleSharp size={24} />
                  </button>
                  <button
                    className="px-4 py-2 rounded-[16px] hover:bg-primary-3  hover:text-red-500  text-white flex items-center justify-center "
                    onClick={toggleModal}
                  >
                    <TiUserDelete size={27} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-zinc-400 text-center h-[200px] flex items-center justify-center uppercase font-semibold">
              <span> You don't have any friends yet.</span>
              <button
                className="ml-2 uppercase text-main"
                onClick={() => setActiveComponent("addFriends")}
              >
                Add more
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllFriends;
