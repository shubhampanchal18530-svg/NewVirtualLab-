# Premium Feature Setup Guide

## Quick Start: Replace QR Code Placeholder

Your premium sorting experiment is fully implemented! Follow these simple steps to add your Google Pay QR code:

### Step 1: Get Your QR Code Ready

You have provided a QR code image. The current system uses a placeholder SVG at:
```
frontend/public/assets/qrcode.svg
```

### Step 2: Replace the Placeholder

**Option A: Direct Image Replacement (Recommended)**

If you have the QR code as an image file (PNG, JPG, etc.):

1. Save your QR code image as `qrcode.png` 
2. Place it in: `frontend/public/assets/qrcode.png`
3. The payment dialog will automatically use the new image

**Option B: Convert to SVG**

If you want to keep it as SVG:
1. Convert your QR code image to SVG format
2. Replace: `frontend/public/assets/qrcode.svg`
3. No code changes needed!

### Step 3: Update Payment Dialog (if using different filename)

If you use a different filename, update `PaymentDialog.jsx` line 41:

```jsx
src="/assets/qrcode.png"  // Change filename here if needed
```

---

## Testing the Premium Feature

### Prerequisites
- Backend running: `npm start` (in `/backend` folder)
- Frontend running: `npm start` (in `/frontend` folder)
- User logged in

### Test Payment Flow

1. **Navigate to Sorting Lab**
   - URL: `http://localhost:3000/pages/SortingLab.jsx`
   - Should see the experiment locked

2. **Click "💳 Pay with Google Pay"**
   - Payment dialog opens in 2 stages
   - First stage shows your QR code

3. **Verify Payment**
   - Click "I've Completed Payment →"
   - Enter a test transaction ID: `UPI123456789TEST`
   - Click "Verify & Grant Access"

4. **Access Granted ✅**
   - Dialog closes
   - Experiment becomes fully accessible
   - Access valid for 30 days

---

## Database Setup

### Initialize Sorting Experiment

Run this curl command to create the premium sorting experiment:

```bash
curl -X POST http://localhost:5000/api/experiments/seed/sorting-experiment
```

**Response:**
```json
{
  "message": "Sorting experiment created",
  "experiment": {
    "_id": "...",
    "title": "Bubble & Selection Sort Lab",
    "requiresPayment": true,
    "price": 1,
    "defaultDurationDays": 30
  }
}
```

---

## Customize the Payment

### Change Price
Edit `backend/Routes/experimentRoutes.js` line 40:
```javascript
price: 1  // Change to 5, 10, 100, etc.
```

### Change Duration
Edit `backend/models/Experiment.js`:
```javascript
defaultDurationDays: { type: Number, default: 30 }  // Change to any days
```

### Update Merchant Account
Edit `backend/Routes/experimentRoutes.js` line 102:
```javascript
merchantAccount: 'your-upi-id@bank.com'  // Your actual merchant UPI ID
```

---

## QR Code Details

The QR code should encode your Google Pay UPI link in this format:

```
upi://pay?pa=your-upi-id@bank&pn=SimuLab&am=1&tn=Premium%20Sorting%20Experiment
```

**Fields:**
- `pa` = Your UPI ID (e.g., `shubpanchal07@okicici`)
- `pn` = Payer name
- `am` = Amount (₹1)
- `tn` = Transaction note/description

---

## Verification Flow

### How Transaction Verification Works

1. **User scans QR code** with Google Pay
2. **Completes payment** on UPI app
3. **Receives confirmation** with Transaction ID (usually auto-generated)
4. **Returns to app** and enters Transaction ID
5. **Backend validates** and creates purchase record
6. **Access granted** for 30 days

### Transaction ID Format

Google Pay typically generates transaction IDs like:
- `UPI62a5c7f8d9e2b1f4a`
- `GOOGLEPAY001234567890`
- `AXIS0123456789ABCD`

**Any unique 15+ character string works for testing:**
```
UPI123456789TEST
TRANS0001
MANUAL_PAYMENT_001
```

---

## Troubleshooting

### Issue: QR Code Not Showing

**Solution:**
1. Check file exists: `frontend/public/assets/qrcode.png` (or .svg)
2. Clear browser cache: `Ctrl+Shift+Delete`
3. Restart frontend: `npm start`
4. Check browser console for errors: `F12` → Console tab

### Issue: Payment Verification Fails

**Solution:**
1. Ensure backend is running on port 5000
2. Check JWT token in localStorage: `localStorage.getItem('token')`
3. Verify transaction ID is entered correctly
4. Check MongoDB connection status
5. Look at backend console for error messages

### Issue: Access Not Granted After Verification

**Solution:**
1. Reload page: `F5` or `Ctrl+R`
2. Check browser console for errors
3. Verify user is logged in
4. Check database: Has purchase been created?

### Issue: Same Transaction ID Can't Be Used Twice

**Feature:** By design! Each transaction ID can only be verified once.

**Solution:** Use a different transaction ID for testing:
- Test 1: `UPI111111111111`
- Test 2: `UPI222222222222`
- Test 3: `UPI333333333333`

---

## File Modifications Summary

### Created Files
```
frontend/src/components/PaymentDialog.jsx       ← Payment dialog component
frontend/src/components/PaymentDialog.css       ← Payment dialog styling
frontend/public/assets/qrcode.svg              ← QR code placeholder
PREMIUM_FEATURE_DOCS.md                        ← Full documentation
```

### Modified Files
```
backend/models/Purchase.js                      ← Added transactionId field
backend/Routes/experimentRoutes.js              ← Added verify-payment endpoint
frontend/src/pages/SortingLab.jsx              ← Integrated PaymentDialog
frontend/src/styles/theme.css                  ← (Already white text applied)
```

---

## Production Deployment Checklist

Before going live, ensure:

- [ ] QR code image uploaded to `frontend/public/assets/`
- [ ] Merchant UPI account ID updated in routes
- [ ] Email notifications working (sendReceiptEmail)
- [ ] Database backups configured
- [ ] Payment verification process tested with real UPI IDs
- [ ] Access expiry emails set up (optional)
- [ ] Support email address configured
- [ ] Terms & conditions reviewed
- [ ] Subscription refund policy defined
- [ ] Admin dashboard for monitoring purchases (planned feature)

---

## Support Contact

For questions about the premium feature implementation:
- Check `PREMIUM_FEATURE_DOCS.md` for detailed documentation
- Review error messages in browser console (`F12`)
- Check backend logs for API errors

Implementation is complete and ready for use! 🎉
