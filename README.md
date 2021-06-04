## Technical Minecraft Archive
TMA is a place to archive Minecraft contraptions for technical gameplay.

### Use
Download the repository using:
```shell
$ git clone https://github.com/samipourquoi/tma.git
$ cd tma
```

You will need `docker` and `docker-compose`. The latest versions of `docker` include `docker-compose` 
under `docker compose` (without the hyphen) by default. Both work.

Create a Discord application [here](https://discord.com/developers/applications).

In the OAuth2 tab, add a redirect to `https://<YOUR DOMAIN>/api/auth/discord/callback`.

Create a file in `config/config.yml` and fill it in with the following:
```yaml
auth:
  clientID: "<client id>"
  clientSecret: "<client secret>"
  callbackURL: "<callback url>" 
```

Get the docker images using:
```shell
$ docker-compose build --parallel
$ # Alternatively, you can use prebuilt images.
$ docker-compose pull
```

Then, start it with:
```shell
$ docker-compose up -d
```

### Contribute
We use Typescript throughout the entire project.

On the backend, we use [Express](https://expressjs.com) with [Typera](https://github.com/akheron/typera.git) for type safeness.

On the frontend, we use [React](https://reactjs.org) with [Next](https://nextjs.org). 
We also use [React Query](https://react-query.tanstack.com) for datafetching. 
For styling, we use [TailwindCSS](https://tailwindcss.com) with very little [SCSS](https://sass-lang.com).

Most of them are very easy to learn just by reading the code.
If you want to help, contact me on discord: `samipourquoi#9267`! 😀
