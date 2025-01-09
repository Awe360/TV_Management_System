'use client'
import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider} from "firebase/auth";
import { auth } from "@/config/firebase";
import { useRouter } from "next/navigation";

const LoginPage = () => {
    const router =useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const googleProvider = new GoogleAuthProvider();
  // const githubProvider = new GithubAuthProvider();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/home'); // Redirect after login
    } catch (err) {
      setError(err.message); // Show Firebase error message
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/home"); // Redirect after successful Google login
    } catch (err) {
      setError(err.message); // Show Firebase error message
    }
  };

  // const handleGitHubLogin = async () => {
  //   try {
  //     await signInWithPopup(auth, githubProvider);
  //     router.push("/home"); // Redirect after successful GitHub login
  //   } catch (err) {
  //     setError(err.message); // Show Firebase error message
  //   }
  // };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-700">Login</h1>
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        <form onSubmit={handleLogin} className="mt-6">
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 rounded focus:outline-none focus:ring focus:ring-indigo-300"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 rounded focus:outline-none focus:ring focus:ring-indigo-300"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-500 focus:outline-none focus:bg-indigo-700"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-indigo-600 hover:underline"
          >
            Sign Up
          </a>
        </p>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">Or login with</p>
          <div className="mt-4 space-y-3">
            <button
              onClick={handleGoogleLogin}
              className="w-full px-4 py-2 text-white bg-red-500 rounded hover:bg-red-400 focus:outline-none focus:bg-red-600"
            >
              Google
            </button>
            {/* <button
              onClick={handleGitHubLogin}
              className="w-full px-4 py-2 text-white bg-gray-800 rounded hover:bg-gray-700 focus:outline-none focus:bg-gray-900"
            >
              GitHub
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
