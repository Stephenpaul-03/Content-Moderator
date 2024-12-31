const firebase = require('firebase/app');
require('firebase/auth');

const firebaseConfig = {
  apiKey: "AIzaSyDMYEjvpeTRSqb0pBjtfpzCJGvtJDb4mhI",
  authDomain: "content-moderator-16a65.firebaseapp.com",
  projectId: "content-moderator-16a65",
};

firebase.initializeApp(firebaseConfig);

const customToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTczNTU4MDg0NiwiZXhwIjoxNzM1NTg0NDQ2LCJpc3MiOiJmaXJlYmFzZS1hZG1pbnNkay1ibWltaEBjb250ZW50LW1vZGVyYXRvci0xNmE2NS5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsInN1YiI6ImZpcmViYXNlLWFkbWluc2RrLWJtaW1oQGNvbnRlbnQtbW9kZXJhdG9yLTE2YTY1LmlhbS5nc2VydmljZWFjY291bnQuY29tIiwidWlkIjoiRVpaUTY4UWxVQWVGcTlwd203eXEifQ.DNHW7uNxCQ7wfQV_glVkr66J3lfH1Y7X2iOtQjPU_DHaix1rmAc77v-EKhYd_cZzN1TcTHTae2Z8l3BT7uVZsx_i_n766YaNkvS2ZcJZ-_hXZSQftkQnqtGiVGVBOQJnNVvnozHCF7TPpMYlO5OX5lbZbVGJpjthhv3UAKdEfpJ5Q4YmghhccSoz2rcTpf2nvUnyg428onttAkSX8pKuEVEEOAk2vK9ekO2HETiLncIRLcpRHjMSSQ7OPXQFYMALSLDo7fHe4RA_7f-vZYD1iul_xJT7234l9bfuLM_JGanMZZamA0WZApgZjUmuUylILx920-6yN4MUJHmcvncTZQ";

async function exchangeToken() {
  try {
    const userCredential = await firebase.auth().signInWithCustomToken(customToken);
    const idToken = await userCredential.user.getIdToken();
    console.log("ID Token:", idToken);
    process.exit();
  } catch (error) {
    console.error("Error exchanging token:", error);
    process.exit(1);
  }
}

exchangeToken();

