const normalizeFirebaseErrorMessage = (errorCode) => {
  const errorMessages = {
    "auth/email-already-in-use":
      "This email address is already in use. Please use a different email.",
    "auth/invalid-email":
      "The email address is not valid. Please enter a valid email.",
    "auth/operation-not-allowed":
      "Email/password accounts are not enabled. Please contact support.",
    "auth/weak-password":
      "The password is too weak. Please choose a stronger password.",
    "auth/user-disabled":
      "This user account has been disabled. Please contact support.",
    "auth/user-not-found":
      "No user found with this email. Please check and try again.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/invalid-credential": "Invalid credentials. Please try again.",
  };

  return (
    errorMessages[errorCode] ||
    "An unexpected error occurred. Please try again."
  );
};

export default normalizeFirebaseErrorMessage;
