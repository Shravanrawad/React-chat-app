##Chat App
A real-time chat application built with React and Firebase authentication.

##Features
-Firebase Authentication: Users can sign up, log in, and log out securely using Firebase Authentication.
-Real-Time Chat: Users can chat with their friends in real-time.
-Friend Add Feature: Users can add friends to their friend list and start chatting.
-Profile Picture Upload: Users can upload their profile pictures.
-Responsive Design: The app is designed to work on various screen sizes.

#Technologies Used
React
Firebase (Firestore, Authentication)
HTML/CSS
JavaScript
Installation
To run this project locally, follow these steps:

#Clone the repository:

bash
Copy code
git clone <repository-url>
Install dependencies:

bash
Copy code
npm install

Set up Firebase:

-Create a Firebase project and enable Firestore and Authentication.

-Copy your Firebase configuration details.

#Create a .env file in the root directory and add your Firebase configuration:

env
Copy code
REACT_APP_FIREBASE_API_KEY=<your-api-key>
REACT_APP_FIREBASE_AUTH_DOMAIN=<your-auth-domain>
REACT_APP_FIREBASE_PROJECT_ID=<your-project-id>
REACT_APP_FIREBASE_STORAGE_BUCKET=<your-storage-bucket>
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=<your-messaging-sender-id>
REACT_APP_FIREBASE_APP_ID=<your-app-id>
Start the development server:

bash
Copy code
npm start
Open your browser and navigate to http://localhost:3000 to view the app.

#Usage

-Sign up for an account if you're a new user, or log in if you already have an account.
-Navigate to the chat section to start chatting with your friends.
-Use the friend add feature to add friends to your friend list.
-Upload a profile picture by clicking on the profile icon.
Deployment
-This project can be deployed to hosting platforms like Firebase Hosting, Netlify, or Vercel. Refer to the respective documentation for deployment instructions.

#Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue if you encounter any bugs or have suggestions for improvements.


