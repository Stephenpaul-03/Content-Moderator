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

