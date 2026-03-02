# Premium Experiment Admin Management Guide

## Overview

This guide helps administrators and faculty manage premium experiment purchases, verify payments, and monitor subscription data.

---

## Database Queries (MongoDB)

### View All Purchases
```javascript
db.purchases.find()

// Output:
{
  "_id": ObjectId(...),
  "user": ObjectId(...),
  "experiment": ObjectId(...),
  "transactionId": "UPI123456789ABC",
  "verificationStatus": "verified",
  "paymentMethod": "manual",
  "startDate": ISODate("2026-03-02T10:30:00Z"),
  "expiryDate": ISODate("2026-04-01T10:30:00Z"),
  "amount": 1,
  "currency": "INR",
  "createdAt": ISODate("2026-03-02T10:30:00Z"),
  "updatedAt": ISODate("2026-03-02T10:30:00Z")
}
```

### Find Purchases for Specific User
```javascript
db.purchases.find({ 
  user: ObjectId("USER_ID_HERE") 
})
```

### Find Active Subscriptions (Not Expired)
```javascript
db.purchases.find({
  expiryDate: { $gt: new Date() }
})
```

### Find Expired Subscriptions
```javascript
db.purchases.find({
  expiryDate: { $lt: new Date() }
})
```

### Count Total Revenue
```javascript
db.purchases.aggregate([
  { $match: { verificationStatus: "verified" } },
  { $group: { 
    _id: null, 
    totalRevenue: { $sum: "$amount" },
    totalPurchases: { $sum: 1 }
  }}
])
```

### Find Purchases by Payment Method
```javascript
// All manual payments
db.purchases.find({ paymentMethod: "manual" })

// All Google Pay payments
db.purchases.find({ paymentMethod: "googlepay" })
```

### Find Expiring Soon (Next 7 Days)
```javascript
const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
db.purchases.find({
  expiryDate: { 
    $gte: new Date(),
    $lte: nextWeek
  }
})
```

---

## API Endpoints for Admins

### Check if User Has Access
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:5000/api/experiments/EXPERIMENT_ID/access
```

**Response:**
```json
{
  "access": true,
  "expiryDate": "2026-04-01T10:30:00Z"
}
```

### List All Experiments
```bash
curl http://localhost:5000/api/experiments
```

**Response:**
```json
[
  {
    "_id": "...",
    "title": "Bubble & Selection Sort Lab",
    "requiresPayment": true,
    "price": 1,
    "defaultDurationDays": 30,
    "currency": "INR"
  }
]
```

### Create New Premium Experiment
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Linked List Lab",
    "description": "Learn Linked List data structures",
    "type": "linkedlist",
    "requiresPayment": true,
    "price": 2,
    "defaultDurationDays": 30
  }' \
  http://localhost:5000/api/experiments
```

---

## Manual Payment Verification

### Verify a Payment Manually
If a user claims they paid but couldn't verify through the app:

```javascript
// In MongoDB
db.purchases.updateOne(
  { transactionId: "USER_PROVIDED_ID" },
  { 
    $set: { 
      verificationStatus: "verified",
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    } 
  }
)
```

### Create Manual Purchase Entry
If you need to grant free access or extend expiry:

```javascript
db.purchases.insertOne({
  user: ObjectId("USER_ID"),
  experiment: ObjectId("EXPERIMENT_ID"),
  transactionId: "ADMIN_GRANT_001",
  verificationStatus: "verified",
  paymentMethod: "manual",
  startDate: new Date(),
  expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  amount: 0,
  currency: "INR",
  orderId: `admin_order_${Date.now()}`,
  renewable: true,
  merchantAccount: "admin"
})
```

### Reset/Revoke User Access
```javascript
// Remove specific purchase
db.purchases.deleteOne({
  user: ObjectId("USER_ID"),
  experiment: ObjectId("EXPERIMENT_ID")
})

// Or set expiry to past date
db.purchases.updateOne(
  { user: ObjectId("USER_ID"), experiment: ObjectId("EXPERIMENT_ID") },
  { $set: { expiryDate: new Date(2000, 1, 1) } }
)
```

---

## Monitoring & Analytics

### Daily Active Subscribers
```javascript
db.purchases.aggregate([
  { 
    $match: { 
      expiryDate: { $gt: new Date() }
    } 
  },
  { 
    $group: { 
      _id: null,
      activeCount: { $sum: 1 }
    } 
  }
])
```

### Revenue by Payment Method
```javascript
db.purchases.aggregate([
  { 
    $match: { 
      verificationStatus: "verified"
    } 
  },
  { 
    $group: { 
      _id: "$paymentMethod",
      total: { $sum: "$amount" },
      count: { $sum: 1 }
    } 
  }
])
```

