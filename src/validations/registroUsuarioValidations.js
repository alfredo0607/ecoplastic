import * as yup from "yup";

/* Validations */
export const infoBasicaValidations = {
  cedula: yup
    .number()
    .positive("El numero de cedula no puede ser un numero negativo")
    .required("El nombre es obligatorio de llenar"),
  nombre: yup
    .string()
    .matches(
      /^([a-zA-Z ñÑ]+)$/,
      "El nombre no puede contener números ni caracteres especiales"
    )
    .required("El nombre es obligatorio de llenar"),
  email: yup
    .mixed()
    .notOneOf([""], "El correo no puede ser una cadena vacia")
    .required(),
  phone: yup
    .mixed()
    .notOneOf([""], "El celular no puede ser una cadena vacia")
    .required(),
  genero: yup
    .mixed()
    .notOneOf([""], "El genero no puede ser una cadena vacia")
    .required(),
};

export const infoUbicacionValidations = {
  ciudad: yup.string().required("El campo de ciudad no puede ir vacio"),
  localida: yup.string().required("El campo de localidad no puede ir vacio"),
  barrio: yup.string().required("El campo de barrio no puede ir vacio"),
};

export const infoContactoValidations = {
  contacto: yup.object({
    tipoNumero: yup
      .array()
      .min(
        1,
        "La información de contacto del usuario debe contener al menos 1 tipo de numero de contacto"
      )
      .compact(),
    numero: yup
      .array()
      .min(
        1,
        "La información de contacto del usuario debe contener al menos 1 número de contacto"
      )
      .compact(),
  }),
};

/* Default values */
export const infoBasicaDefaultValues = {
  cedula: "",
  nombre: "",
  email: "",
  celular: "",
  genero: "",
};

export const infoContactoDefaultValues = {
  contacto: { tipoNumero: [], numero: [] },
};
