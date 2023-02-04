import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

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
    return pageList.length > 0
      ? [
          ...pageList.slice(0, numOfTitlesVisible),
          { pageID: 0, title: "SHOW MORE" },
        ].map((curr) => {
          return (
            <Box
              onClick={() => handleClickGO(curr.title)}
              key={curr.pageID}
              backgroundColor="primary"
              border="1px solid white"
              borderRadius={5}
              margin={1}
              color="white"
              flexWrap="wrap"
              width={"10rem"}
              height="3rem"
              display="flex"
              justifyContent="center"
              alignItems="center"
              textAlign="center"
            >
              {" "}
              <Typography>{curr.title}</Typography>
            </Box>
          );
        })
      : null;
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
        <TextField
          variant="filled"
          label="Search"
          sx={{ backgroundColor: "white", marginTop: 10 }}
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
        />
        <Button
          variant="contained"
          onClick={() => {
            window.open("https://en.wikipedia.org/wiki/Special:Random");
          }}
        >
          RANDOM ARTICLE
        </Button>
        <Button variant="contained" onClick={searchTitle}>
          GO
        </Button>
        <DisplayResults />
      </Box>
    </ThemeProvider>
  );
}

export default App;
