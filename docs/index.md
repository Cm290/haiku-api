# haiku-api

> An api provide to view haikus.

* [`GET /haikus`](#-get-haikus-) - returns a paginated list of all haikus
* [`GET /haikus/id/:haikuId`](#-get-haikus-id-haikuId) - returns the haiku of the id given
* [`GET /haikus/authors`](#-get-authors) - returns a paginated list of all haikus authors
* [`PUT /haikus/id/:haikuId`](#-get-haikus-id-haikuId) - saves and updates a haiku in the database

#### `GET /haikus`
Returns a paginated list of all haikus

##### Request
```HTTP
GET /haikus
```

##### Response
```JSON
200 OK
Content-Type: application/json

{
  "page": "1",
  "perPage": "10",
  "total": "2",
  "results": [
    {
      "id": "haiku1",
      "title": "Silence",
      "author": "Basho Matsuo",
      "text": "An old silent pond... A frog jumps into the pond, splash! Silence again.",
      "date_uploaded": "2017-04-21",
      "year_of_release": "1600-01-01"
    },
    {
      "id": "haiku2",
      "title": "Silence",
      "author": "Basho Matsuo",
      "text": "An old silent pond... A frog jumps into the pond, splash! Silence again.",
      "date_uploaded": "2017-04-21",
      "year_of_release": "1600-01-01"
    }
  ]
}

```

#### `GET /haikus/id/:haikuId`
returns the haiku of the id given

##### Request
```HTTP
GET /haikus/id/haiku1
```

##### Response
```JSON
200 OK
Content-Type: application/json

[
  {
    "id": "haiku1",
    "title": "Silence",
    "author": "Basho Matsuo",
    "text": "An old silent pond... A frog jumps into the pond, splash! Silence again.",
    "date_uploaded": "2017-04-21",
    "year_of_release": "1600-01-01"
  }
]

```

#### `GET /haikus/authors`
returns a paginated list of authors

##### Request
```HTTP
GET /haikus/authors
```

##### Response
```JSON
200 OK
Content-Type: application/json

{
  "page": "1",
  "perPage": "10",
  "total": 1,
  "results": [
    {
      "author": "Basho Matsuo",
      "last_active": "21 days ago",
      "haikus": "2"
    }
  ]
}

```

#### `PUT /haikus/id/:haikuId`
saves and updates a haiku in the database

##### Request
```HTTP
PUT /haikus/id/:haikuId
```
```JSON
200 OK
Content-Type: application/json

{
    "id": "haiku3",
    "title": "Snail",
    "author": "Kobayashi Issa",
    "text": "O snail Climb Mount Fuji, But slowly, slowly!",
    "year_of_release": "1700-01-01",
    "date_uploaded": "2017-04-21"
}

```

##### Response
```JSON
200 OK
Content-Type: application/json

{
    "id": "haiku3",
    "title": "Snail",
    "author": "Kobayashi Issa",
    "text": "O snail Climb Mount Fuji, But slowly, slowly!",
    "year_of_release": "1700-01-01",
    "date_uploaded": "2017-04-21"
}

```

## TO DO

* validate query strings
* change the default haikus
* allow for user set tags "tags": ["funny", "bears", "Klaus"],
* allow for series "series": "part of some series?"
* allow for stats "stats": {
                              "published": 2017-04-07,
                              "comments": 3,
                              "likes": 6   
                           }
