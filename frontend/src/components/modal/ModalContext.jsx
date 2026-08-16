import React, { createContext, useContext, useState } from "react";

const ModalContext = createContext(null);

export const useAppModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [modal, setModal] = useState({
    visible: false,
    type: "success",
    message: "",
    navigateRoute: null,
  });

  const showModal = ({ type = "success", message, navigateRoute = null }) => {
    setModal({
      visible: true,
      type,
      message,
      navigateRoute,
    });
  };

  const hideModal = () => {
    const route = modal.navigateRoute;

    setModal({
      visible: false,
      type: "success",
      message: "",
      navigateRoute: null,
    });

    if (route) {
      window.location.href = route;
    }
  };

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}

      {modal.visible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-[280px] rounded-xl bg-white p-6 text-center shadow-2xl">
            <h2
              className={`text-lg font-bold ${
                modal.type === "error" ? "text-red-500" : "text-green-500"
              }`}
            >
              {modal.type.toUpperCase()}
            </h2>

            <p className="mt-3 text-gray-700">{modal.message}</p>

            <button
              onClick={hideModal}
              className="mt-5 rounded-lg bg-black px-6 py-2 text-white hover:bg-gray-800"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};
