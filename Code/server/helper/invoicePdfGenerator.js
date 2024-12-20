// const fs = require('fs');
// const PDFDocument = require('pdfkit');

// // Function to generate PDF with custom data
// const generatePDF = (data, filePath) => {
//     // console.log(data?.invoiceArrayData, "invoice data")
//     return new Promise((resolve, reject) => {
//         try {
//             const doc = new PDFDocument();
//             doc.pipe(fs.createWriteStream(filePath));

//             // Custom PDF design and data manipulation
//             doc.fontSize(12);
//             doc.text('Invoice Details', { align: 'center', underline: true });
//             doc.moveDown();
//             doc.fontSize(10);
//             doc.text(`Patient ID: ${data?.invoiceArrayData?.patientId}`);
//             doc.text(`Total Cost: $${data?.invoiceArrayData?.totalCost}`);
//             doc.moveDown();

//             doc.text('Order Details', { align: 'center', underline: true });
//             doc.moveDown();
//             data?.invoiceArrayData[0]?.invoiceDetail.forEach((order, index) => {
//                 doc.text(`Order ${index + 1}:`);
//                 doc.text(`Order ID: ${order.orderId}`);
//                 // Add more order details as needed
//                 doc.moveDown();
//             });

//             doc.end();
//             resolve();
//         } catch (error) {
//             reject(error);
//         }
//     });
// };


// module.exports = generatePDF


// const fs = require('fs');
// const PDFDocument = require('pdfkit');
// const moment = require('moment');
// //const logoPath = '../../../assets/images/Logo.png'; // Path to your logo image

// const generatePDF = (data, filePath) => {
//     return new Promise((resolve, reject) => {
//         try {
//             const doc = new PDFDocument();
//             doc.pipe(fs.createWriteStream(filePath));

//             // Add invoice details at the top
//             doc.fontSize(12).text("INVOICE", { align: 'center' });
//             doc.fontSize(10)
//                 .text(`Invoice ID: ${data?.invoiceArrayData[0]?.invoiceId}`, 15, 40)
//                 .text(`Invoice Date: ${moment(data?.invoiceArrayData[0]?.createdAt).format("MM-DD-YYYY")}`, 15, 50)
//                 .text(`Patient Name: ${data?.invoiceArrayData[0]?.patientId.fName} ${data?.invoiceArrayData[0]?.patientId.lName}`, 133, 40)
//                 .text(`Email: ${data?.invoiceArrayData[0]?.patientId.email}`, 133, 50);

//             // Add space
//             doc.text("", 10, 80);

//             // Add table headers
//             const columnWidths = [100, 100, 50, 75, 75]; // Define column widths
//             const headerTexts = ["Order ID", "Exam", "Unit", "Unit Price ($)", "Cost ($)"]; // Define column headers
//             doc.fontSize(10);
//             let currentY = doc.y;
//             headerTexts.forEach((header, index) => {
//                 doc.text(header, 15 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0), currentY);
//             });
//             doc.moveDown(); // Move to the next line

//             // Add table rows
//             const rows = data?.invoiceArrayData[0]?.invoiceDetail.map(item => [
//                 item.orderId,
//                 item.examId,
//                 item.unit,
//                 item.unitPrice,
//                 item.cost
//             ]);
//             rows.forEach(row => {
//                 currentY = doc.y;
//                 row.forEach((cell, index) => {
//                     doc.text(cell.toString(), 15 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0), currentY);
//                 });
//                 doc.moveDown(); // Move to the next line
//             });

//             // Add notes
//             doc.fontSize(10).text(`Notes: ${data?.invoiceArrayData[0]?.notes}`, { align: 'left' });

//             doc.end();
//             resolve();
//         } catch (error) {
//             reject(error);
//         }
//     });
// };

// module.exports = generatePDF;

const fs = require('fs');
const PDFDocument = require('pdfkit');
const moment = require('moment');

// const generatePDF = (data, filePath) => {
//     return new Promise((resolve, reject) => {
//         try {
//             const doc = new PDFDocument();
//             doc.pipe(fs.createWriteStream(filePath));

//             // Add invoice details at the top
//             doc.fontSize(12).text("INVOICE", { align: 'center' });
//             doc.fontSize(10)
//                 .text(`Invoice ID: ${data?.invoiceArrayData[0]?.invoiceId}`, 15, 40)
//                 .text(`Invoice Date: ${moment(data?.invoiceArrayData[0]?.createdAt).format("MM-DD-YYYY")}`, 15, 50)
//                 .text(`Patient Name: ${data?.invoiceArrayData[0]?.patientId.fName} ${data?.invoiceArrayData[0]?.patientId.lName}`, 400, 40)
//                 .text(`Email: ${data?.invoiceArrayData[0]?.patientId.email}`, 400, 50);

