const getTextColorForBackground = (colorHex) => {
  /* Get RGB from Hexadecimal color */
  // const red = colorHex.substring(0, 2);
  // const green = colorHex.substring(2, 4);
  // const blue = colorHex.substring(4, 6);

  /* Convert al values in INT of 16(hexadecimal) */
  // const intRed = parseInt(red, 16);
  // const intGreen = parseInt(green, 16);
  // const intBlue = parseInt(blue, 16);

  const totalColors = 0;
  //intRed + intGreen + intBlue;
  const numberComparator = (255 + 255 + 255) / 2;

  if (totalColors < numberComparator) return "#FFFFFF";
  else return "#000000";
};

export default getTextColorForBackground;
