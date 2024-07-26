import React, { useState, useEffect, useRef } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemButtonText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import InputAdornment from "@mui/material/InputAdornment";
import { KeyboardReturn } from "@mui/icons-material";
import { products } from "../data/products";
import { resources } from "../data/resources";
import Lottie from "lottie-react";
import octopus from "../assets/octopus.json";
import telescope from "../assets/telescope_no_watermark.json";

const Search = () => {
  const [inputValue, setInputValue] = useState("");
  const [specifierConfirmed, setSpecifierConfirmed] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({
    product: "",
    resource: "",
    specifier: "",
  });
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    updateInput();
  }, [inputValue]);

  useEffect(() => {
    updateOptions();
  }, [selectedOptions]);

  useEffect(() => {
    setAnchorEl(inputRef.current);
    setShowOptions(false); // Ensure it starts closed
  }, []);

  const updateInput = () => {
    // analyze current input
    const inputWords = inputValue.trim().split(" ");

    // 1 word + space
    if (inputWords.length === 1 && inputValue.endsWith(" ")) {
      const matchedProduct = Object.values(products).find(
        (p) => inputWords[0].toLowerCase() == p.name.toLowerCase()
      );
      if (matchedProduct) {
        setSelectedOptions({
          product: matchedProduct.name,
          resource: "",
          specifier: "",
        });
      } else {
        setSelectedOptions({ product: "", resource: "", specifier: "" });
      }
    }
    // empty
    else if (inputValue == "") {
      // prevents unnecessary renders if no change is needed
      if (selectedOptions.product) {
        setSelectedOptions({ product: "", resource: "", specifier: "" });
        setSpecifierConfirmed(false);
      }
    }
    // 1 word
    else if (inputWords.length === 1) {
      setSelectedOptions({ product: "", resource: "", specifier: "" });
    }

    // 2 words + space
    if (inputWords.length === 2 && inputValue.endsWith(" ")) {
      const matchedResource = resources[selectedOptions.product]?.find(
        (r) => inputWords[1].toLowerCase() == r.name.toLowerCase()
      );
      if (matchedResource) {
        setSelectedOptions((prev) => ({
          ...prev,
          resource: matchedResource.name,
          specifier: "",
        }));
      } else {
        setSelectedOptions((prev) => ({
          ...prev,
          resource: "",
          specifier: "",
        }));
      }
    }
    // 2 words
    else if (inputWords.length === 2) {
      setSelectedOptions((prev) => ({
        ...prev,
        resource: "",
        specifier: "",
      }));
    } else if (inputWords.length > 2) {
      const resourceData = resources[selectedOptions.product]?.find(
        (r) => r.name == selectedOptions.resource
      );
      const matchedSpecifier = resourceData?.specifiers?.find(
        (s) =>
          inputWords.slice(2).join(" ").toLowerCase() ==
          s.identifier.toLowerCase()
      );
      if (matchedSpecifier) {
        setSelectedOptions((prev) => ({
          ...prev,
          specifier: matchedSpecifier.identifier,
        }));
        setShowOptions(false);
        setSpecifierConfirmed(true);
        // navigateToLink(
        //   selectedOptions.product,
        //   selectedOptions.resource,
        //   matchedSpecifier.identifier
        // );
      } else {
        setSelectedOptions((prev) => ({ ...prev, specifier: "" }));
        setSpecifierConfirmed(false);
      }
    }
  };

  const updateOptions = () => {
    const { product, resource } = selectedOptions;
    let newFilteredOptions = [];

    const inputWords = inputValue.trim().split(" ");

    // Show product options if no product is selected
    if (!product) {
      newFilteredOptions = Object.values(products)
        .filter((p) =>
          p.name.toLowerCase().includes(inputWords[0]?.toLowerCase())
        )
        .map((p) => p.name);
    }
    // Show resource options if a product is selected but no resource is selected
    else if (product && !resource) {
      if (resources[product]) {
        const resourceSearchValue = inputWords[1]?.toLowerCase() || "";
        newFilteredOptions = resources[product]
          .filter((r) => r.name.toLowerCase().includes(resourceSearchValue))
          .map((r) => r.name);

        // Show all resource options if the input value ends with a space
        if (inputValue.endsWith(" ")) {
          newFilteredOptions = resources[product].map((r) => r.name);
        }
      }
    }
    // Show specifier options if both product and resource are selected
    else if (product && resource) {
      const resourceData = resources[product].find((r) => r.name == resource);
      if (resourceData && resourceData.specifiers) {
        const specifierSearchValue = inputValue
          .substring(inputValue.indexOf(resource) + resource.length)
          .trim()
          .toLowerCase();
        newFilteredOptions = resourceData.specifiers
          .filter((s) =>
            s.identifier.toLowerCase().includes(specifierSearchValue)
          )
          .map((s) => s.identifier);

        // Show all specifier options if the input value ends with a space
        if (inputValue.endsWith(" ") && specifierSearchValue === "") {
          newFilteredOptions = resourceData.specifiers.map((s) => s.identifier);
        }
      }
    }

    setFilteredOptions(newFilteredOptions);
    // hide options if either the specifier has been chosen, or if there are no options left to pick from
    setShowOptions(!selectedOptions.specifier && newFilteredOptions.length > 0);
    if (newFilteredOptions.length > 0) {
      setHighlightedIndex(0);
    }
  };

  const handleInputChange = (event) => {
    const newInputValue = event.target.value;
    setInputValue(newInputValue);
    //setAnchorEl(event.currentTarget);
  };

  const handleFocus = () => {
    updateOptions();
    setShowOptions(true);
  };

  const handleOptionClick = (option) => {
    const { product, resource } = selectedOptions;
    console.log("handle Click: " + inputValue);

    if (!product) {
      setInputValue(option + " ");
    } else if (product && !resource) {
      setInputValue(product + " " + option + " ");
      const resourceData = resources[product].find((r) => r.name == option);
      // if (resourceData && resourceData && resourceData.link) {
      //   setSpecifierConfirmed(true);
      // }
    } else if (product && resource) {
      setInputValue(product + " " + resource + " " + option + " ");
      // setShowOptions(false);

      // setSpecifierConfirmed(true);
    }

    inputRef.current.focus();
    updateOptions(); // Ensure options are updated after clicking
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % filteredOptions.length;
        scrollToItem(newIndex);
        return newIndex;
      });
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((prevIndex) => {
        const newIndex =
          (prevIndex - 1 + filteredOptions.length) % filteredOptions.length;
        scrollToItem(newIndex);
        return newIndex;
      });
    } else if (event.key === "Enter") {
      const option = filteredOptions[highlightedIndex];
      console.log("enter hit: " + inputValue);
      if (specifierConfirmed) {
        navigateToLink(
          selectedOptions.product,
          selectedOptions.resource,
          option
        );
      } else {
        console.log("specific = false " + inputValue);
        handleOptionClick(option);
        //setSpecifierConfirmed(true);
      }
      setHighlightedIndex(0);
    } else if (event.key === "Backspace" && inputValue.length == "") {
      setSelectedOptions({ product: "", resource: "", specifier: "" });
    }
  };

  const scrollToItem = (index) => {
    const listElement = document.getElementById("options-list");
    const itemElement = document.getElementById(`option-${index}`);
    if (listElement && itemElement) {
      listElement.scrollTop =
        itemElement.offsetTop -
        listElement.clientHeight / 2 +
        itemElement.clientHeight / 2;
    }
  };

  const handleClickAway = () => {
    setShowOptions(false);
  };

  const navigateToLink = (product, resource, specifier) => {
    console.log("navigate to link");
    const resourceData = resources[product].find((r) => r.name === resource);
    const specifierData = resourceData?.specifiers?.find(
      (s) => s.identifier === specifier
    );
    if (specifierData && specifierData.metadata?.link) {
      window.open(specifierData.metadata.link, "_blank");
    } else if (resourceData && resourceData.metadata?.link) {
      window.open(resourceData.metadata.link, "_blank");
    } else {
      const productMeta = products[product]?.metadata;
      if (productMeta && productMeta.link) {
        window.open(productMeta.link, "_blank");
      }
    }
    setInputValue("");
  };

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        justifyContent: "start",
        paddingTop: "30vh",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#242424",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <ClickAwayListener onClickAway={handleClickAway}>
        <div>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              top: "50px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "250px",
              }}
            >
              <Lottie animationData={telescope} loop={true} />
            </Box>
          </Box>
          <Typography
            marginBottom={"50px"}
            fontFamily={"'Poppins', sans-serif"}
            fontSize={"24px"}
            fontWeight={"bold"}
            textAlign={"center"}
          >
            Where's that resource?
          </Typography>

          <TextField
            label="Start with a product..."
            variant="outlined"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            inputRef={inputRef}
            sx={{
              width: 500,
              input: { color: "#fff", paddingRight: "50px" },
              label: { color: "#fff" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#fff",
                },
                "&:hover fieldset": {
                  borderColor: "#fff",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#fff",
                },
              },
            }}
            InputProps={{
              endAdornment: specifierConfirmed && (
                <InputAdornment position="end">
                  <KeyboardReturn sx={{ color: "lightgrey" }} />
                </InputAdornment>
              ),
            }}
          />
          {specifierConfirmed && (
            <Box
              sx={{
                marginTop: "5px",
                marginLeft: "10px",
                fontSize: "12px",
                color: "lightgrey",
              }}
            >
              Press Enter to navigate
            </Box>
          )}
          <Popper
            open={showOptions}
            anchorEl={anchorEl}
            style={{
              zIndex: 1,
              width: anchorEl ? anchorEl.clientWidth : 500,
            }}
          >
            <Paper
              style={{ overflowY: "auto", maxHeight: "300px" }}
              id="options-list"
            >
              <List>
                {/* Show products if no product is selected */}
                {!selectedOptions.product &&
                  filteredOptions.map((option, index) => (
                    <ListItemButton
                      key={index}
                      selected={index === highlightedIndex}
                      onClick={() => handleOptionClick(option)}
                      id={`option-${index}`}
                      sx={{
                        paddingLeft: 2,
                      }}
                    >
                      {products[option]?.icon && (
                        <img
                          src={products[option].icon}
                          alt={`${option} icon`}
                          style={{ marginRight: 8, width: "16px" }}
                        />
                      )}
                      <ListItemButtonText primary={option} />
                    </ListItemButton>
                  ))}

                {/* Show resources if a product is selected but no resource is selected */}
                {selectedOptions.product && !selectedOptions.resource && (
                  <React.Fragment>
                    <ListItemButton
                      disabled={true}
                      sx={{
                        color: "inherit",
                        paddingLeft: 2,
                      }}
                    >
                      {products[selectedOptions.product]?.icon && (
                        <img
                          src={products[selectedOptions.product].icon}
                          alt={`${selectedOptions.product} icon`}
                          style={{ marginRight: 8, width: "16px" }}
                        />
                      )}
                      <ListItemButtonText primary={selectedOptions.product} />
                    </ListItemButton>
                    {filteredOptions.map((option, index) => (
                      <ListItemButton
                        key={index}
                        selected={index === highlightedIndex}
                        onClick={() => handleOptionClick(option)}
                        id={`option-${index}`}
                        sx={{
                          paddingLeft: 6,
                        }}
                      >
                        {resources[selectedOptions.product]?.find(
                          (r) => r.name === option
                        )?.icon && (
                          <img
                            src={
                              resources[selectedOptions.product].find(
                                (r) => r.name === option
                              ).icon
                            }
                            alt={`${option} icon`}
                            style={{ marginRight: 8, width: "16px" }}
                          />
                        )}
                        <ListItemButtonText primary={option} />
                      </ListItemButton>
                    ))}
                  </React.Fragment>
                )}

                {/* Show specifiers if both product and resource are selected */}
                {selectedOptions.product && selectedOptions.resource && (
                  <React.Fragment>
                    <ListItemButton
                      disabled={true}
                      sx={{
                        color: "inherit",
                        paddingLeft: 2,
                      }}
                    >
                      {products[selectedOptions.product]?.icon && (
                        <img
                          src={products[selectedOptions.product].icon}
                          alt={`${selectedOptions.product} icon`}
                          style={{ marginRight: 8, width: "16px" }}
                        />
                      )}
                      <ListItemButtonText primary={selectedOptions.product} />
                    </ListItemButton>
                    <ListItemButton
                      disabled={true}
                      sx={{
                        color: "inherit",
                        paddingLeft: 6,
                      }}
                    >
                      {resources[selectedOptions.product]?.find(
                        (r) => r.name === selectedOptions.resource
                      )?.icon && (
                        <img
                          src={
                            resources[selectedOptions.product].find(
                              (r) => r.name === selectedOptions.resource
                            ).icon
                          }
                          alt={`${selectedOptions.resource} icon`}
                          style={{ marginRight: 8, width: "16px" }}
                        />
                      )}
                      <ListItemButtonText primary={selectedOptions.resource} />
                    </ListItemButton>
                    {filteredOptions.map((option, index) => (
                      <ListItemButton
                        key={index}
                        selected={index === highlightedIndex}
                        onClick={() => handleOptionClick(option)}
                        id={`option-${index}`}
                        sx={{
                          paddingLeft: 10,
                        }}
                      >
                        <ListItemButtonText primary={option} />
                      </ListItemButton>
                    ))}
                  </React.Fragment>
                )}
              </List>
            </Paper>
          </Popper>
        </div>
      </ClickAwayListener>
    </Box>
  );
};

export default Search;
