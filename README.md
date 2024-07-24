# Lithuaningo Account Deletion Module

This project is a React component for deleting user accounts in a Firebase-based application. It supports both email/password and Google authentication methods.

## Features

- **Account Deletion**: Users can delete their accounts permanently.
- **Authentication Methods**: Supports authentication via email/password and Google.
- **Error Handling**: Provides detailed error messages for various failure scenarios.
- **Responsive Design**: Built with Tailwind CSS for a responsive and modern user interface.

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/adilsezer/lithuaningo-account-deletion.git
   cd lithuaningo-account-deletion
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up Firebase**:

   - Add your Firebase configuration in `src/firebase/initFirebase.ts`.

4. **Start the application**:
   ```bash
   npm start
   ```

## Firebase Setup

1. **Create a Firebase Project**: If you haven't already, create a Firebase project at [Firebase Console](https://console.firebase.google.com/).

2. **Enable Authentication Methods**:

   - Go to the **Authentication** section in Firebase Console.
   - Enable **Email/Password** and **Google** sign-in methods.

3. **Configure Firebase in Your Project**:
   - Copy your Firebase configuration from the Firebase Console and paste it into `src/firebase/initFirebase.ts`.

## Styling

- The component is styled using **Tailwind CSS**.
- Customize the theme by modifying the `theme` object in `DeleteAccount.tsx`.

## License

This project is licensed under the MIT License.

---

For more detailed instructions, refer to the Firebase and React documentation. If you encounter any issues, feel free to open an issue on GitHub.

---

### Contact

For further questions, please contact [lithuaningo@gmail.com](mailto:lithuaningo@gmail.com).
