 # Content Moderation

The **Content Moderation** system helps in detecting and filtering inappropriate content across different media types such as images and text. This system ensures that posts containing explicit or harmful content are moderated and filtered before being displayed to users. 

## Collaborators

- Sidhartha S
- Malavika L
- Stephen Paul I
- Prasanna KP

## Tech Used

- **Backend**: Express, Firebase
- **Frontend**: React, Vite
- **Moderation**: Python, CLIP model, Text Classification (using transformers library), PyTorch
- **Other Technologies**: Node.js, JavaScript, HTML, CSS

## Instructions to Run

### Important: Need firebase login and private key:

- Login to firebase
- Create a new project
- Under Build, Add a *Firestore Database*
- After creating a firestore database, click on Rules tab and add the below code 

```bash
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /posts/{postId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    match /likes/{likeId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```
- Then, again navigate to Build and add *Authentication*, select email password as the mode of authentication
- Now, In the top left corner click on the cogwheel near project overview and go to project settings
- Navigate to service account keys and click on generate private key which will download a json file
- Rename the file to *firebase-service-account.json* and copy the file into Content-Moderator/ContentModerator-backend.

- Similarly go to project settings and scroll down to create a new web app . Then get the sdk configuration in it similar to the below content

```bash
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};
```

- Modify the /Content-Moderator/ContentModerator-backend/firebaseConfig.js to your sdk and similarly modify the content of /Content-Moderator/src/client/firebase.js to match your sdk



Follow the steps below to get the Content Moderator system up and running locally on your machine.

### Clone the Repository

Start by cloning the repository to your local machine using the following command and navigate to project repository

```bash
git clone -b final https://github.com/Stephenpaul-03/Content-Moderator.git
cd Content Moderation
```

### To run Frontend

```bash
cd client
npm i
npm install axios firebase react-router-dom
npm run dev
```

### To run Backend

```bash
cd ContentModerator-backend
npm i
npm install ws
npm run dev
```

### To access Application

Open your browser and go to http://localhost:5173.
Register as a new user and log in using your credentials.
Once logged in, you can add posts to the feed.
The system will automatically check for explicit or harmful content, and if any is detected, the post will not be added to the database

## Content flagged as explicit or harmful content

- Safe content Family-friendly, neutral, or harmless content 
- Sexual content Explicit or suggestive sexual imagery or text
- Hate speech content Content promoting hatred or discrimination
- Violent content Depictions or descriptions of physical violence or harm
- Harassment content Bullying, personal attacks, or threats.
- Self-harm content  Glorification or depiction of self-harm or suicide
- Minor-related inappropriate content Inappropriate or explicit content involving minors
- Threatening content Threats of violence or harm toward individuals, groups, or entities

