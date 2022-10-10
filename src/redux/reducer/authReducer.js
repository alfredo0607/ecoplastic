import { authTypes, userTypes } from "../../types/types";

const initialState = {
  fetchingData: false,
  checkingSession: true,
  errorAuth: null,
  registerTemp: null,
  user: null,
  userDetail: null,
  business: null,
};

export const authReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case authTypes.authLoading:
      return { ...state, fetchingData: true, errorAuth: null };

    case authTypes.authCheckingSession:
      return { ...state, checkingSession: false };

    case authTypes.authLogin:
      return {
        ...state,
        errorAuth: null,
        fetchingData: false,
        checkingSession: false,
        user: { ...payload },
      };

    case authTypes.authLogout:
      return { ...state, user: null };

    case authTypes.authSetError:
      return {
        ...state,
        checkingSession: false,
        errorAuth: payload,
        fetchingData: false,
      };

    case authTypes.authRemoveError:
      return { ...state, fetchingData: false, errorAuth: null };

    case authTypes.authUpdateToken:
      return { ...state, user: { ...state.user, ...payload } };

    case authTypes.authRegister:
      return { ...state, registerTemp: { ...state.registerTemp, ...payload } };

    case authTypes.authRemoveRegister:
      return { ...state, registerTemp: {} };

    case userTypes.updateMemorandoLogin:
      return {
        ...state,
        user: {
          ...state.user,
          usuario: {
            ...state.user.usuario,
            memorandosPendientes: state.user.usuario.memorandosPendientes.map(
              (item) => {
                if (item.id === payload.id) {
                  return {
                    ...item,
                    estadoVisualizacion: 1,
                  };
                }

                return item;
              }
            ),
          },
        },
      };

    case authTypes.authUpdateTempPass:
      return {
        ...state,
        user: {
          ...state.user,
          usuario: {
            ...state.user.usuario,
            passTemporal: false,
          },
        },
      };

    case userTypes.updateImageUser:
      return {
        ...state,
        user: {
          ...state.user,
          usuario: {
            ...state.user.usuario,
            imagenUsuario: payload,
          },
        },
      };

    case userTypes.setDarkMode:
      return {
        ...state,
        user: {
          ...state.user,
          opciones: {
            ...state.user.opciones,
            temaApp: payload,
          },
        },
      };

    case userTypes.getDetailUsers:
      return { ...state, userDetail: { ...payload } };

    case userTypes.updateDetailUsers:
      return {
        ...state,
        userDetail: {
          ...state.userDetail,
          usersDetails: {
            ...state.usersDetails,
            ...payload,
          },
        },
      };

    case userTypes.getBusinesUsers:
      return { ...state, business: { ...payload } };

    case userTypes.updateDetailBusines:
      return {
        ...state,
        business: { ...payload },
      };

    default:
      return state;
  }
};
