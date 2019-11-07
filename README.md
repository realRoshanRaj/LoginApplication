# Nuxt.js Application

> [Preview Nuxt.js application](https://nuxtauth.herokuapp.com)

## Build Setup

``` bash
# install dependencies
$ npm run install
```
#### Create Environment Variables
1. Create a .env file in the root folder
2. In the .env file add a line for mongodb (replace the string below with your actual database information)

`
DB_URL = mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[database][?options]]
`

3. Add line for cookie key

`
COOKIE_KEY = whateverYouWantItToBe
`

4. This application has an implementation of Google OAuth. In order for oauth to work successfully the following two lines need to be generated for YOUR account

```
GOOGLE_CLIENT_ID = generatedid.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET = googleGeneratedClientSecretForOAuth
```


```
# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```
