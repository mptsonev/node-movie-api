# Simple Movie API

## Run Locally

1. Clone this repository
2. Run from root dir

```bash
docker-compose build
docker-compose up -d
```

## Configure

The service needs the following environment variables:

| Variable Name        | Default value  |
| -------------        |:-------------: |
| JWT_SECRET           | N/A            |
| PORT                 | 7777           |
| OMDB_API_KEY         | 46eee6         |
| DB_USER              | user           |
| DB_PASSWORD          | pass           |
| DB_NAME              | db             |
| DB_HOST              | postgres       |

## API

### Get Movies

Returns json data about all movies

* **Path**

    /movies

* **Method**
    
    `GET`

*  **Headers**

   **Required:**
 
   `Authorization=[string]`

* **Success Response**

    * **Code**: 200
    
      **Content**
        ```json
        {
            "data": [
                {
                    "id": 1,
                    "title": "Inception",
                    "released": "2010-07-16T00:00:00.000Z",
                    "genre": "Action, Adventure, Sci-Fi, Thriller",
                    "director": "Christopher Nolan"
                }
            ]
        }
        ```
* **Error Response**
    * **Code** 500
      
      **Content**
        ```json
        {
            "error": "Something went wrong"
        }

        ```
    OR

    * **Code** 403

      **Content**
        ```json
        {
            "error": "No credentials sent!"
        }

        ```
    OR

    * **Code** 403

      **Content**
        ```json
        {
            "error": "Invalid Token!"
        }

        ```
### Create Movie

Creates a movie and responds with the result

* **Path**

    /movies

* **Method**
    
    `POST`

*  **Headers**

   **Required:**
 
   `Authorization=[string]`

* **Payload**
  
  ```json
    {
        "title": "string"
    }
  ```

* **Success Response**

    * **Code**: 201
    
      **Content**
        ```json
        {
            "data": {
                "id": 1,
                "title": "Inception",
                "released": "2010-07-16T00:00:00.000Z",
                "genre": "Action, Adventure, Sci-Fi, Thriller",
                "director": "Christopher Nolan"
            }
        }
        ```
* **Error Response**
    * **Code** 500
      
      **Content**
        ```json
        {
            "error": "Something went wrong!"
        }
        ```
    OR

    * **Code** 403

      **Content**
        ```json
        {
            "error": "No credentials sent!"
        }
        ```
    OR

    * **Code** 403

      **Content**
        ```json
        {
            "error": "Invalid Token!"
        }
        ```
    OR

    * **Code** 400

      **Content**
        ```json
        {
            "error": "Title missing in request body!"
        }
        ```
    OR

    * **Code** 402

      **Content**
        ```json
        {
            "error": "Monthly quota reached, consider upgrading to premium!"
        }
        ```
    OR

    * **Code** 409

      **Content**
        ```json
        {
            "error": "Movie with that title already created!"
        }
        ```
