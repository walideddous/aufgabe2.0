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

```
1. Click on New button
2. Select mode

```
![1,2](https://user-images.githubusercontent.com/58551055/100370553-be905880-3006-11eb-8ee6-4f7ecc35ea72.gif)

```
3. Fill in the form

```

![3](https://user-images.githubusercontent.com/58551055/100370842-32326580-3007-11eb-99c7-36f7991edf04.gif)

```
4. Pick the first stop

```

![4](https://user-images.githubusercontent.com/58551055/100370905-48d8bc80-3007-11eb-90be-541b5a433935.gif)

```
5. a. Construct the stop sequence from the drag and drop component

```

![5 a](https://user-images.githubusercontent.com/58551055/100370943-5c842300-3007-11eb-93cd-b0eaa0a3fc1d.gif)

```
5. b. Or Construct the stop sequence from the map component

```

![5 bb](https://user-images.githubusercontent.com/58551055/100370992-6b6ad580-3007-11eb-93d8-922f397f8820.gif)

```
6. Save

```

![6](https://user-images.githubusercontent.com/58551055/100371047-82112c80-3007-11eb-89b8-bbffab93045b.gif)

### Load stop sequence

```
1. Click on Load button
2. Select mode
3. Select stop sequence

```

![1,2,3](https://user-images.githubusercontent.com/58551055/100371103-91907580-3007-11eb-8530-eb3787adc971.gif)

### Delete stop sequence

```
1. Click on Load button
2. Select mode
3. Select stop sequence
4. Click on the delete stop sequence button

```

![1,2,3,4](https://user-images.githubusercontent.com/58551055/100371147-a240eb80-3007-11eb-8cd1-6447bf71908d.gif)
