import React from "react";
import Link from "next/link";

// images
import logoLight from "../assets/images/logo-light.png";
import logoDark from "../assets/images/logo-dark.png";

// component

const AuthLayout = ({
  pageImage,
  authTitle,
  helpText,
  bottomLinks,
  isCombineForm,
  children,
  hasForm,
  hasThirdPartyLogin,
  userImage,
}) => {
  // useEffect(() => {
  //   if (document.body) {
  //     document.body.classList.add('authentication-bg', 'position-relative')
  //   }
  //   return () => {
  //     if (document.body) {
  //       document.body.classList.remove('authentication-bg', 'position-relative')
  //     }
  //   }
  // }, [])

  return (
    <>
      <div className="bg-gradient-to-r from-rose-100 to-teal-100 dark:from-gray-700 dark:via-gray-900 dark:to-black">
        <div className="h-screen w-screen flex justify-center items-center">
          <div className="2xl:w-1/4 lg:w-1/3 md:w-1/2 w-full">
            <div className="card overflow-hidden sm:rounded-md rounded-none">
              <div className="p-6">
                {userImage ? (
                  <div className="flex justify-between">
                    <div className="flex flex-col gap-4 mb-6">
                      <Link href="/" className="block">
                        <img
                          className="h-6 block dark:hidden"
                          src={logoDark}
                          alt="Logo Dark"
                        />
                        <img
                          className="h-6 hidden dark:block"
                          src={logoLight}
                          alt="Logo Light"
                        />
                      </Link>
                      <h4 className="text-slate-900 dark:text-slate-200/50 font-semibold">
                        Hi ! Adam{" "}
                      </h4>
                    </div>
                    <img
                      src={userImage}
                      alt="user"
                      className="h-16 w-16 rounded-full shadow"
                    />
                  </div>
                ) : (
                  <Link href="/" className="block mb-8">
                    <img
                      className="h-6 block dark:hidden"
                      src={"xzistLogo.svg"}
                      alt="Logo Dark"
                    />
                    <img
                      className="h-6 hidden dark:block"
                      src={logoLight}
                      alt="Logo Light"
                    />
                  </Link>
                )}

                {children}

                <div className="flex items-center my-6">
                  <div className="flex-auto mt-px border-t border-dashed border-gray-200 dark:border-slate-700"></div>
                  <div className="mx-4 text-secondary">Or</div>
                  <div className="flex-auto mt-px border-t border-dashed border-gray-200 dark:border-slate-700"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
