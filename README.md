## Installing

```
git clone https://github.com/walideddous/aufgabe2.0.git

cd aufgabe2.0

yarn add or npm install

yarn run dev or npm run dev

Front End http://localhost:3000
Back End http://localhost:5000
```

## Project Structure

Overview

```
│
├── /client/                    # The source code of the application
│   ├── .env                    # Store the JSON secret key
│   └── /src/
│           ├── App.tsx         # Is the main file
│           ├── /components/    # Contain the components {dnd, form, loadStopSequenceForm, map, search}
│           ├── /config/        # Contain the Endpoint and the GraphQl query to the Backend
│           ├── /customHooks/   # Contain customHook of the components/index.tsx
│           ├── /services/      # Contain the axios CRUD call to the backend
│           ├── /testUtils/     # Contain the data that will help to the unit test
│           ├── /types/         # Contain the typescript declared types
│           └── /utils/         # Contain function that will help in some component
│
├── /routes/
│   └── stopSequence.js         # Contain the CRUD operation (get, delete, save stop Sequence)
├── /schema/
│   └── schema.js               # Contain the GraphQl schema
├── .config.env                 # Contain the different secret key {JWT_SECRET, MONGO_URI, PORT, NODE_ENV}
└── server.js                   # Node server config file
```

## Tutoriel

### Create stop sequence

1. Click on New button
2. Select mode

```


```

3. Fill in the form

```


```

4. Pick the first stop

```


```

5. a. Construct the stop sequence from the drag and drop component

```


```

5. b. Or Construct the stop sequence from the map component

```


```

6. Save

```


```

### Load stop sequence

1. Click on Load button
2. Select mode
3. Select stop sequence

```


```

### Delete stop sequence

1. Click on Load button
2. Select mode
3. Select stop sequence
4. Click on the delete stop sequence button

```


```
