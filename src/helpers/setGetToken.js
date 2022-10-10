export const setUserToken = (token) =>
  localStorage.setItem("userToken", btoa(token));

export const getUserToken = () => {
  if (localStorage.getItem("userToken"))
    return atob(localStorage.getItem("userToken"));
  else return null;
};
