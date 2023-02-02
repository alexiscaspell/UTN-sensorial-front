import React from "react";
import { loginUser, logout } from "../api/Api"

var UserStateContext = React.createContext();
var UserDispatchContext = React.createContext();

function userReducer(state, action) {
  switch (action.type) {
    case "LOGIN_USER_SUCCESS": 
      return { ...state, isAuthenticated: true, isAdmin: false };
    case "LOGIN_ADMIN_SUCCESS": 
      return { ...state, isAuthenticated: true, isAdmin: true };
    case "SIGN_OUT_SUCCESS":
      return { ...state, isAuthenticated: false, isAdmin: false };
    case "LOGIN_FAILURE":
      return { ...state };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function UserProvider({ children }) {
  var [state, dispatch] = React.useReducer(userReducer, {
    isAuthenticated: !!localStorage.getItem("id_token"),
    isAdmin: localStorage.getItem("rol_session")==="admin",
  });

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

function useUserState() {
  var context = React.useContext(UserStateContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
}

function useUserDispatch() {
  var context = React.useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }
  return context;
}


async function signOut(dispatch, history) {
  await logout();
  localStorage.removeItem("id_token");
  localStorage.removeItem("id_session");
  localStorage.removeItem("sens_name");
  localStorage.removeItem("rol_session");
  dispatch({ type: "SIGN_OUT_SUCCESS" });
  history.push("/");
}


const handleLoginUser = async (userDispatch,loginValue,passwordValue,history,setIsLoading,setLoginError,setServError) => {
  if (!!loginValue && !!passwordValue) {
  try {
      const res = await loginUser(loginValue,passwordValue)
      if(res.ok) {
        setLoginError(false)
        setServError(false);
        setIsLoading(true)
        const userSession = await res.json()
        //console.log(userSession)
        localStorage.setItem('id_session', userSession._id)
        localStorage.setItem('id_token', userSession.token)
        localStorage.setItem('sens_name', userSession.nombre)
        localStorage.setItem("rol_session", userSession.rol)
  
        setIsLoading(false);
        if(userSession.rol==="admin"){ 
          userDispatch({ type: 'LOGIN_ADMIN_SUCCESS' })
        } else {
          userDispatch({ type: 'LOGIN_USER_SUCCESS' })
        }
        history.push('/app/dashboards')
      } 
     else {
      setIsLoading(false);
      setLoginError(true);
      setTimeout(() => setLoginError(false), 5000);
    }
  } catch (e) {
      setIsLoading(false);
      setServError(true);
      setTimeout(() => setServError(false), 5000);

    }
  }
}

export { UserProvider, useUserState, useUserDispatch, signOut, handleLoginUser };
