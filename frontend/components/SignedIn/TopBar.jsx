import Link from "next/link";
import TopBarSearch from "./TopBarSearch";
import LanguageDropdown from "./LanguageDropdown";
import MaximizeScreen from "./MaximizeScreen";
import NotificationDropdown from "./NotificationDropdown";
const avatar2 = "/images/users/avatar-2.jpg";
const avatar4 = "/images/users/avatar-4.jpg";
const profilePic = "/images/users/avatar.png";
import ProfileDropDown from "./ProfileDropdown";
import { useTheme } from "@/context/ThemeContext";

function subtractHours(date, minutes) {
  date.setMinutes(date.getMinutes() - minutes);
  return date;
}

const TopBar = () => {
  const { theme, toggleTheme } = useTheme();

  const toggleDarkMode = () => {
    toggleTheme();
  };
  const profileMenus = [
    {
      label: "Profile",
      icon: "mgc_pic_2_line me-2",
      redirectTo: "/profile",
    },
    {
      label: "Account",
      icon: "mgc_task_2_line me-2",
      redirectTo: "/account",
    },
    {
      label: "Settings",
      icon: "mgc_lock_line me-2",
      redirectTo: "/settings",
    },
  ];

  const notifications = [
    {
      id: 1,
      text: "Datacorp",
      subText: "Caleb Flakelar commented on Admin",
      icon: "mgc_message_3_line text-lg",
      bgColor: "primary",
      createdAt: subtractHours(new Date(), 1),
    },
    {
      id: 2,
      text: "Admin",
      subText: "New user registered",
      icon: "mgc_user_add_line text-lg",
      bgColor: "info",
      createdAt: subtractHours(new Date(), 60),
    },
    {
      id: 3,
      text: "Cristina Pride",
      subText: "Hi, How are you? What about our next meeting",
      avatar: avatar2,
      createdAt: subtractHours(new Date(), 1440),
    },
    {
      id: 4,
      text: "Datacorp",
      subText: "Caleb Flakelar commented on Admin",
      icon: "mgc_message_1_line text-lg",
      bgColor: "primary",
      createdAt: subtractHours(new Date(), 2880),
    },
    {
      id: 5,
      text: "Karen Robinson",
      subText: "Wow ! this admin looks good and awesome design",
      avatar: avatar4,
      createdAt: subtractHours(new Date(), 2880),
    },
  ];
  return (
    <>
      <header className="app-header flex items-center px-4 gap-3">
        <button id="button-toggle-menu" className="nav-link p-2">
          <span className="sr-only">Menu Toggle Button</span>
          <span className="flex items-center justify-center h-6 w-6">
            <i className="mgc_menu_line text-xl"></i>
          </span>
        </button>

        <Link href="/" className="logo-box">
          <div className="logo-light">
            <img
              src={"xzistLogo.svg"}
              className="logo-lg h-6"
              alt="Light logo"
            />
            <img src={"xzistLogo.svg"} className="logo-sm" alt="Small logo" />
          </div>
        </Link>

        <TopBarSearch />

        {/* <LanguageDropdown /> */}

        <MaximizeScreen />

        <NotificationDropdown notifications={notifications} />

        <div className="flex">
          <button
            id="light-dark-mode"
            type="button"
            className="nav-link p-2"
            onClick={toggleDarkMode}
          >
            <span className="sr-only">Light/Dark Mode</span>
            <span className="flex items-center justify-center h-6 w-6">
              <i className="mgc_moon_line text-2xl"></i>
            </span>
          </button>
        </div>
        <ProfileDropDown profiliePic={profilePic} menuItems={profileMenus} />
      </header>
    </>
  );
};

export default TopBar;
