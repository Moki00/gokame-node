# This is the backend for Gokame.com

## using Node.js

```
npm run dev  # Start in development mode (with Nodemon)
npm start    # Start in production mode (with Node.js)
```

```
set up with npm init and install
```

# Create User

curl -X POST http://localhost:5000/api/users -H "Content-Type: application/json" -d '{"name": "Gokame Man", "email": "Gokame@gmail.com"}'

# Get All Users

curl -X GET http://localhost:5000/api/users

# Get User by ID

curl -X GET http://localhost:5000/api/users/1

# Update User

curl -X PUT http://localhost:5000/api/users/1 -H "Content-Type: application/json" -d '{"name": "Some Updated Name", "email": "newemail@example.com"}'

# Delete User

curl -X DELETE http://localhost:5000/api/users/1

# Register User

curl -X POST http://localhost:5000/api/auth/register \
 -H "Content-Type: application/json" \
 -d '{"name": "John Doe", "email": "john@example.com", "password": "securepass"}'

# Login User

curl -X POST http://localhost:5000/api/auth/login \
 -H "Content-Type: application/json" \
 -d '{"email": "john@example.com", "password": "securepass"}'
