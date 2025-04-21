import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

import client from "../feathers";
import Dashboard from "../components/SignedIn/Dashboard";
import { useRouter } from "next/router";
const Home = () => {
  const router = useRouter();

  const { user, userLoading } = useContext(AuthContext);

  // console.log("user in home", user);

  if (!user) router.push("signin");
  if (!userLoading && user && !user.isSuperAdmin) router.push("/dashboard");
  if (!userLoading && user && user.isSuperAdmin) router.push("/admin/staff");

  return (
    <div className="">
      {/* {!userLoading && user && <Dashboard />} */}
      {!userLoading && !user && <></>}
    </div>
  );
};

export default Home;

// const NotSignedIn = () => {

//   return (

//   )

// }

// export default function Home() {

//   const [user, setUser] = useState(null);

//   async function init() {
//     try {
//       let res = await client.reAuthenticate();
//       setUser(res.user);
//       console.log("here is the user found at start up");
//       console.log(res.user);
//     } catch (error) {
//       console.log(error);
//       console.log("no user was found at start up");

//       setUser(null);
//     }
//   }

//   useEffect(() => {
//     init();
//   }, []);

//   const login = async () => {
//     try {
//       console.log("login");

//       let res = await client.authenticate({
//         strategy: "local",
//         email: "test@live.co.uk",
//         password: "password",
//       });

//       console.log("res ", res);
//       setUser(res.user);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const logout = async () => {
//     try {
//       console.log("logout");

//       let res = await client.logout();
//       setUser(null);
//       console.log(res);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <div className="">
//       <h1>feathers</h1>
//       {!user && <button onClick={login}>login</button>}
//       {user && <button onClick={logout}>logout</button>}

//       <button
//         className="p-4 bg-red-500 text-white"
//         onClick={() => console.log(user)}
//       >
//         View user
//       </button>

//       <Robots />
//     </div>
//   );
// }

// const Robots = () => {
//   const [robots, setRobots] = useState([]);

//   useEffect(() => {
//     async function init() {
//       try {
//         const robotsService = client.service("robots");
//         let robots = await robotsService.find();
//         robots = robots.data;
//         setRobots(robots);
//         console.log(robots);

//         robotsService.on("created", (data) => {
//           console.log("New robot created", data);
//         });
//       } catch (error) {
//         console.log(error);
//       }
//     }

//     init();

//     client.service("robots").on("created", (data) => {
//       console.log("New robot created", data);
//     });
//   }, []);

//   return (
//     <>
//       <h1>Robots</h1>
//       {robots &&
//         robots.map((robot, i) => (
//           <div key={i} className="p-4 m-4 w-fit border border-black shadow-md">
//             <h1>Name: {robot.name}</h1>
//             <h1>Color: {robot.color}</h1>
//           </div>
//         ))}
//     </>
//   );
// };
