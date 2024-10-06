import React, { useState } from "react";

const useModal = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const toggleModal = () => {
    setIsOpenModal((prev) => !prev);
  };
  return { isOpenModal, toggleModal };
};

export default useModal;
