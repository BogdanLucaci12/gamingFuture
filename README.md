Sumary:
This project web app is meant for an e-commerce website management database system.
For a better security, I decide to create 2 state for this app: Employee state and Admin state. In the app some pages are protected, so if you are an employee you can acces all products, add more of them,
delete or update an existend one. Basically, employee user manage product, brand, or category. Admin state is a special part, where they can delete or add employee users or admin users. All features from employee state are inherited to admin.

Technology:
1. Frontend - The app used React library with redux toolkit and useContext for the management of the state. Regarding to UI, the app use shadcn/ui with tailwindcss. Some components are styled with css using styled-component. For notification it used Toastify package.
            - Socket.io-client it is used to listen for live changes.
2. Backend  - 
