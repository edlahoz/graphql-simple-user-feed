# To run the project locally, follow these instructions:

1. Install the project dependencies:

```
npm install
```

2. Generate the Prisma schema:

```
npx prisma init
```

3. Create the SQLite database:

```
npx prisma migrate dev
```

4. Generate the Prisma client:

```
npx prisma generate
```

5. Seed the database with test data:

```
node src/script.js
```

6. Start the GraphQL server:

```
node src/index.js
```
