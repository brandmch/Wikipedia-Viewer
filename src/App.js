import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  InputBase,
  IconButton,
  Paper,
  Divider,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import EastIcon from "@mui/icons-material/East";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import DirectionsIcon from "@mui/icons-material/Directions";

function parseForURL(str) {
  return str
    .trim()
    .split("")
    .reduce((acc, curr) => {
      return curr === " " ? `${acc}_` : `${acc}${curr}`;
    }, "");
}

const theme = createTheme({
  typography: {
    palette: {
      primary: {
        main: "#96FFFF",
        dark: "#0B6A6A",
        light: "#CEFFFF",
      },
    },
    fontFamily: ["Noto Serif Ahom"],
  },
});

function App() {
  const [textInput, setTextInput] = useState("");
  const [pageList, setPageList] = useState([]);
  const [numOfTitlesVisible, setNumOfTitlesVisible] = useState(0);

  const searchTitle = () => {
    fetch(
      `https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&generator=search&gsrnamespace=0&gsrlimit=100&gsrsearch=${parseForURL(
        textInput
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        let tempArr = [];
        for (let i in data.query.pages) {
          tempArr.push({
            pageID: data.query.pages[i].pageid,
            title: data.query.pages[i].title,
          });
        }
        setPageList(tempArr);
        setNumOfTitlesVisible(5);
      });
    console.log(pageList);
  };

  const handleClickGO = (title) => {
    if (title === "SHOW MORE") {
      setNumOfTitlesVisible(numOfTitlesVisible + 5);
    } else {
      window.open(`https://en.wikipedia.org/wiki/${parseForURL(title)}`);
    }
  };

  const DisplayResults = () => {
    return (
      <Box display="flex" marginTop={5}>
        {pageList.length > 0
          ? [...pageList.slice(0, numOfTitlesVisible)].map((curr) => {
              return (
                <Box
                  onClick={() => handleClickGO(curr.title)}
                  sx={{
                    "&:hover": {
                      backgroundColor: "black",
                      color: "white",
                      cursor: "pointer",
                    },
                    "&:active": {
                      background: "pink",
                    },
                  }}
                  key={curr.pageID}
                  backgroundColor="white"
                  border="1px solid white"
                  borderRadius={5}
                  margin={1}
                  // flexWrap="wrap"
                  width={"10rem"}
                  height="3rem"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  {" "}
                  <Typography marginTop={0.5}>{curr.title}</Typography>
                </Box>
              );
            })
          : null}
        <Box
          onClick={() => setNumOfTitlesVisible(numOfTitlesVisible + 5)}
          sx={{
            "&:hover": {
              backgroundColor: "black",
              color: "white",
              cursor: "pointer",
            },
            "&:active": {
              background: "pink",
            },
          }}
          backgroundColor="white"
          border="1px solid white"
          borderRadius={5}
          margin={1}
          // flexWrap="wrap"
          width={"10rem"}
          height="3rem"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          {" "}
          <Typography>SHOW MORE</Typography>
        </Box>
      </Box>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        display="flex"
        flexDirection="column"
        backgroundColor="#000000"
        alignItems="center"
        minHeight={"100vh"}
        padding={5}
      >
        <Typography color="white" variant="h1">
          Wiki
        </Typography>

        <Paper
          component="form"
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: 400,
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1, paddingTop: 1 }}
            placeholder="Search Wikipedia"
            inputProps={{ "aria-label": "search google maps" }}
            onChange={(e) => setTextInput(e.target.value)}
          />
          <IconButton
            type="button"
            sx={{ p: "10px" }}
            aria-label="search"
            onClick={searchTitle}
          >
            <SearchIcon />
          </IconButton>
        </Paper>

        {/* <Button
          variant="contained"
          onClick={() => {
            window.open("https://en.wikipedia.org/wiki/Special:Random");
          }}
        >
          RANDOM ARTICLE
        </Button> */}
        {pageList.lengt > 0 ? <DisplayResults /> : null}
      </Box>
    </ThemeProvider>
  );
}

export default App;
