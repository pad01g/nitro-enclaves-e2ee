# what is this

Save user/password credential and private key in e2ee way using nitro enclaves. Sign client message only if credentials are verified **inside** of nitro enclaves, so that server admin cannot steal information unless password bruteforce.

# requirements

 - yarn
 - nodejs (>=v16)

# install

```
yarn install
```

# run

```
yarn start:dev
```

# documentation

see http://127.0.0.1:3000/documentation/#/

# note

This software uses
 - NestJS framework
 - https://github.com/NarHakobyan/awesome-nest-boilerplate