//             // Add space
//             doc.text("", 10, 150);

//             // Add table headers
//             const columnWidths = [100, 100, 50, 75, 75]; // Define column widths
//             const headerTexts = ["Order ID", "Exam", "Unit", "Unit Price ($)", "Cost ($)"]; // Define column headers
//             doc.fontSize(10).fillColor('#FFFFFF').fillOpacity(0.8);
//             let currentY = doc.y;
//             headerTexts.forEach((header, index) => {
//                 doc.rect(15 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0), currentY, columnWidths[index], 20).fillAndStroke('#5ac8fa', '#000000');
//                 doc.fill('#000000').text(header, 15 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0) + 5, currentY + 5);
//             });
//             doc.fill('#000000');
//             doc.moveDown(); // Move to the next line

//             // Add table rows
//             const rows = data?.invoiceArrayData[0]?.invoiceDetail.map(item => [
//                 item.orderId,
//                 item.examId,
//                 item.unit,
//                 item.unitPrice,
//                 item.cost
//             ]);
//             rows.forEach((row, rowIndex) => {
//                 currentY = doc.y;
//                 row.forEach((cell, index) => {
//                     doc.rect(15 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0), currentY, columnWidths[index], 20).fillAndStroke('#FFFFFF', '#000000');
//                     doc.fill('#000000').text(cell.toString(), 15 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0) + 5, currentY + 5);
//                 });
//                 doc.fill('#000000');
//                 doc.moveDown(); // Move to the next line
//             });

//             // Add address with word wrap
//             const addressLines = [
//                 `Address: ${data?.invoiceArrayData[0]?.patientId.address}`,
//                 `${data?.invoiceArrayData[0]?.patientId.country}`,
//                 `Postal Code: ${data?.invoiceArrayData[0]?.patientId.postalCode}`
//             ];
//             doc.text(addressLines.join('\n'), 400, 60);

//             // Add notes
//             doc.fontSize(10).text(`Notes: ${data?.invoiceArrayData[0]?.notes}`, { align: 'left' });

//             doc.end();
//             resolve();
//         } catch (error) {
//             reject(error);
//         }
//     });
// };



// const generatePDF = (data, filePath) => {
//     return new Promise((resolve, reject) => {
//         try {
//             const doc = new PDFDocument();
//             doc.pipe(fs.createWriteStream(filePath));

//             // Add invoice details at the top
//             doc.fontSize(12).text("INVOICE", { align: 'center' }, 70, 70);
//             doc.fontSize(10)
//                 .text(`Invoice ID: ${data?.invoiceArrayData[0]?.invoiceId}`, 85, 130)
//                 .text(`Invoice Date: ${moment(data?.invoiceArrayData[0]?.createdAt).format("MM-DD-YYYY")}`, 85, 150)
//                 .text(`Patient Name: ${data?.invoiceArrayData[0]?.patientId.fName} ${data?.invoiceArrayData[0]?.patientId.lName}`, 400, 130)
//                 .text(`Email: ${data?.invoiceArrayData[0]?.patientId.email}`, 400, 150);

//             // Add space
//             doc.text("", 10, 260);

//             // Add table headers
//             const columnWidths = [100, 150, 50, 75, 75]; // Define column widths
//             const headerTexts = ["Order ID", "Exam", "Unit", "Unit Price ($)", "Cost ($)"]; // Define column headers
//             doc.fontSize(10).fillColor('#FFFFFF').fillOpacity(0.8);
//             let currentY = doc.y;
//             const tableStartX = (doc.page.width - columnWidths.reduce((acc, width) => acc + width, 0)) / 2; // Centering the table
//             headerTexts.forEach((header, index) => {
//                 doc.rect(tableStartX + columnWidths.slice(0, index).reduce((a, b) => a + b, 0), currentY, columnWidths[index], 20).fillAndStroke('#5ac8fa', '#000000');
//                 doc.fill('#000000').text(header, tableStartX + columnWidths.slice(0, index).reduce((a, b) => a + b, 0) + 5, currentY + 5);
//             });
//             doc.fill('#000000');
//             doc.moveDown(); // Move to the next line

//             // Add table rows
//             const rows = data?.invoiceArrayData[0]?.invoiceDetail.map(item => [
//                 item.orderId,
//                 item.examId,
//                 item.unit,
//                 item.unitPrice,
//                 item.cost
//             ]);
//             rows.forEach((row, rowIndex) => {
//                 currentY = doc.y;
//                 row.forEach((cell, index) => {
//                     doc.rect(tableStartX + columnWidths.slice(0, index).reduce((a, b) => a + b, 0), currentY, columnWidths[index], 20).fillAndStroke('#FFFFFF', '#000000');
//                     doc.fill('#000000').text(cell.toString(), tableStartX + columnWidths.slice(0, index).reduce((a, b) => a + b, 0) + 5, currentY + 5);
//                 });
//                 doc.fill('#000000');
//                 doc.moveDown(); // Move to the next line
//             });

