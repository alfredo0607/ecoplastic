export const getMimeTypesForFiles = (names) => {
  let validTypes = {
    extensions: [],
    mimeTypes: [],
    names: names,
  };

  if (names.length === 0) {
    validTypes = {
      extensions: [
        "bmp",
        "gif",
        "jpeg",
        "jpg",
        "png",
        "pdf",
        "doc",
        "docm",
        "docx",
        "dotx",
        "dotm",
        "vnd.openxm",
        "xlsx",
        "xlsb",
        "xls",
        "xlsm",
        "csv",
        "tsv",
        "potm",
        "potx",
        "ppam",
        "pps",
        "ppsx",
        "ppsm",
        "ppt",
        "pptm",
        "pptx",
        "rar",
        "gzip",
        "zip",
        "x-zip-comp",
        "json",
        "txt",
      ],
      mimeTypes: [
        "image/bmp",
        "image/gif",
        "image/jpeg",
        "image/png",
        "application/pdf",
        "application/msword",
        "application/vnd.ms-word.document.macroEnabled.12",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
        "application/vnd.ms-word.template.macroEnabled.12",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel.sheet.binary.macroEnabled.12",
        "application/vnd.ms-excel",
        "application/vnd.ms-excel.sheet.macroEnabled.12",
        "application/vnd.ms-powerpoint.template.macroEnabled.12",
        "application/vnd.openxmlformats-officedocument.presentationml.template",
        "application/vnd.ms-powerpoint.addin.macroEnabled.12",
        "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
        "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
        "application/vnd.ms-powerpoint.slideshow.macroEnabled.12",
        "application/vnd.ms-powerpoint",
        "application/vnd.ms-powerpoint.presentation.macroEnabled.12",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/x-rar-compressed",
        "application/octet-stream",
        "application/zip",
        "application/octet-stream",
        "application/x-zip-compressed",
        "multipart/x-zip",
        "text/plain",
        "application/json",
      ],
      names: [
        "favoritos",
        "todos",
        "pdf",
        "media",
        "Documentos",
        "Excel",
        "Presentaciones",
        "Comprimidos",
        "Otros",
      ],
    };
  }

  for (const name of names) {
    if (name === "media") {
      validTypes = {
        ...validTypes,
        extensions: [
          ...validTypes.extensions,
          "bmp",
          "gif",
          "jpeg",
          "jpg",
          "png",
        ],
        mimeTypes: [
          ...validTypes.mimeTypes,
          "image/bmp",
          "image/gif",
          "image/jpeg",
          "image/png",
        ],
      };
    }

    if (name === "pdf") {
      validTypes = {
        ...validTypes,
        extensions: [...validTypes.extensions, "pdf"],
        mimeTypes: [...validTypes.mimeTypes, "application/pdf"],
      };
    }

    if (name === "Documentos") {
      validTypes = {
        ...validTypes,
        extensions: [
          ...validTypes.extensions,
          "doc",
          "docm",
          "docx",
          "dotx",
          "dotm",
          "vnd.openxm",
        ],
        mimeTypes: [
          ...validTypes.mimeTypes,
          "application/msword",
          "application/vnd.ms-word.document.macroEnabled.12",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
          "application/vnd.ms-word.template.macroEnabled.12",
        ],
      };
    }

    if (name === "Excel") {
      validTypes = {
        ...validTypes,
        extensions: [
          ...validTypes.extensions,
          "xlsx",
          "xlsb",
          "xls",
          "xlsm",
          "csv",
          "tsv",
        ],
        mimeTypes: [
          ...validTypes.mimeTypes,
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-excel.sheet.binary.macroEnabled.12",
          "application/vnd.ms-excel",
          "application/vnd.ms-excel.sheet.macroEnabled.12",
        ],
      };
    }

    if (name === "Presentaciones") {
      validTypes = {
        ...validTypes,
        extensions: [
          ...validTypes.extensions,
          "potm",
          "potx",
          "ppam",
          "pps",
          "ppsx",
          "ppsm",
          "ppt",
          "pptm",
          "pptx",
        ],
        mimeTypes: [
          ...validTypes.mimeTypes,
          "application/vnd.ms-powerpoint.template.macroEnabled.12",
          "application/vnd.openxmlformats-officedocument.presentationml.template",
          "application/vnd.ms-powerpoint.addin.macroEnabled.12",
          "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
          "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
          "application/vnd.ms-powerpoint.slideshow.macroEnabled.12",
          "application/vnd.ms-powerpoint",
          "application/vnd.ms-powerpoint.presentation.macroEnabled.12",
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        ],
      };
    }

    if (name === "Comprimidos") {
      validTypes = {
        ...validTypes,
        extensions: [
          ...validTypes.extensions,
          "rar",
          "gzip",
          "zip",
          "x-zip-comp",
        ],
        mimeTypes: [
          ...validTypes.mimeTypes,
          "application/x-rar-compressed",
          "application/octet-stream",
          "application/zip",
          "application/octet-stream",
          "application/x-zip-compressed",
          "multipart/x-zip",
        ],
      };
    }

    if (name === "Otros") {
      validTypes = {
        ...validTypes,
        extensions: [...validTypes.extensions, "json", "txt"],
        mimeTypes: [...validTypes.mimeTypes, "text/plain", "application/json"],
      };
    }
  }

  return validTypes;
};

export const getExtensionsByName = (name) => {
  if (name === "media") {
    return ["bmp", "gif", "jpeg", "jpg", "png"];
  }

  if (name === "pdf") {
    return ["pdf"];
  }

  if (name === "Documentos") {
    return ["doc", "docm", "docx", "dotx", "dotm", "vnd.openxm"];
  }

  if (name === "Excel") {
    return ["xlsx", "xlsb", "xls", "xlsm", "csv", "tsv"];
  }

  if (name === "Presentaciones") {
    return [
      "potm",
      "potx",
      "ppam",
      "pps",
      "ppsx",
      "ppsm",
      "ppt",
      "pptm",
      "pptx",
    ];
  }

  if (name === "Comprimidos") {
    return ["rar", "gzip", "zip", "x-zip-comp"];
  }

  if (name === "Otros") {
    return ["json", "txt"];
  }

  return [];
};
