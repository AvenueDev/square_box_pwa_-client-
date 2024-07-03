import { Route, Routes, useNavigate } from "react-router-dom";
import styles from "../src/styles/App.module.scss";
import Home from "./routes/Home";
import News from "./routes/News";
import Youtube from "./routes/Youtube";
import SignUp from "./routes/SignUp";
import AfterSignUp from "./routes/AfterSignUp";
import SignUpError from "./routes/SignUpError";
import BookMark from "./routes/BookMark";
import LogIn from "./routes/LogIn";
import { IoSearch, IoMenu } from "react-icons/io5";
import { GoSun, GoMoon, GoSignOut } from "react-icons/go";
import { FaHome, FaNewspaper, FaYoutube, FaBookmark, FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store/store";
import { setInputValue } from "./store/inputValueSlice";
import { setNewsData, setYoutubeData } from "./store/dataSlice";
import { setUserCheck, setUsername } from "./store/verificationSlice";
import { FormEvent, useEffect, useRef } from "react";
import { BsBox } from "react-icons/bs";
import SearchModal from "./components/SearchModal";
import axios from "axios";
import {
  setBookMarkLimitModalTrigger,
  setBookMarkModalTrigger,
  setDarkLight,
  setMenuIndex,
  setNavSwitch,
  setNewsLoading,
  setSearchModalTrigger,
  setYoutubeLoading,
} from "./store/userInterfaceSlice";
import Cookies from "js-cookie";
import reissueToken from "./module/reissueToken";
import { jwtDecode } from "jwt-decode";
import { TokenInfo } from "./types/types";
import BookMarkModal from "./components/BookMarkModal";
import BookMarkLimitModal from "./components/BookMarkLimitModal";

function App(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const inputValue = useSelector((state: RootState) => state.inputValue);
  const refInputValue = useRef("");
  const { menuIndex } = useSelector((state: RootState) => state.userInterface);
  const { searchModalTrigger } = useSelector((state: RootState) => state.userInterface);
  const { bookMarkModalTrigger } = useSelector((state: RootState) => state.userInterface);
  const { bookMarkLimitModalTrigger } = useSelector((state: RootState) => state.userInterface);
  const { darkLightToggle } = useSelector((state: RootState) => state.userInterface);
  const { userCheck } = useSelector((state: RootState) => state.verification);
  const accessToken = Cookies.get("accessToken");
  const refreshToken = Cookies.get("refreshToken");
  const { username } = useSelector((state: RootState) => state.verification);
  const { navSwitch } = useSelector((state: RootState) => state.userInterface);

  const verifyToken = async () => {
    try {
      const response = await reissueToken();
      if (response.status === 200 && accessToken) {
        const decodedToken = jwtDecode<TokenInfo>(accessToken);
        dispatch(setUserCheck(true));
        dispatch(setUsername(decodedToken.username));
      }
    } catch (error) {
      console.error("Token reissue failed.", error);
    }
  };

  useEffect(() => {
    if (!accessToken && refreshToken) {
      verifyToken();
    } else if (!accessToken && !refreshToken) {
      dispatch(setUserCheck(false));
      navigate("/");
    } else if (accessToken) {
      const decodedToken = jwtDecode<TokenInfo>(accessToken);
      dispatch(setUsername(decodedToken.username));
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkLightToggle);
  }, [darkLightToggle]);

  useEffect(() => {
    localStorage.getItem("theme") === "dark" ? dispatch(setDarkLight("dark")) : dispatch(setDarkLight("light"));
  }, [dispatch]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    dispatch(setInputValue(e.target.value));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    dispatch(setNewsLoading(true));
    dispatch(setYoutubeLoading(true));
    refInputValue.current = inputValue;

    menuIndex === 0 && dispatch(setSearchModalTrigger(true));
    e.preventDefault();

    const fetchNewsData = async (): Promise<void> => {
      try {
        const response = await axios.put(
          process.env.REACT_APP_GET_NEWS_API_URL as string,
          { inputValue },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        const result = response.data;

        dispatch(setNewsData(result));
        dispatch(setNewsLoading(false));
      } catch (error: unknown) {
        console.error("Error fetching news data: ", error);
      }
    };

    const fetchYoutubeData = async (): Promise<void> => {
      try {
        const response = await axios.put(
          process.env.REACT_APP_GET_YOUTUBE_API_URL as string,
          { inputValue },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        const result = response.data.items;

        dispatch(setYoutubeData(result));
        dispatch(setYoutubeLoading(false));
      } catch (error: unknown) {
        console.error("Error fetching youtube data: ", error);
      }
    };

    Promise.all([fetchNewsData(), fetchYoutubeData()]);
  };

  const logOut = (): void => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    dispatch(setUserCheck(false));
    navigate("/");
  };

  const menuItem = [
    { path: "/home", icon: <FaHome />, label: "Home" },
    { path: "/news", icon: <FaNewspaper />, label: "News" },
    { path: "/youtube", icon: <FaYoutube />, label: "Youtube" },
    { path: "/bookmark", icon: <FaBookmark />, label: "Bookmark" },
  ];

  const themeExchange = () => {
    if (darkLightToggle === "dark") {
      dispatch(setDarkLight("light"));
      localStorage.setItem("theme", "light");
    } else {
      dispatch(setDarkLight("dark"));
      localStorage.setItem("theme", "dark");
    }
  };

  return (
    <div className={styles.bodyContainer}>
      <div className={styles.modalSet} style={searchModalTrigger === true ? { display: "block" } : { display: "none" }}>
        <SearchModal />
        <div className={styles.overlay} role="button" onClick={() => dispatch(setSearchModalTrigger(false))} />
      </div>
      <div
        className={styles.bookMarkModalSet}
        style={bookMarkModalTrigger === true ? { display: "block" } : { display: "none" }}
      >
        <BookMarkModal />
        <div className={styles.overlay} role="button" onClick={() => dispatch(setBookMarkModalTrigger(false))} />
      </div>
      <div
        className={styles.bookMarkLimitModalSet}
        style={bookMarkLimitModalTrigger === true ? { display: "block" } : { display: "none" }}
      >
        <BookMarkLimitModal />
        <div className={styles.overlay} role="button" onClick={() => dispatch(setBookMarkLimitModalTrigger(false))} />
      </div>
      <div className={styles.backgroundSet}>
        <div className={styles.circle1} />
        <div className={styles.circle2} />
        <div className={styles.circle3} />
        <div className={styles.circle4} />
        <div className={styles.finalBackground} />
      </div>
      <div>
        <div className={styles.mainContainer}>
          {userCheck === true && (
            <div>
              <header className={styles.header}>
                <h1
                  className={styles.logo}
                  onClick={() => {
                    dispatch(setMenuIndex(0));
                    navigate("/home");
                  }}
                >
                  <BsBox />
                  <span>Square Box</span>
                </h1>

                <div className={styles.headerBlock}>
                  <form
                    onSubmit={
                      inputValue && refInputValue.current !== inputValue
                        ? onSubmit
                        : (e: FormEvent<HTMLFormElement>) => e.preventDefault()
                    }
                  >
                    <div className={styles.searchBar}>
                      <input
                        type="text"
                        onChange={onChange}
                        value={inputValue}
                        placeholder="Search"
                        spellCheck="false"
                        autoComplete="off"
                      />
                      <div
                        role="button"
                        className={styles.clearBtn}
                        onClick={() => dispatch(setInputValue(""))}
                        style={inputValue === "" ? { display: "none" } : { display: "block" }}
                      >
                        <span className={`${styles.iconSet} ${styles.part1}`}></span>
                        <span className={`${styles.iconSet} ${styles.part2}`}></span>
                      </div>
                      <button className={styles.searchIconBox} type="submit">
                        <IoSearch className={styles.searchIcon} />
                      </button>
                    </div>
                  </form>

                  <div className={styles.user}>
                    <FaUser className={styles.icon} />
                    <span>{username}</span>
                  </div>

                  <button className={styles.darkModeBtn} onClick={themeExchange}>
                    {darkLightToggle === "dark" ? (
                      <GoSun className={styles.darkModeIcon} />
                    ) : (
                      <GoMoon className={styles.darkModeIcon} />
                    )}
                  </button>

                  <button className={styles.logOutBtn} onClick={logOut}>
                    <GoSignOut className={styles.logOutIcon} />
                    <span>Log Out</span>
                  </button>
                </div>
              </header>
              <nav className={styles.navbar}>
                <button
                  className={styles.menuSwitch}
                  onClick={() => dispatch(navSwitch ? setNavSwitch(false) : setNavSwitch(true))}
                >
                  <IoMenu />
                </button>
                <ul className={!navSwitch ? "" : styles.switch}>
                  {menuItem.map((item, index) => {
                    return (
                      <li
                        className={menuIndex === index ? `${styles.menuIcon}` : ""}
                        key={index}
                        onClick={() => {
                          dispatch(setMenuIndex(index));
                          navigate(`${item.path}`);
                        }}
                      >
                        <div className={styles.icon}>{item.icon}</div>
                        <span className={menuIndex === index ? `${styles.menuText}` : ""}>{item.label}</span>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          )}

          <Routes>
            <Route path="/" element={<LogIn />} />
            <Route path="/home" element={<Home />} />
            <Route path="/news" element={<News />} />
            <Route path="/youtube" element={<Youtube />} />
            <Route path="/bookmark" element={<BookMark />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/welcome" element={<AfterSignUp />} />
            <Route path="/signup_error" element={<SignUpError />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
