
## How to Run the Project

### 1. Clone the repository

```bash
git clone https://github.com/Alejoso/TrainerView.git
cd TrainerView
```

### 2. Install dependencies

We used npm version 10.9.2 and Node 22.16.0

```bash
npm install
```

### 3. Set up environment variables

Create a .env file in the root directory of the project:

```
# Your OpenAI API key
OPENAI_API_KEY=

# Development URL
NEXT_URL="http://localhost:3000"

# Your MongoDB connection string (example placeholder)
# The database in this project is named "TrainerView" with a collection called "Entrevistas".
MONGODB_URI="mongodb+srv://testUser:123456@my-sample-cluster.xxxxx.mongodb.net/demoDB"

```

### 4. Run the project in development mode

```bash
npm run dev
```
