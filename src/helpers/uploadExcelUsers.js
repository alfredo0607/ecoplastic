import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";

export const handleSearchDataForExcelFile = (filters) => {
  const filterNames = filters
    .filter((item) => item[item.name])
    .map((item) => item.name);

  return filterNames;
};

export const generateExcelFile = ({ csvData, fileName }) => {
  const dataObject = {};
  const sheetNames = csvData.map((item) => item.title);

  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  for (const item of csvData) {
    dataObject[item.title] = XLSX.utils.json_to_sheet(item.data);
  }

  const wb = { Sheets: dataObject, SheetNames: sheetNames };
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: fileType });
  FileSaver.saveAs(data, fileName + fileExtension);
};
