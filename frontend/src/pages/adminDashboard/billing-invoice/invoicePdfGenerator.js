import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';
import logo from '../../../assets/images/Logo.png'

const GenerateInvoicePDF = (invoice) => {
    const doc = new jsPDF();


    // Add logo at the top
    const imgWidth = 11;
    const imgHeight = 11;
    const imgData = logo;
    doc.addImage(imgData, 'PNG', 100, 2, imgWidth, imgHeight, 'center');

    // Define columns for the table
    const columns = [
        { header: "Order ID", dataKey: "orderId" },
        { header: "Exam", dataKey: "examId" },
        { header: "Unit", dataKey: "unit" },
        { header: "Unit Price ($)", dataKey: "unitPrice" },
        { header: "Cost ($)", dataKey: "cost" }
    ];

    // Add invoice details at the top
    doc.setFontSize(12);
    doc.text("INVOICE", 105, 20, null, null, 'center');

    // Add a black underline at the bottom of the "INVOICE" text
    const invoiceWidth = doc.getTextWidth("INVOICE");
    const startX = (210 - invoiceWidth) / 2; // Centering the line
    doc.setDrawColor(0); // Set color to black
    doc.line(startX, 22, startX + invoiceWidth, 22); // Draw the line

    doc.setFontSize(10);
    doc.text(`Invoice ID : ${invoice.invoiceId}`, 15, 40); // Adjusted position to the right side
    doc.text(`Invoice Date : ${moment(invoice.createdAt).format("MM-DD-YYYY")}`, 15, 50)
    doc.text(`Patient Name : ${invoice.patientId.fName} ${invoice.patientId.lName}`, 133, 40); // Positioned on the left side
    // doc.text(`Gender : ${invoice.patientId.gender}`, 133, 50); // Positioned on the left side
    // doc.text(`Date of Birth : ${moment(invoice.patientId.dob).format("MM-DD-YYYY")}`, 133, 60); // Positioned on the left side
    doc.text(`Email : ${invoice.patientId.email}`, 133, 50); // Positioned on the left side
    // doc.text(`Address : ${invoice.patientId.address},  ${invoice.patientId.country}, ${invoice.patientId.postalCode}`, 133, 60); // Positioned on the left side
    // doc.text(`Country : ${invoice.patientId.country}`, 133, 70); // Positioned on the left side
    // doc.text(`Postal Code : ${invoice.patientId.postalCode}`, 133, 80); // Positioned on the left side

    // const addressLines = doc.splitTextToSize(`Address : ${invoice.patientId.address}, ${invoice.patientId.country}, ${invoice.patientId.postalCode}`, 80);
    // doc.text(addressLines, 133, 60);

    // Add space
    doc.text(".", 10, 80);

    // Map invoice detail data to table rows
    const rows = invoice?.invoiceDetail?.map(item => ([
        item.orderId,
        item.examId,
        item.unit,
        item.unitPrice,
        item.cost
    ]));
    // Calculate the maximum height for the address text
    const tableCornerY = 90 + rows.length * 10; // Assuming each row height is 10
    const maxAddressHeight = tableCornerY - 60; // Limit address height to fit below the table
    if (invoice && invoice.patientId.address && invoice.patientId.country && invoice.patientId.postalCode) {
    // Add address with word wrap
    const addressLines = doc.splitTextToSize(`Address : ${invoice.patientId.address}, ${invoice.patientId.country}, ${invoice.patientId.postalCode}`, 80);
    const addressText = doc.splitTextToSize(addressLines, maxAddressHeight);
    doc.text(addressText, 133, 60); // Positioned on the left side, adjust Y position as needed
    }  


    const totalCostRow = ["", "", "", { content: "Total Cost:", styles: { fontStyle: 'bold' } }, invoice.totalCost];
    rows.push(totalCostRow);

    // Add the table using autoTable
    doc.autoTable({
        head: [columns.map(column => column.header)],
        body: rows,
        startY: 80,// Start table below the invoice details
        headStyles: { fillColor: '#5ac8fa' },
        tableLineWidth: 0.1, // Set the width of the table border
        tableLineColor: [0, 0, 0]
    });


    const notes = `${invoice.notes}`;
    doc.setFontSize(10);
    // doc.text(`Notes : ${notes, 14, doc.autoTable.previous.finalY + 10}`);// Adjust the Y position accordingly
    // doc.text("Notes : ", 14, doc.autoTable.previous.finalY + 10); // Print the label "Notes"
    // doc.text(notes, 24, doc.autoTable.previous.finalY + 10); // Print the value of the variable 'notes' starting at x = 24
    doc.text(`Notes : ${notes}`, 14, doc.autoTable.previous.finalY + 10); // Adjust the Y position accordingly



    // Save or open the PDF
    doc.save(`invoice_${invoice.invoiceId}.pdf`);
};

export default GenerateInvoicePDF;
