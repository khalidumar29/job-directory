# Business API Documentation

## Overview

This API allows managing business records, including retrieving, creating, updating, and deleting businesses. Additionally, it provides OTP-based email verification.

## Base URL

```
http://localhost:3000/api
```

---

## Endpoints

### 1. Get Businesses

#### **GET /business**

Retrieve a paginated list of businesses based on optional filters.

#### **Query Parameters:**

| Parameter     | Type   | Required | Description                            |
| ------------- | ------ | -------- | -------------------------------------- |
| category      | string | No       | Filter by business category            |
| status        | string | No       | Filter by business status              |
| business_name | string | No       | Search by business name                |
| page          | number | No       | Page number (default: 1)               |
| limit         | number | No       | Number of items per page (default: 10) |

#### **Response:**

```json
{
  "data": [
    {
      "id": 1,
      "name": "Business Name",
      "category": "Retail",
      "status": "Active"
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

---

### 2. Update Business Status

#### **PATCH /business**

Update the status of a business.

#### **Request Body:**

```json
{
  "id": 1,
  "status": "Inactive"
}
```

#### **Response:**

```json
{ "message": "Status updated successfully" }
```

---

### 3. Create a Business

#### **POST /business**

Create a new business record.

#### **Request Body:**

```json
{
  "name": "New Business",
  "category": "Retail",
  "status": "Active",
  "address": "123 Street",
  "email_id": "example@email.com",
  "latitude": 40.7128,
  "longitude": -74.006
}
```

#### **Response:**

```json
{ "message": "Business created successfully", "id": 123 }
```

---

### 4. Delete a Business

#### **DELETE /business**

Delete a business by ID.

#### **Request Body:**

```json
{
  "id": 1
}
```

#### **Response:**

```json
{ "message": "Business deleted successfully" }
```

---

## Email Verification API

### 5. Send OTP

#### **POST /send-otp**

Send an OTP to a user's email for verification.

#### **Request Body:**

```json
{
  "email": "user@example.com"
}
```

#### **Response:**

```json
{ "message": "OTP sent successfully" }
```

---

### 6. Verify OTP

#### **POST /verify-otp**

Verify the OTP sent to the user's email.

#### **Request Body:**

```json
{
  "email": "user@example.com",
  "otp": 1234
}
```

#### **Response:**

```json
{ "verified": true, "message": "Email verified successfully" }
```

#### **Error Response:**

```json
{ "verified": false, "message": "Invalid or expired OTP" }
```

---

## Error Handling

| Status Code | Message                                       |
| ----------- | --------------------------------------------- |
| 400         | "Bad Request - Missing or Invalid Parameters" |
| 404         | "Not Found - Business Not Found"              |
| 500         | "Internal Server Error"                       |

---

## Notes

- The OTP expires in **5 minutes**.
- The `GET /business` endpoint supports pagination.
- Business names can be searched using partial matching with `business_name`.

This documentation serves as a guide for using the Business API efficiently.