//             // Add address with word wrap
//             const addressLines = [
//                 `Address: ${data?.invoiceArrayData[0]?.patientId.address}`,
//                 `${data?.invoiceArrayData[0]?.patientId.country}`,
//                 `Postal Code: ${data?.invoiceArrayData[0]?.patientId.postalCode}`
//             ];
//             doc.text(addressLines.join('\n'), 400, 170);

//             // Add notes
//             doc.fontSize(10).text(`Notes: ${data?.invoiceArrayData[0]?.notes}`, { align: 'left' });

//             doc.end();
//             resolve();
//         } catch (error) {
//             reject(error);
//         }
//     });
// };


const generatePDF = (data, filePath) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument();
            doc.pipe(fs.createWriteStream(filePath));

            // Add invoice details at the top
            doc.fontSize(12).text("INVOICE", { align: 'center' }, 70, 70);
            doc.fontSize(10)
                .text(`Invoice ID: ${data?.invoiceArrayData[0]?.invoiceId}`, 85, 130)
                .text(`Invoice Date: ${moment(data?.invoiceArrayData[0]?.createdAt).format("MM-DD-YYYY")}`, 85, 150)
                .text(`Patient Name: ${data?.invoiceArrayData[0]?.patientId.fName} ${data?.invoiceArrayData[0]?.patientId.lName}`, 400, 130)
                .text(`Email: ${data?.invoiceArrayData[0]?.patientId.email}`, 400, 150);

            // Add space
            doc.text("", 10, 260);

            // Add table headers
            const columnWidths = [100, 150, 50, 75, 75]; // Define column widths
            const headerTexts = ["Order ID", "Exam", "Unit", "Unit Price ($)", "Cost ($)"]; // Define column headers
            doc.fontSize(10).fillColor('#FFFFFF').fillOpacity(0.8);
            let currentY = doc.y;
            const tableStartX = (doc.page.width - columnWidths.reduce((acc, width) => acc + width, 0)) / 2; // Centering the table
            headerTexts.forEach((header, index) => {
                doc.rect(tableStartX + columnWidths.slice(0, index).reduce((a, b) => a + b, 0), currentY, columnWidths[index], 20).fillAndStroke('#5ac8fa', '#000000');
                doc.fill('#000000').text(header, tableStartX + columnWidths.slice(0, index).reduce((a, b) => a + b, 0) + 5, currentY + 5);
            });
            doc.fill('#000000');
            doc.moveDown(); // Move to the next line

            // Add table rows
            const rows = data?.invoiceArrayData[0]?.invoiceDetail.map(item => [
                item.orderId,
                item.examId,
                item.unit,
                item.unitPrice,
                item.cost
            ]);

            // const totalCostRow = ["", "", "", { content: "Total Cost:", styles: { fontStyle: 'bold' } }, data.invoiceArrayData[0]?.totalCost];
            const totalCostRow = ["", "", "", "Total Cost:", data.invoiceArrayData[0]?.totalCost.toString()];

            rows.push(totalCostRow);

            rows.forEach((row, rowIndex) => {
                currentY = doc.y;
                row.forEach((cell, index) => {
                    doc.rect(tableStartX + columnWidths.slice(0, index).reduce((a, b) => a + b, 0), currentY, columnWidths[index], 20).stroke(); // Draw the cell border
                    doc.fill('#000000').text(cell.toString(), tableStartX + columnWidths.slice(0, index).reduce((a, b) => a + b, 0) + 5, currentY + 5);
                });
                doc.moveDown(); // Move to the next line
            });

            const finalY = doc.y;

            // Add address with word wrap
            const addressLines = [
                `Address: ${data?.invoiceArrayData[0]?.patientId.address}`,
                `${data?.invoiceArrayData[0]?.patientId.country}`,
                `Postal Code: ${data?.invoiceArrayData[0]?.patientId.postalCode}`
            ];
            doc.text(addressLines.join('\n'), 400, 170);

            // Add notes
            // doc.fontSize(10).text(`Notes: ${data?.invoiceArrayData[0]?.notes}`, { align: 'left' });
            // doc.fontSize(10).text(`Notes: ${data?.invoiceArrayData[0]?.notes}`, 14, doc.y + 10, { align: 'left' })
            doc.fontSize(10).text(`Notes: ${data?.invoiceArrayData[0]?.notes}`, 85, finalY + 10, { align: 'left' });

            doc.end();
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};


module.exports = generatePDF;



