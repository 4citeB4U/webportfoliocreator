// QR Code generation using qrcode.js library
// Include this script after loading qrcode.js in your HTML

function generateQRCode(elementId, url) {
    const qrOptions = {
        width: 220,
        height: 220,
        colorDark: "#2196F3",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    };

    try {
        new QRCode(document.getElementById(elementId), {
            text: url,
            ...qrOptions
        });
    } catch (error) {
        console.error(`Failed to generate QR code for ${elementId}:`, error);
    }
}

// Generate QR codes when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const baseUrl = window.location.origin;
    
    // Generate QR codes for each project
    generateQRCode('toolkit-qr', `${baseUrl}/dashboard/`);
    generateQRCode('rwd-qr', `${baseUrl}/rwd/`);
    generateQRCode('agent-lee-qr', `${baseUrl}/agent-lee/`);
});
