import * as yup from "yup";

/* Validations */
export const newPostValidations = {
  publicationTitle: yup
    .string()
    .required("El area de titulo no puede estar vacia"),
  areas: yup.array().min(1, "Debes seleccionar almenos un area"),
  /*: yup
      .mixed()
      .notOneOf(['', null], 'El tipo de publicacion es un campo obligatorio')*/
};
