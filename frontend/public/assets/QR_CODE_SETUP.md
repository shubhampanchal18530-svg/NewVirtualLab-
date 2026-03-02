# Google Pay QR Code Setup

## Location
Save your Google Pay QR code image as: `googlepay-qr.png` in this directory (`frontend/public/assets/`)

## File Format
- **Filename**: googlepay-qr.png
- **Format**: PNG or JPG
- **Size**: Recommended 300x300px or larger
- **Content**: Google Pay QR code for UPI payment

## Configuration
Once the image is in place, the PaymentDialog component will automatically detect and display it.

### Current Configuration
- **Component**: `frontend/src/components/PaymentDialog.jsx`
- **Image path**: `/assets/googlepay-qr.png`
- **UPI ID**: shubpanchal07@okicici

## Steps to Add Your QR Code
1. Take the Google Pay QR code image (the one you provided)
2. Save it as `googlepay-qr.png` in this folder (`frontend/public/assets/`)
3. Restart the React dev server
4. The QR code will appear on the payment dialog

Done! ✅
