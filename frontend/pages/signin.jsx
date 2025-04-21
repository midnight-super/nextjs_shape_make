import { useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import client from "../feathers";
import Link from "next/link";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import AuthLayout from "@/components/AuthLayout";
import FormInput from "@/components/FormInput";

const BottomLink = () => {
  return (
    <p className="text-gray-500 dark:text-gray-400 text-center">
      Don't have an account?{" "}
      <Link href="/auth/register">
        <a className="text-primary ms-1">
          <b>Register</b>
        </a>
      </Link>
    </p>
  );
};

export default function SignIn() {
  const { user, userLoading, setUser, userExistsRedirect } =
    useContext(AuthContext);

  userExistsRedirect();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const signin = async () => {
    try {
      console.log(email, password);
      setError("");
      console.log(email, password);
      let res = await client.authenticate({
        strategy: "local",
        email,
        password,
      });

      setUser(res.user);
    } catch (error) {
      console.error("Error signing in:", error);
      setError("Invalid email or password. Please try again.");
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();
    signin();
  };

  if (!user && !userLoading) {
    return (
      <>
        <PageBreadcrumb title="Login" />
        <AuthLayout
          authTitle="Sign In"
          helpText="Enter your email address and password to access the admin panel."
          bottomLinks={<BottomLink />}
          hasThirdPartyLogin
        >
          <form onSubmit={onSubmit}>
            <FormInput
              label="Email Address"
              type="text"
              name="username"
              placeholder="Enter your email"
              containerClass="mb-4"
              className="form-input"
              labelClassName="block text-sm font-medium text-gray-600 dark:text-gray-200 mb-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <FormInput
              label="Password"
              type="password"
              name="password"
              placeholder="Enter your password"
              containerClass="mb-4"
              className="form-input"
              labelClassName="block text-sm font-medium text-gray-600 dark:text-gray-200 mb-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-between mb-4">
              <FormInput
                label="Remember me"
                type="checkbox"
                name="checkbox"
                containerClass="flex items-center"
                labelClassName="ms-2"
                className="form-checkbox rounded"
              />

              <Link
                href={"/forgot-password"}
                className="text-sm text-primary border-b border-dashed border-primary"
              >
                Forget Password ?
              </Link>
            </div>

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <div className="flex justify-center mb-6">
              <button
                className="btn w-full text-white bg-primary"
                type="submit"
              >
                Log In
              </button>
            </div>
          </form>
        </AuthLayout>
      </>
    );
  }
  return null;
}
