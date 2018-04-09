# [api.soundblogs.xyz](https://api.soundblogs.xyz)

## Endpoints

### [JSON API Spec](http://jsonapi.org)

### Resources

- `POST /v1/resources/tokens` - create authorization token (login)
- `DELETE /v1/resources/tokens` - remove authorization token (logout, requires token)
- `POST /v1/resources/users` - create your user (registration)
- `GET /v1/resources/users/:userId` - get any user (requires token for personal data)
- `PATCH /v1/resources/users` - update your user (requires token)
- `DELETE /v1/resources/users` - remove your user (account cancellation, requires token)

- `POST /v1/resources/reviews` - create release review (requires token)
- `GET /v1/resources/reviews/:reviewId` - get release review
- `PATCH /v1/resources/reviews/:reviewId` - update release review (requires token)
- `DELETE /v1/resources/reviews/:reviewId` - remove release review (requires token)

### Integrations

- `GET /v1/integrations/spotify/authorize-url` - get authorize redirect url for your spotify account (requires token)
- `GET /v1/integrations/spotify/access-token` - exchange code for spotify access token of your spotify account (requires token)
- `GET /v1/integrations/spotify/search` - search spotify releases (requires token)

---
