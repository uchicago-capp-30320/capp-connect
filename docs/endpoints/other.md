# Other Endpoints Documentation  

## **Tags**  

### **Get All Tags**  
**GET** `/ccserver/tags/`  
Returns a list of all tags for filtering.  

**Response:**  
```json
["tag1", "tag2", ...]
```  

---

## **Resources**  

### **Get All Resources**  
**GET** `/ccserver/resources/`  
Returns all resources.  

**Response:**  
```json
[
  {
    "resource_id": 1,
    "title": "Resource Title",
    "description": "Resource content...",
    "created_at": "2024-01-01T00:00:00Z",
    ...
  }
]
```  