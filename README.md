# openMusicApi

# API Spec

## Authentication

All API authentication will automatically send token by user credential from server

## RabitMq consumer source code

(https://github.com/Roisfaozi/music-app-queue-consumer)[https://github.com/Roisfaozi/music-app-queue-consumer]

## Create Songs

Request :

- Method : POST
- Endpoint : `/api/songs`
- Header :
  - Content-Type: application/json
- Body :

```json
{
  "title": "string",
  "year": integer,
  "performer": "string",
  "genre": "string",
  "duration": integer
}
```

Response :

```json
{
  "status": "string",
  "message": "string",
  "data": {
    "songId": "string"
  }
}
```

## Get All Songs

Request :

- Method : GET
- Endpoint : `/api/songs`
- Header :
  - Accept: application/json

Response :

```json
{
  "status": "string",
  "data": {
    "songs": [
      {
        "id": "string",
        "title": "string",
        "performer": "string"
      },
      {
        "id": "string",
        "title": "string",
        "performer": "string"
      }
    ]
  }
}
```

## Get Song

Request :

- Method : GET
- Endpoint : `/api/songs/{songId}`
- Header :
  - Accept: application/json

Response :

```json
{
    "status": "string",
    "data": {
        "song": {
            "id": "string",
            "title": "string"
            "year": integer,
            "performer": "string",
            "genre": "string",
            "duration": integer,
            "insertedAt": "string",
            "updatedAt": "string"
        }
    }
}
```

## Update Song

Request :

- Method : PUT
- Endpoint : `/api/songs/{songId}`
- Header :
  - Content-Type: application/json
  - Accept: application/json
- Body :

```json
{
  "title": "string",
  "year": integer,
  "performer": "string",
  "genre": "string",
  "duration": integer
}
```

Response :

```json
{
  "status": "string",
  "message": "string"
}
```

## Delete Song

Request :

- Method : DELETE
- Endpoint : `/api/songs/{songId}`
- Header :
  - Accept: application/json

Response :

```json
{
  "status": "string",
  "message": "string"
}
```

## Add User

Request :

- Method : POST
- Endpoint : `/users`
- Header :
  - Accept: application/json
- Body :

```json
{
  "username": "string",
  "password": "string",
  "fullname": "string"
}
```

Response :

```json
{
  "status": "string",
  "message": "string",
  "data": {
    "userId": "string"
  }
}
```

## Authentications

Request :

- Method : POST
- Endpoint : `/authentications`
- Header :
  - Accept: application/json
- Body :

```json
{
  "username": "string",
  "password": "string"
}
```

Response :

```json
{
  "status": "string",
  "message": "string",
  "data": {
    "accessToken": "string",
    "refreshToken": "string"
  }
}
```

## Refresh Authentications Token

Request :

- Method : PUT
- Endpoint : `/authentications`
- Header :
  - Accept: application/json
- Body :

```json
{
  "refreshToken": "string"
}
```

Response :

```json
{
  "status": "string",
  "message": "string",
  "data": {
    "accessToken": "string"
  }
}
```

## Delete Authentications Token

Request :

- Method : DELETE
- Endpoint : `/authentications`
- Header :
  - Accept: application/json

Response :

```json
{
  "status": "string",
  "message": "string"
}
```

## Add Playlist

Request :

- Method : POST
- Endpoint : `/playlists`
- Header :
  - Accept: application/json
- Body :

```json
{
  "name": "string"
}
```

Response :

```json
{
  "status": "string",
  "message": "string",
  "data": {
    "playlistId": "string"
  }
}
```

## Get Playlist

Request :

- Method : GET
- Endpoint : `/playlists`
- Header :
  - Accept: application/json

Response :

```json
{
  "status": "string",
  "data": {
    "playlists": [
      {
        "id": "string",
        "name": "string",
        "username": "string"
      }
    ]
  }
}
```

## Add Song to Playlist by User Credentials

Request :

- Method : POST
- Endpoint : `/playlists/{userAPlaylistId}/songs`
- Header :
  - Accept: application/json
- Body :

```json
{
  "songId": "string"
}
```

Response :

```json
{
  "status": "string",
  "message": "string"
}
```

## Get All Songs from User Playlist

Request :

- Method : GET
- Endpoint : `/playlists/{userAPlaylistId}/songs`
- Header :
  - Accept: application/json

Response :

```json
{
  "status": "string",
  "data": {
    "songs": [
      {
        "id": "string",
        "title": "string",
        "performer": "string"
      }
    ]
  }
}
```

## Delete Song to Playlist by User Credentials

Request :

- Method : DELETE
- Endpoint : `/playlists/{userAPlaylistId}`
- Header :
  - Accept: application/json

Response :

```json
{
  "status": "string",
  "message": "string"
}
```

## Contact

roisfaozi55@gmail.com
