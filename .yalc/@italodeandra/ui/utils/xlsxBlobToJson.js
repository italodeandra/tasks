import { showNotification } from "../components/Notifications";
import ExcelJS from "exceljs";
export default async function xlsxBlobToJson(event) {
    if (!event.target.files?.[0]) {
        showNotification({
            icon: "error",
            message: "Nenhum arquivo foi selecionado",
        });
        return;
    }
    const file = event.target.files[0];
    const data = await file.arrayBuffer(); // Read the file as an array buffer
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(data); // Load the workbook from the array buffer
    // Assuming the data is in the first sheet
    const worksheet = workbook.worksheets[0]; // Get the first worksheet
    const jsonData = [];
    // Convert the worksheet to JSON
    worksheet.eachRow((row) => {
        const rowData = [];
        row.eachCell((cell) => {
            rowData.push(cell.text); // Push the cell value to rowData
        });
        jsonData.push(rowData);
    });
    event.target.value = "";
    const headers = jsonData.shift();
    if (!headers) {
        return null;
    }
    const wrongValues = [];
    const json = [];
    for (const row of jsonData) {
        const object = {};
        if (row.length !== headers.length) {
            wrongValues.push(row);
        }
        else {
            for (let i = 0; i < headers.length; i++) {
                object[headers[i]] = row[i];
            }
            json.push(object);
        }
    }
    if (wrongValues.length) {
        showNotification({
            icon: "error",
            message: `A planilha está sendo importada em segundo plano mas ${wrongValues.length} itens foram ignorados por estarem com o formato errado`,
        });
        console.error(wrongValues);
    }
    else {
        showNotification({
            icon: "success",
            message: "A planilha está sendo importada em segundo plano",
        });
    }
    return json;
}
