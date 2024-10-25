import React, { useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { HiMiniCamera } from "react-icons/hi2";
import { createServer } from "../../api/userService";
import { addServer } from "../../redux/serverSlice";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

const CLOUDINARY_URL =
  import.meta.env.VITE_CLOUDINARY_URL ||
  "https://api.cloudinary.com/v1_1/dyzlyiggq/image/upload";
const AddServerModal = ({ toggleModal, onServerAdded }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);

  const inputRef = useRef();

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [serverName, setServerName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleImageClick = () => {
    inputRef.current.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/jpg",
    ];
    if (file && validImageTypes.includes(file.type)) {
      setErrorMessage("");
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setErrorMessage("Please select a valid image file (JPEG, PNG, GIF).");
      setImage(null);
      setImagePreview("");
    }
  };

  const handleImageRemove = () => {
    setImage(null);
    setImagePreview("");
    setErrorMessage("");
  };

  const uploadImage = async () => {
    if (!image) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "Upload-img");
    try {
      const response = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const img_url = await uploadImage();
      const newServer = await createServer(currentUser.id, serverName, img_url);
      dispatch(addServer(newServer.server));
      onServerAdded();
      toast.success("Success to create server");
      toggleModal();
    } catch (error) {
      console.log(error);
      toast.error("Failed to create server:", error.message);
    }
  };
  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-[999]">
      <div className="max-w-[580px] bg-primary-1 rounded-md">
        <div className="p-4 rounded-t-md">
          <button
            onClick={toggleModal}
            className="text-zinc-400 hover:text-zinc-200 flex justify-end items-center w-full"
          >
            <IoClose size={24} />
          </button>
          <div className="py-3 px-4">
            <h2 className="text-2xl font-bold text-zinc-200 text-center">
              Customize your server
            </h2>
            <p className="text-center text-zinc-500 mt-1">
              Give your server a personality with a name and image. You can
              always change it later
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="py-5 px-4">
              <div className="flex items-center justify-center text-center">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      className="w-[100px] h-[100px] rounded-full object-cover"
                      src={imagePreview}
                      alt="serverImg"
                    />
                    <IoClose
                      size={24}
                      onClick={handleImageRemove}
                      className="bg-red-500 rounded-full cursor-pointer absolute top-0 right-0"
                    />
                  </div>
                ) : (
                  <div
                    onClick={handleImageClick}
                    className="w-[100px] h-[100px] p-8 flex flex-col justify-center items-center rounded-full border-dashed border-2 bg-zinc-600 cursor-pointer"
                  >
                    <input
                      type="file"
                      ref={inputRef}
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    <div className="flex flex-col justify-center items-center gap-1 text-zinc-300">
                      <HiMiniCamera size={30} />
                      <p className="uppercase text-xs font-semibold">Upload</p>
                    </div>
                  </div>
                )}
              </div>
              {errorMessage && (
                <p className="text-red-500 text-sm mt-2 text-center">
                  {errorMessage}
                </p>
              )}

              <div className="flex flex-col gap-2 mt-8">
                <label
                  htmlFor="serverName"
                  className="uppercase text-xs font-bold text-zinc-400"
                >
                  Server name
                </label>
                <input
                  id="serverName"
                  type="text"
                  value={serverName}
                  onChange={(e) => setServerName(e.target.value)}
                  className="bg-primary-3/80 py-2 px-3 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-300 outline-none rounded"
                  placeholder="Enter server name"
                />
              </div>
            </div>
          </form>
        </div>
        <div className="bg-primary-2 rounded-b-md p-4 text-zinc-300 flex items-center justify-end gap-2 ">
          <button
            onClick={handleSubmit}
            className={`px-8 py-3 rounded font-semibold text-sm ${
              serverName && image && !uploading
                ? "bg-main cursor-pointer hover:bg-main/85 text-white"
                : "bg-main/50 cursor-not-allowed text-zinc-400"
            }`}
          >
            {uploading ? "Uploading..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddServerModal;
