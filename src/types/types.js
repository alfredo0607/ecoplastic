export const authTypes = {
  authLoading: "[AUTH] Fetching Data",
  authLogin: "[AUTH] Login",
  authLogout: "[AUTH] Logout user",
  authRegister: "[AUTH] Update temp data for register",
  authRemoveRegister: "[AUTH] Remove temp data for register",
  authSetError: "[AUTH] Set error from auth",
  authRemoveError: "[AUTH] Remove error from auth",
  authUpdateTempPass: "[AUTH] Update temporal password",

  authUpdateToken: "[AUTH] Renew user token",
  authCheckingSession: "[AUTH] Checking session",
};

export const userTypes = {
  updateImageUser: "[USER BASIC] Update the profile image of actual user",
  setDarkMode: "[USER BASIC] Set the dark mode or remove",
  updateMemorandoLogin: "[USER BASIC] update status of a memorando in login",
  getDetailUsers: "[USER BASIC] get details users",
  updateDetailUsers: "[USER BASIC] update details users",

  getBusinesUsers: "[USER BASIC] get details business",
  updateDetailBusines: "[USER BASIC] update details business",
  updateEmpresaImage: "[USER BASIC] update image business",
};
