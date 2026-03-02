import React, { useState } from 'react';
import axios from 'axios';
import './PaymentDialog.css';

const PaymentDialog = ({ selectedExp, user, onSuccess, onClose, isLoading, setLoading, setMessage }) => {
  const [stage, setStage] = useState('qr'); // 'qr' or 'verify'
  const [transactionId, setTransactionId] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState('');

  const handleVerifyPayment = async () => {
    if (!transactionId.trim()) {
      setVerifyMessage('Please enter a transaction ID');
      return;
    }

    setVerifyLoading(true);
    setVerifyMessage('');

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `http://localhost:5000/api/experiments/${selectedExp._id}/verify-payment`,
        { transactionId: transactionId.trim() },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setVerifyMessage('✓ ' + res.data.message);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Verification failed. Please try again.';
      setVerifyMessage('✗ ' + errorMsg);
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
    <div className="payment-dialog-overlay" onClick={onClose}>
      <div className="payment-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          className="dialog-close-btn"
          onClick={onClose}
          title="Close"
        >
          ✕
        </button>

        {stage === 'qr' ? (
          <>
            {/* QR Code Stage */}
            <div className="payment-stage">
              <h2>Complete Payment via Google Pay</h2>
              
              <div className="payment-amount-card">
                <p className="amount-label">Amount to Pay</p>
                <p className="amount-value">₹{selectedExp?.price || 1} INR</p>
                <p className="amount-duration">For {selectedExp?.defaultDurationDays || 30} days access</p>
              </div>

              <div className="qr-container">
                <h3>Scan QR Code with Google Pay</h3>
                <div className="qr-box">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=shubpanchal07@okicici%26pn=Virtual%20Lab%26am=${selectedExp?.price || 1}%26tn=Premium%20Experiment`}
                    alt="Google Pay UPI QR Code"
                    className="qr-image"
                    loading="lazy"
                  />
                </div>
                <p className="qr-instruction">
                  Open Google Pay app and scan this QR code to make payment
                </p>
              </div>

              <div className="payment-instructions">
                <h4>📱 Payment Instructions:</h4>
                <ol>
                  <li>Open <strong>Google Pay</strong> app on your smartphone</li>
                  <li>Click <strong>"Pay"</strong> or <strong>"Scan QR"</strong></li>
                  <li>Scan the QR code above</li>
                  <li>Complete the payment</li>
                  <li>Note your <strong>Transaction ID</strong> from the confirmation</li>
                  <li>Click <strong>"I've completed payment"</strong> below</li>
                </ol>
              </div>

              <div className="merchant-info">
                <p><strong>Merchant Account:</strong> shubpanchal07@okicici</p>
                <p><strong>UPI ID:</strong> shubpanchal07@okicici</p>
              </div>

              <button
                className="btn-next-stage"
                onClick={() => setStage('verify')}
              >
                I've Completed Payment →
              </button>

              <button
                className="btn-cancel"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Verification Stage */}
            <div className="payment-stage">
              <h2>Verify Payment</h2>

              <div className="verification-info">
                <div className="info-box">
                  <p className="info-title">✓ Payment Complete?</p>
                  <p className="info-text">
                    You should have received a confirmation on Google Pay with a <strong>Transaction ID</strong>
                  </p>
                </div>
              </div>

              <div className="transaction-input-group">
                <label htmlFor="transaction-id">
                  Enter Transaction ID <span className="required">*</span>
                </label>
                <input
                  id="transaction-id"
                  type="text"
                  placeholder="e.g., UPI1234567890ABC"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  disabled={verifyLoading}
                  className="transaction-input"
                />
                <p className="input-hint">
                  You can find this in your Google Pay transaction history or confirmation message
                </p>
              </div>

              {verifyMessage && (
                <div className={`verify-message ${verifyMessage.includes('✗') ? 'error' : 'success'}`}>
                  {verifyMessage}
                </div>
              )}

              <button
                className="btn-verify"
                onClick={handleVerifyPayment}
                disabled={verifyLoading || !transactionId.trim()}
              >
                {verifyLoading ? 'Verifying...' : 'Verify & Grant Access'}
              </button>

              <button
                className="btn-back"
                onClick={() => {
                  setStage('qr');
                  setVerifyMessage('');
                  setTransactionId('');
                }}
                disabled={verifyLoading}
              >
                ← Back to QR Code
              </button>

              <button
                className="btn-cancel"
                onClick={onClose}
                disabled={verifyLoading}
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentDialog;