### User Subscription Status
```javascript
db.purchases.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "user",
      foreignField: "_id",
      as: "userInfo"
    }
  },
  {
    $project: {
      userName: { $arrayElemAt: ["$userInfo.name", 0] },
      userEmail: { $arrayElemAt: ["$userInfo.email", 0] },
      startDate: 1,
      expiryDate: 1,
      amount: 1,
      isActive: {
        $cond: [{ $gt: ["$expiryDate", new Date()] }, "Active", "Expired"]
      }
    }
  }
])
```

### Expiry Timeline
```javascript
db.purchases.aggregate([
  {
    $project: {
      expiryDate: 1,
      daysUntilExpiry: {
        $divide: [
          { $subtract: ["$expiryDate", new Date()] },
          1000 * 60 * 60 * 24
        ]
      }
    }
  },
  { $sort: { expiryDate: 1 } }
])
```

---

## User Management

### Find User's Subscription Status
```bash
# Get user ID first
db.users.findOne({ email: "student@example.com" })

# Then check purchases
db.purchases.find({ user: ObjectId("USER_ID") })
```

### Grant Free Extension
```javascript
db.purchases.updateOne(
  { user: ObjectId("USER_ID"), experiment: ObjectId("EXPERIMENT_ID") },
  { 
    $set: { 
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    } 
  }
)
```

### Send Renewal Reminder Email
```javascript
// Get users expiring in 7 days
db.purchases.aggregate([
  {
    $match: {
      expiryDate: {
        $gte: new Date(),
        $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    }
  },
  {
    $lookup: {
      from: "users",
      localField: "user",
      foreignField: "_id",
      as: "userInfo"
    }
  },
  {
    $project: {
      email: { $arrayElemAt: ["$userInfo.email", 0] },
      expiryDate: 1,
      experiment: 1
    }
  }
])
```

---

## Reports & Export

### Export Purchase History (JSON)
```bash
mongoexport \
  --db virtual_lab \
  --collection purchases \
  --out purchases.json
```

### Export for Accounting (CSV)
```bash
mongoexport \
  --db virtual_lab \
  --collection purchases \
  --type=csv \
  --fields="user,amount,currency,startDate,expiryDate,transactionId" \
  --out purchases.csv
```

### Monthly Revenue Report
```javascript
db.purchases.aggregate([
  {
    $match: {
      verificationStatus: "verified",
      startDate: {
        $gte: ISODate("2026-03-01"),
        $lt: ISODate("2026-04-01")
      }
    }
  },
  {
    $group: {
      _id: { $dateToString: { format: "%Y-%m-%d", date: "$startDate" } },
      dailyRevenue: { $sum: "$amount" },
      transactionCount: { $sum: 1 }
    }
  },
  { $sort: { _id: 1 } }
])
```

---

## Troubleshooting

### User Says They Paid But No Purchase Created

**Steps:**
1. Ask for transaction ID
2. Search database: `db.purchases.find({ transactionId: "THEIR_ID" })`
3. If not found:
   - Manual verification may have failed
   - Network issue during verification
   - Invalid transaction ID format

**Solution:**
- Verify transaction ID with payment provider (UPI history)
- Manually create purchase entry if legitimate

### Multiple Purchases for Same User

**Expected:** This should not happen
**Check:** Duplicate prevention in backend

```javascript
db.purchases.find({ 
  user: ObjectId("USER_ID"),
  experiment: ObjectId("EXPERIMENT_ID")
})
```

**If found:** Keep only the newest entry, delete others

### Expired Access Not Updating

**Check:** Automatic expiry check in `GET /access` endpoint
**Verify:** `expiryDate` field in database is accurate

```javascript
// Fix expiry date
db.purchases.updateOne(
  { _id: ObjectId("PURCHASE_ID") },
  { $set: { expiryDate: new ISODate("2026-04-01") } }
)
```

---

## Best Practices

✅ **Regular Backups** - Daily backup of purchases collection
✅ **Monthly Audits** - Verify transaction counts match UPI records
✅ **Annual Reviews** - Check pricing vs market rates
✅ **User Notifications** - Email 5 days before expiry
✅ **Dispute Handling** - Keep records for 2 years minimum
✅ **Privacy Compliance** - Anonymize old transaction data after 1 year

---

## Contact & Support

For payment verification issues contact:
- Faculty: Support email in SortingLab.jsx
- Dev Team: Check backend error logs
- Students: Self-verify through payment dialog

**Error Log Location:**
```
backend/logs/payments.log
```

---

Implementation Complete! You now have full control and visibility over premium subscriptions. 🎉
