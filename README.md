# blog-server

This is an api only backend which uses a MongoDB database. This project uses passport for authentication using both local and JWT strategies. Pug is setup as a template if you'd rather use it instead of hooking up a front end framework like React.

## API Routes

Here is a list of the routes. Make sure to precede the routes with your server uri (https://server_uri/api/some_path) when fetching data.

- api/sign-in (post route). This route is looking for `username`, `password`, `confirmPassword` fields and the optional `firstName` and `lastName` fields.
- api/posts (get and post routes). The post route is looking for the `title` and `content` fields. The user must be signed in to create a post.
- api/posts/:id (get, put, and delete routes). The put route is looking for the `title` and `content` fields. The delete route just needs the post id (sent as a url parameter). The user must be signed in to update or delete posts.
- api/posts/:id/create-comment (post). This route is looking for the `content` field. The user must be signed in to leave a comment.

**Thank you for checking out my blog-server project!**