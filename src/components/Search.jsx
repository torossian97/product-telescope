import React, { useState, useEffect, useRef } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import InputAdornment from "@mui/material/InputAdornment";
import { KeyboardReturn } from "@mui/icons-material";
import { products } from "../data/products";
import { resources } from "../data/resources";

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
        (p) => inputWords[0].toLowerCase() === p.name.toLowerCase()
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
      }
    }
    // 1 word
    else if (inputWords.length === 1) {
      setSelectedOptions({ product: "", resource: "", specifier: "" });
    }

    // 2 words + space
    if (inputWords.length === 2 && inputValue.endsWith(" ")) {
      const matchedResource = resources[selectedOptions.product]?.find(
        (r) => inputWords[1].toLowerCase() === r.name.toLowerCase()
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
        (r) => r.name === selectedOptions.resource
      );
      const matchedSpecifier = resourceData?.specifiers?.find(
        (s) =>
          inputWords.slice(2).join(" ").toLowerCase() ===
          s.identifier.toLowerCase()
      );
      if (matchedSpecifier) {
        setSelectedOptions((prev) => ({
          ...prev,
          specifier: matchedSpecifier.identifier,
        }));
        setShowOptions(false);
        navigateToLink(
          selectedOptions.product,
          selectedOptions.resource,
          matchedSpecifier.identifier
        );
      } else {
        setSelectedOptions((prev) => ({ ...prev, specifier: "" }));
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
      const resourceData = resources[product].find((r) => r.name === resource);
      if (resourceData && resourceData.specifiers) {
        const specifierSearchValue = inputValue
          .substring(inputValue.indexOf(resource) + resource.length)
          .trim()
          .toLowerCase();
        console.log(specifierSearchValue);
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
    setShowOptions(newFilteredOptions.length > 0);
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

    if (!product) {
      setInputValue(option + " ");
    } else if (product && !resource) {
      setInputValue(product + " " + option + " ");
      const resourceData = resources[product].find((r) => r.name === option);
      if (resourceData && resourceData && resourceData.link) {
        setSpecifierConfirmed(true);
      }
    } else if (product && resource) {
      setInputValue(product + " " + resource + " " + option + " ");
      setShowOptions(false);

      setSpecifierConfirmed(true);
    }

    inputRef.current.focus();
    updateOptions(); // Ensure options are updated after clicking
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      setHighlightedIndex(
        (prevIndex) => (prevIndex + 1) % filteredOptions.length
      );
    } else if (event.key === "ArrowUp") {
      setHighlightedIndex(
        (prevIndex) =>
          (prevIndex - 1 + filteredOptions.length) % filteredOptions.length
      );
    } else if (event.key === "Enter") {
      const option = filteredOptions[highlightedIndex];
      if (specifierConfirmed) {
        navigateToLink(
          selectedOptions.product,
          selectedOptions.resource,
          option
        );
      } else {
        handleOptionClick(option);
        //setSpecifierConfirmed(true);
      }
      setHighlightedIndex(0);
    }
  };

  const handleClickAway = () => {
    setShowOptions(false);
  };

  const navigateToLink = (product, resource, specifier) => {
    const resourceData = resources[product].find((r) => r.name === resource);
    const specifierData = resourceData?.specifiers?.find(
      (s) => s.identifier === specifier
    );

    if (specifierData && specifierData.metadata?.link) {
      window.location.href = specifierData.metadata.link;
    } else if (resourceData && resourceData.metadata?.link) {
      window.location.href = resourceData.metadata.link;
    } else {
      const productMeta = products[product]?.metadata;
      if (productMeta && productMeta.link) {
        window.location.href = productMeta.link;
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#242424",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <ClickAwayListener onClickAway={handleClickAway}>
        <div>
          <TextField
            label="Search"
            variant="outlined"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            inputRef={inputRef}
            sx={{
              width: 500,
              input: { color: "#fff" },
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
                position: "absolute",
                right: 10,
                top: 55,
                color: "lightgrey",
              }}
            >
              Press Enter to navigate
            </Box>
          )}
          <Popper
            open={showOptions}
            anchorEl={anchorEl}
            style={{ zIndex: 1, width: 500 }}
          >
            <Paper>
              <List>
                {filteredOptions.map((option, index) => {
                  // Determine if this option is a product or resource and get the corresponding icon
                  let icon = "";
                  if (products[option]) {
                    icon = products[option].icon;
                  } else {
                    Object.keys(resources).forEach((product) => {
                      const resource = resources[product].find(
                        (r) => r.name === option
                      );
                      if (resource) {
                        icon = resource.icon;
                      }
                    });
                  }

                  return (
                    <ListItem
                      button={!option.level}
                      key={index}
                      selected={index === highlightedIndex && !option.level}
                      onClick={() => !option.level && handleOptionClick(option)}
                      sx={{
                        color: option.level ? "grey" : "inherit",
                        pointerEvents: option.level ? "none" : "auto",
                        paddingLeft: option.level * 16,
                      }}
                    >
                      {icon && (
                        <img
                          src={icon}
                          alt={`${option} icon`}
                          style={{ marginRight: 8, width: "16px" }}
                        />
                      )}
                      <ListItemText primary={option} />
                    </ListItem>
                  );
                })}
              </List>
            </Paper>
          </Popper>
        </div>
      </ClickAwayListener>
    </Box>
  );
};

export default Search;
