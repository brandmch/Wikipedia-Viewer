import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";

function parseForURL(str) {
  return str
    .trim()
    .split("")
    .reduce((acc, curr) => {
      return curr === " " ? `${acc}_` : `${acc}${curr}`;
    }, "");
}

function App() {
  const [textInput, setTextInput] = useState("");
  const [pageList, setPageList] = useState([]);
  const [numOfTitlesVisible, setNumOfTitlesVisible] = useState(0);
  const [currentArticle, setCurrentArticle] = useState();

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

  const handleClick = (item) => {
    if (item.title === "SHOW MORE") {
      setNumOfTitlesVisible(numOfTitlesVisible + 5);
    }

    fetch(
      `https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&uselang=user&prop=revisions&titles=${item.title}&formatversion=2&rvprop=content&rvslots=*`
    )
      .then((res) => res.json())
      .then((data) => {
        setCurrentArticle(data.query);
        console.log(data.query.pages[0].revisions[0].slots.main.content);
      });
    setPageList([]);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      backgroundColor="#000000"
      alignItems="center"
      minHeight={"100vh"}
    >
      <TextField
        variant="filled"
        label="Search"
        sx={{ backgroundColor: "darkGreen", marginTop: 10 }}
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
      />
      <Button variant="contained" onClick={searchTitle}>
        GO
      </Button>
      {pageList.length > 0
        ? [
            ...pageList.slice(0, numOfTitlesVisible),
            { pageID: 0, title: "SHOW MORE" },
          ].map((curr) => {
            return (
              <Box
                onClick={() => handleClick(curr)}
                key={curr.pageID}
                sx={{
                  color: "white",
                  fontWeight: curr.title === "SHOW MORE" ? "bold" : "normal",
                  padding: 0.5,
                  "&:hover": {
                    backgroundColor: "lightblue",
                    color: "#000000",
                    cursor: "pointer",
                  },
                  "&:active": {
                    background: "pink",
                  },
                }}
              >
                {" "}
                <Typography>{curr.title}</Typography>
              </Box>
            );
          })
        : null}
    </Box>
  );
}

export default App;
