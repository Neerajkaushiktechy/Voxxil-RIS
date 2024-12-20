const PDFDocument = require("pdfkit");
const path = require("path");
const axios = require("axios");

const fetchImage = async (src) => {
  const image = await axios.get(src, {
    responseType: "arraybuffer",
  });
  return image.data;
};

const pdfGenerator = async (data, res) => {
  try {
    const {
      patientName,
      dob,
      gender,
      age,
      referringDoctor,
      appointmentDate,
      examReason,
      clinicalInfo,
      diagnosticObjectives,
      findings,
      radiographicImpression,
      radiologistName,
      radiologistSignature,
      studyImages,
      imageComments,
    } = data;

    const doc = new PDFDocument();
    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      res.writeHead(200, {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment;filename=report.pdf",
        "Content-Length": pdfData.length,
      });
      res.end(pdfData);
    });

    const logoPath = path.join(__dirname, "..", "resources", "Logo.png");
    const placeholderPath = path.join(__dirname, "..", "resources", "alt.png"); // Placeholder image path
    doc.image(logoPath, doc.page.width / 2 - 35, doc.y - 60, {
      fit: [70, 70],
      align: "center",
    });
    doc.moveDown(2);

    doc.fontSize(10);

    // Define positions for columns
    const leftColumnX = 50;
    const rightColumnX = 300;
    let currentY = doc.y;
    doc.fillColor("#052F5D");

    // Patient Details in two columns
    doc.text(`Patient Name: ${patientName}`, leftColumnX, currentY);
    doc.text(`DOB: ${dob}`, rightColumnX, currentY);
    currentY += doc.currentLineHeight() * 2;
    doc.text(`Gender: ${gender}`, leftColumnX, currentY);
    doc.text(`Age: ${age}`, rightColumnX, currentY);
    currentY += doc.currentLineHeight() * 2;

    // Referring Doctor and Appointment Details
    doc.text(`Referring Doctor: ${referringDoctor || "N/A"}`,leftColumnX,currentY);
    doc.text(`Appointment Date: ${appointmentDate || "N/A"}`,rightColumnX,currentY);
    currentY += doc.currentLineHeight() * 2;
    const textOptions = {
      width: doc.page.width - leftColumnX - 50, // Fit within page width
      align: "justify",
    };

    doc.text(
      `Reason for Exam: ${examReason || "N/A"}`,
      leftColumnX,
      currentY,
      textOptions
    );

    currentY = doc.y + 10;

    doc
      .moveTo(leftColumnX, currentY)
      .lineTo(doc.page.width - 50, currentY)
      .strokeColor("#dadada")
      .stroke();

    currentY += 10;

    const margin = {
      top: 190,
      bottom: 50,
      left: 50,
      right: 50,
    };
    doc.y = currentY;

    const simulateBoldText = (text) => {
      doc
        .fontSize(10 + 1)
        .fillColor("black")
        .text(text);
    };

    currentY += 10;

    simulateBoldText("Clinical Details:");
    currentY = doc.y;
    doc
      .fontSize(10)
      .text(clinicalInfo || "N/A", leftColumnX, currentY, textOptions);

    currentY = doc.y + 20;

    simulateBoldText("Diagnostic Objectives:");
    doc.fontSize(10).text(diagnosticObjectives || "N/A", { align: "justify" });
    doc.moveDown();

    simulateBoldText("Findings:");
    doc.fontSize(10).text(findings || "N/A", { align: "justify" });
    doc.moveDown();

    simulateBoldText("Radiographic Impression:");
    doc
      .fontSize(10)
      .text(radiographicImpression || "N/A", { align: "justify" });
    doc.moveDown();

    // Radiologist Name and Signature
    if (radiologistName) {
      doc.fontSize(10).text("Radiologist name and signature:");
      doc
        .fontSize(10)
        .text(
          `Thank you for the referral of this patient and the opportunity to serve your practice.`
        );
      doc.moveDown();
      const signatureWidth = 100;
      const signatureHeight = 100;
      const signatureX = doc.page.width - margin.right - signatureWidth; // Right-aligned position
      const signatureY = doc.y; // Top position
      if (radiologistSignature && !radiologistSignature.includes("null")) {
        try {
          const response = await axios.get(radiologistSignature, {
            responseType: "arraybuffer",
          });
          const imgBuffer = Buffer.from(response.data);
          doc.image(imgBuffer, signatureX, signatureY, {
            fit: [signatureWidth, signatureHeight],
            align: "right",
          });
        } catch (error) {
          doc.image(placeholderPath, signatureX, signatureY, {
            fit: [signatureWidth, signatureHeight],
            align: "right",
          });
        }
      } else {
        doc.image(placeholderPath, signatureX, signatureY, {
          fit: [signatureWidth, signatureHeight],
          align: "right",
        });
      }

      doc.fontSize(12).text(radiologistName, { align: "right" });
      doc.moveDown();
    }
    doc.addPage();

    if (studyImages && studyImages.length > 0) {
      const imageWidth = 245;
      const imageHeight = 245;
      const spacing = 10;
      const margin = 50;
      const availableWidth = doc.page.width - 2 * margin;
      let xPosition = margin;
      let yPosition = doc.y;

      // Calculate how many images fit per row
      const imagesPerRow = Math.floor(availableWidth / (imageWidth + spacing));
      for (let i = 0; i < studyImages.length; i++) {
        const imageID = studyImages[i];
        const commentInfo = imageComments.find(
          (comment) => comment.imageID === imageID
        );
        const commentText = commentInfo
          ? commentInfo.comment
          : "No comment available";

        if (xPosition + imageWidth > doc.page.width - margin) {
          // Move to next row if image exceeds page width
          xPosition = margin;
          yPosition += imageHeight + 60; // Increase space for comment section
          if (yPosition + imageHeight > doc.page.height - margin) {
            // Add a new page if space is not enough
            doc.addPage();
            yPosition = doc.y; // Reset Y position to the top of the new page
          }
        }

        if (imageID) {
          try {
            const imageBuffer = await fetchImage(
              `${process.env.ORTHANC_SERVER_URL}/instances/${imageID}/preview`
            );
            doc.image(imageBuffer, xPosition, yPosition, {
              width: imageWidth,
              height: imageHeight,
            });
          } catch (error) {
            doc.image(placeholderPath, xPosition, yPosition, {
              width: imageWidth,
              height: imageHeight,
            });
          }

          // Render the comment below the image
          const commentYPosition = yPosition + imageHeight + 10; // Space between image and comment
          doc.fontSize(11).text("Comment:", xPosition, commentYPosition);
          doc
            .fontSize(10)
            .text(
              commentText || "N/A",
              xPosition,
              commentYPosition + doc.currentLineHeight() + 10,
              {
                width: imageWidth,
                align: "left",
              }
            );
        }

        // Update xPosition for the next image
        xPosition += imageWidth + spacing;

        // Move to the next row if images per row limit is reached
        if ((i + 1) % imagesPerRow === 0) {
          xPosition = margin;
          yPosition += imageHeight + 60; // Increase space for comment section
        }
      }
    }

    doc.end();
  } catch (error) {
    console.error("Error generating PDF", error);
    res.status(500).send("Error generating PDF");
  }
};

module.exports = pdfGenerator;
