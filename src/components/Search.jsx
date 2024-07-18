import React, { useState, useEffect, useRef } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { products } from "../data/products";
import { resources } from "../data/resources";

const Search = () => {
  const [inputValue, setInputValue] = useState("");
  const [selectedOptions, setSelectedOptions] = useState({
    product: "",
    resource: "",
    subresource: "",
  });
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    updateOptions();
  }, [selectedOptions, inputValue]);

  useEffect(() => {
    setAnchorEl(inputRef.current);
    setShowOptions(false);
  }, []);

  const updateOptions = () => {
    const { product, resource } = selectedOptions;
    let newFilteredOptions = [];

    if (!product || inputValue.startsWith(product.toLowerCase()) === false) {
      newFilteredOptions = products
        .filter((p) =>
          p.name.toLowerCase().startsWith(inputValue.toLowerCase())
        )
        .map((p) => p.name);
    } else if (product && !resource) {
      if (resources[product]) {
        const productLength = product.length;
        const remainingInput = inputValue
          .slice(productLength)
          .trim()
          .toLowerCase();
        newFilteredOptions = resources[product]
          .filter((r) => r.name.toLowerCase().startsWith(remainingInput))
          .map((r) => r.name);
      }
    } else if (product && resource) {
      const resourceData = resources[product].find((r) => r.name === resource);
      if (resourceData) {
        const productLength = product.length;
        const resourceLength = resource.length;
        const remainingInput = inputValue
          .slice(productLength + resourceLength)
          .trim()
          .toLowerCase();
        newFilteredOptions = resources[product]
          .filter(
            (r) =>
              r.type === resourceData.type &&
              r.name.toLowerCase().startsWith(remainingInput)
          )
          .map((r) => r.name);
      }
    }

    setFilteredOptions(newFilteredOptions);
    setShowOptions(newFilteredOptions.length > 0);
  };

  const handleInputChange = (event) => {
    const newInputValue = event.target.value;
    setInputValue(newInputValue);
    setAnchorEl(event.currentTarget);

    const { product, resource } = selectedOptions;

    // Determine the new selected product, resource, or subresource based on input value
    if (!product) {
      const matchedProduct = products.find((p) =>
        newInputValue.toLowerCase().startsWith(p.name.toLowerCase())
      );
      if (matchedProduct) {
        setSelectedOptions({
          product: matchedProduct.name,
          resource: "",
          subresource: "",
        });
      }
    } else if (product && !resource) {
      const productLength = product.length;
      const remainingInput = newInputValue
        .slice(productLength)
        .trim()
        .toLowerCase();
      const matchedResource = resources[product]?.find((r) =>
        remainingInput.startsWith(r.name.toLowerCase())
      );
      if (matchedResource) {
        setSelectedOptions((prev) => ({
          ...prev,
          resource: matchedResource.name,
          subresource: "",
        }));
      }
    } else if (product && resource) {
      const productLength = product.length;
      const resourceLength = resource.length;
      const remainingInput = newInputValue
        .slice(productLength + resourceLength)
        .trim()
        .toLowerCase();
      const resourceData = resources[product].find((r) => r.name === resource);
      const matchedSubresource = resourceData?.subresources?.find((sr) =>
        remainingInput.startsWith(sr.name.toLowerCase())
      );
      if (matchedSubresource) {
        setSelectedOptions((prev) => ({
          ...prev,
          subresource: matchedSubresource.name,
        }));
        setShowOptions(false);
        //navigateToLink(product, resource, matchedSubresource.name);
      }
    }

    updateOptions();
    setShowOptions(true);
  };

  const handleOptionClick = (option) => {
    const { product, resource } = selectedOptions;

    if (!product) {
      setSelectedOptions({ product: option, resource: "", subresource: "" });
      setInputValue(option + " ");
    } else if (product && !resource) {
      setSelectedOptions({ ...selectedOptions, resource: option });
      setInputValue(product + " " + option + " ");
    } else if (product && resource) {
      setSelectedOptions({ ...selectedOptions, subresource: option });
      setInputValue(product + " " + resource + " " + option + " ");
      setShowOptions(false); // Hide options after selecting the subresource
      // Navigate to the final link
      navigateToLink(product, resource, option);
    }

    inputRef.current.focus();
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
      handleOptionClick(filteredOptions[highlightedIndex]);
      setHighlightedIndex(0);
    }
  };

  const handleClickAway = () => {
    setShowOptions(false);
  };

  const handleFocus = () => {
    updateOptions();
    setShowOptions(true);
  };

  const navigateToLink = (product, resource, subresource) => {
    const resourceData = resources[product].find((r) => r.name === resource);
    const productMeta = products.find((p) => p.name === product).metadata;
    const subresourceData = resourceData?.subresources?.find(
      (sr) => sr.name === subresource
    );

    if (subresourceData && subresourceData.metadata?.link) {
      window.location.href = subresourceData.metadata.link;
    } else if (resourceData && resourceData.metadata?.link) {
      window.location.href = resourceData.metadata.link;
    } else if (productMeta && productMeta.link) {
      window.location.href = productMeta.link;
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
      }}
    >
      <ClickAwayListener onClickAway={handleClickAway}>
        <div>
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
          />
          <Popper
            open={showOptions}
            anchorEl={anchorEl}
            style={{ zIndex: 1, width: 500 }}
          >
            <Paper>
              <List>
                {filteredOptions.map((option, index) => (
                  <ListItem
                    button
                    key={index}
                    selected={index === highlightedIndex}
                    onClick={() => handleOptionClick(option)}
                  >
                    <ListItemText primary={option} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Popper>
        </div>
      </ClickAwayListener>
    </Box>
  );
};

export default Search;
