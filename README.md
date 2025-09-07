___ATM Web Application___

A full-stack ATM web application with separate admin and user interfaces. Built with Next.js, Express, MongoDB/Mongoose, and enhanced with modern frontend tools like TanStack Query, Axios, and Chart.js. Security is handled via token-based authentication with custom middleware using elden-js.

___Admin Panel___
  - Secure admin login with token authentication.
  - View all users and their account details.
  - Create, edit, and delete users.
  - View all transactions (deposits and withdrawals).
  - Visualize deposits vs withdrawals using Chart.js.

___User Panel___
  - Login using account number and PIN.
  - Deposit and withdraw funds securely.
  - View current balance and user transaction history.

___Frontend Architecture___
  - *Next.js — React-based framework for SSR and frontend routing.
  - TanStack Query — for caching and automatic refetching of data.
  - Axios — for HTTP requests.
  - Custom middleware secures routes using token validation (verifyAccess from elden-js).
  - All routes protected with Next.js middleware using elden-js verifyAccess.

___Backend Architecture___
  - Express.js — REST API server.
  - MongoDB & Mongoose — database and schema modeling.
  - Middleware to handle authentication and authorize access via tokens.

___Security___
  - All frontend routes protected with token-based authentication.
  - Backend routes secured with custom requireAuth middleware.
  - Tokens stored in HTTP-only cookies for safer access.

___Notes___
  - The project uses custom elden-js verifyAccess to simplify route protection and token verification.
  - TanStack Query ensures smooth caching and refetching of user data.
  - Chart.js visually represents admin transaction summaries.

License
MIT License
