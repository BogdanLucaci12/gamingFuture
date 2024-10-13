Sumary:
This web app is designed for managing the database of an e-commerce website. For better security, I decided to create two roles in this app: Employee and Admin. Some pages are protected, meaning that if you are an employee, you can access all products, add new ones, delete, or update existing ones. Essentially, the employee role manages products, brands, and categories. The Admin role has additional privileges, allowing them to delete or add employee and admin users. All features available to employees are also accessible to admins.

Technology:
1. Frontend - The app uses the React library with Redux Toolkit and useContext for state management. For the UI, the app uses shadcn/ui with TailwindCSS. Some components are styled using styled-components and CSS. For notifications, the app utilizes the Toastify package. Cookies are 
            - used to store some information about the user using json web token. Socket.io-client is used to listen for real-time changes. Cookies store user information through JSON Web Tokens (JWT).
2. Backend  - The app is built with Node.js and uses the Express server to create a RESTful API. Communication between the frontend and backend is secured with JSON Web Token (JWT), an SSL certificate, and Helmet for extra security. Every request is verified through a token. When a 
            - user logs out, the token is saved in a blacklist in the database for added security. The app works with files like photos, and all images are stored in Firebase, which returns URLs that are saved in the app's database. Username and passwords are securely stored in the 
            - database using bcrypt and crypto-js. For real-time communication between the frontend and backend, Socket.io is used. Tests are conducted using Jest and Supertest for API requests.
3. Databases- PostgreSQL is used for storing data, while Firebase is used exclusively for images.

Future purpose: The app is designed to handle a full e-commerce website in the future, with both employees and customers. An e-commerce website for customers will be launched, and employees will manage all products through a dedicated management page like the one created today.
