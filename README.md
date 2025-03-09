# Business Directory API Documentation

This API allows users to **fetch, create, update, and delete** businesses in the system. It supports **pagination, filtering, and full admin control**.

## Base URL

```
https://yourdomain.com/api/businesses
```

---

## 1️⃣ GET: Fetch Businesses

### Endpoint

```http
GET /api/businesses
```

### Query Parameters

| Parameter       | Type     | Required | Description                                                              |
| --------------- | -------- | -------- | ------------------------------------------------------------------------ |
| `industry_type` | `string` | ❌       | Filter businesses by industry type                                       |
| `status`        | `string` | ❌       | Filter by business status (e.g., `active`, `inactive`)                   |
| `business_name` | `string` | ❌       | Search businesses by name (partial match)                                |
| `location`      | `string` | ❌       | Filter businesses by location                                            |
| `minPrice`      | `number` | ❌       | Filter businesses with minimum price greater than or equal to this value |
| `maxPrice`      | `number` | ❌       | Filter businesses with maximum price less than or equal to this value    |
| `page`          | `number` | ❌       | Page number for pagination (default: `1`)                                |
| `limit`         | `number` | ❌       | Number of records per page (default: `10`)                               |

### Example Request

```http
GET /api/businesses?industry_type=IT&location=New%20York&minPrice=1000&maxPrice=10000&page=1&limit=5
```

---

## 2️⃣ POST: Add New Business (All Fields Required)

### Endpoint

```http
POST /api/businesses
```

### Body Parameters (All Required)

| Parameter           | Type              | Required | Description                             |
| ------------------- | ----------------- | -------- | --------------------------------------- |
| `name`              | `string`          | ✅       | Business name                           |
| `mobile_number`     | `string`          | ✅       | Contact number                          |
| `review_count`      | `number`          | ✅       | Number of reviews                       |
| `rating`            | `number`          | ✅       | Business rating (1-5)                   |
| `category`          | `string`          | ✅       | Business category                       |
| `address`           | `string`          | ✅       | Physical address                        |
| `website`           | `string`          | ✅       | Business website URL                    |
| `email_id`          | `string`          | ✅       | Business email                          |
| `plus_code`         | `string`          | ✅       | Google Maps plus code                   |
| `closing_hours`     | `string`          | ✅       | Closing hours of the business           |
| `latitude`          | `number`          | ✅       | Latitude coordinate                     |
| `longitude`         | `number`          | ✅       | Longitude coordinate                    |
| `instagram_profile` | `string`          | ✅       | Instagram profile link                  |
| `facebook_profile`  | `string`          | ✅       | Facebook profile link                   |
| `linkedin_profile`  | `string`          | ✅       | LinkedIn profile link                   |
| `twitter_profile`   | `string`          | ✅       | Twitter profile link                    |
| `thumbnail`         | `string (Base64)` | ✅       | Business image in **Base64 format**     |
| `status`            | `string`          | ✅       | Business status (`active` / `inactive`) |
| `industry_type`     | `string`          | ✅       | Industry type                           |
| `minPrice`          | `number`          | ✅       | Minimum price for services/products     |
| `maxPrice`          | `number`          | ✅       | Maximum price for services/products     |
| `location`          | `string`          | ✅       | Business location                       |

### Example Request

```json
{
  "name": "Tech Solutions",
  "mobile_number": "1234567890",
  "review_count": 25,
  "rating": 4.5,
  "category": "IT",
  "address": "123 Main Street, New York",
  "website": "https://techsolutions.com",
  "email_id": "info@techsolutions.com",
  "plus_code": "7GQ7+89",
  "closing_hours": "9 PM",
  "latitude": 40.7128,
  "longitude": -74.006,
  "instagram_profile": "https://instagram.com/techsolutions",
  "facebook_profile": "https://facebook.com/techsolutions",
  "linkedin_profile": "https://linkedin.com/company/techsolutions",
  "twitter_profile": "https://twitter.com/techsolutions",
  "thumbnail": "data:image/png;base64,iVBORw0KGgo...",
  "status": "active",
  "industry_type": "IT",
  "minPrice": 1500,
  "maxPrice": 10000,
  "location": "New York"
}
```

---

## 3️⃣ PATCH: Update Business (Admin)

### Endpoint

```http
PATCH /api/businesses
```

### Body Parameters (At least `id` and one field required)

| Parameter     | Type     | Required | Description                                  |
| ------------- | -------- | -------- | -------------------------------------------- |
| `id`          | `number` | ✅       | Business ID to update                        |
| `[Any field]` | `any`    | ❌       | Any field from `POST` request can be updated |

---

## 4️⃣ DELETE: Remove Business

### Endpoint

```http
DELETE /api/businesses
```

### Body Parameters

| Parameter | Type     | Required | Description           |
| --------- | -------- | -------- | --------------------- |
| `id`      | `number` | ✅       | Business ID to delete |

---

## 🔀 SQL Query to Randomize Prices

```sql
UPDATE businesses
SET
    minPrice = FLOOR(RAND() * 500000),
    maxPrice = minPrice + FLOOR(RAND() * 500000)
WHERE 1;
```

---

## 🚀 Summary

| Method     | Endpoint          | Description                                  |
| ---------- | ----------------- | -------------------------------------------- |
| **GET**    | `/api/businesses` | Fetch businesses with filtering & pagination |
| **POST**   | `/api/businesses` | Add a new business (**all fields required**) |
| **PATCH**  | `/api/businesses` | Admin can update **any field**               |
| **DELETE** | `/api/businesses` | Delete a business                            |

---

## 💡 Notes

- **Base64 Storage**: The `thumbnail` field **stores images as Base64 strings**.
- **Pagination**: Defaults to `10` records per page.
- **Strict Validation**: **All fields are required** when creating a new business.
- **Full Admin Control**: `PATCH` allows updating **any field**.

---

This documentation ensures **full validation** and follows **REST API best practices**. 🚀
