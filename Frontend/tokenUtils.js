const TOKEN_KEY = "token";
const ROLE_KEY = "role"; //  Store user role separately

//  Get the token from local storage
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

//  Set the token and role in local storage
export const setToken = (token, role) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ROLE_KEY, role); //  Save user role
};

//  Get the stored user role
export const getUserRole = () => {
  return localStorage.getItem(ROLE_KEY);
};

//  Remove the token and role from local storage (logout)
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
};
