# blog-server

This is an api only backend which uses a MongoDB database. This project uses passport for authentication using both local and JWT strategies. Pug is setup as a template if you'd rather use it instead of hooking up a front end framework like React.

## API Routes

Here is a list of the routes. Make sure to precede the routes with your server uri (https://server_uri/api/some_path) when fetching data.

- api/sign-in (post route)
- api/posts (get and post routes)
- api/posts/:id (get, put, and delete routes)
- api/posts/:id/create-comment (post)

Those routes are simple and self explanatory.

**Thank you for checking out my blog-server project!**