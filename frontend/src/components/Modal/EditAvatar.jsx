import React, { useRef, useState } from "react";
import { HiMiniCamera } from "react-icons/hi2";
import { IoClose } from "react-icons/io5";
import { editUserAvatar } from "../../api/userService";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { updateAvatarUrl } from "../../redux/userSlice";

const CLOUDINARY_URL =
  import.meta.env.VITE_CLOUDINARY_URL ||
  "https://api.cloudinary.com/v1_1/dyzlyiggq/image/upload";

const EditAvatar = ({ toggleModal }) => {
  const dispatch = useDispatch();
  const inputRef = useRef();
  const currentUser = useSelector((state) => state.user.currentUser);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
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

  const handleEditAvatar = async () => {
    try {
      const img_url = await uploadImage();
      const newAvatar = await editUserAvatar(currentUser.id, img_url);
      dispatch(updateAvatarUrl(newAvatar.user.avatar_url));
      toast.success("Update avatar success");
      toggleModal();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update avatar", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-[999]">
      <div className="max-w-[580px] bg-primary-1 rounded-md">
        <div className="p-4 rounded-t-md">
          <button
            className="text-zinc-400 hover:text-zinc-200 flex justify-end items-center w-full"
            onClick={toggleModal}
          >
            <IoClose size={24} />
          </button>
          <div className="py-3 px-4">
            <h2 className="text-2xl font-bold text-zinc-200 text-center">
              Select an image
            </h2>
          </div>
          <form>
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
            </div>
          </form>
        </div>
        <div className="bg-primary-2 rounded-b-md p-4 text-zinc-300 flex items-center justify-end gap-2 ">
          <button
            onClick={handleEditAvatar}
            className={`px-8 py-3 rounded font-semibold text-sm ${
              image && !uploading
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

export default EditAvatar;
