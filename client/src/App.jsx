import React, { useState } from "react";
import {
  Box,
  Flex,
  Button,
  useColorMode,
  useDisclosure,
  HStack,
  Divider,
  Avatar,
  Center,
  Text,
  VStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  SimpleGrid,
} from "@chakra-ui/react";
import {
  PhoneIcon,
  AddIcon,
  WarningIcon,
  UnlockIcon,
  ChevronDownIcon,
} from "@chakra-ui/icons";
import ThemeSwitcher from "./themeswitcher";
import CreatePostModal from "./components/CreatePostModal";
import Post from "./components/Post";
import UserBox from "./components/UserBox";

function App() {
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const resetForm = () => {
    setSelectedOptions([]);
    setSelectedCategories([]);
  };

  const handleModalCloseWithPrompt = () => {
    if (selectedOptions.length > 0 || selectedCategories.length > 0) {
      const confirmClose = window.confirm(
        "You have unsaved changes. Are you sure you want to discard them?"
      );
      if (confirmClose) {
        resetForm();
        onClose();
      }
    } else {
      onClose();
    }
  };

  const handlePost = () => {
    const postData = {
      selectedCategory: selectedCategories,
      selectedOptions: selectedOptions,
      postContent: {
        text: document.getElementById("post-text").value,
        file: document.getElementById("post-file").files[0],
      },
    };

    console.log("Post Data: ", JSON.stringify(postData, null, 2));

    resetForm();
    onClose();
  };

  return (
    <Flex minHeight="100vh" minWidth="100vw" direction="column" px={10}>
      <Box
        as="nav"
        width="100%"
        bg={colorMode === "light" ? "white" : "black"}
        color={colorMode === "light" ? "black" : "white"}
        p={4}
        position="fixed"
        top="0"
        left="0"
        zIndex="1000"
      >
        <Flex align="center" justify="space-between" px={20}>
          <HStack spacing={4} align="center">
            <Avatar
              size="sm"
              name="Dan Abrahmov"
              src="https://bit.ly/dan-abramov"
            />
            <Divider
              orientation="vertical"
              height="40px"
              borderColor={colorMode === "light" ? "gray.300" : "gray.600"}
            />
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                width="225px"
                textAlign="start"
              >
                Locations
              </MenuButton>
              <MenuList width="200px">
                <MenuItem>Anna Nagar</MenuItem>
                <MenuItem>T Nagar</MenuItem>
                <MenuItem>Avadi</MenuItem>
                <MenuItem>Chengalpattu</MenuItem>
              </MenuList>
            </Menu>
          </HStack>
          <Center flex="1">
            <HStack spacing={10}>
              <Button
                variant="link"
                color={colorMode === "light" ? "black" : "white"}
              >
                <VStack spacing={2}>
                  <PhoneIcon />
                  <Text fontSize="sm">Call</Text>
                </VStack>
              </Button>
              <Button
                variant="link"
                color={colorMode === "light" ? "black" : "white"}
              >
                <VStack spacing={1}>
                  <AddIcon />
                  <Text fontSize="sm">Add</Text>
                </VStack>
              </Button>
              <Button
                variant="link"
                color={colorMode === "light" ? "black" : "white"}
              >
                <VStack spacing={1}>
                  <WarningIcon />
                  <Text fontSize="sm">Warn</Text>
                </VStack>
              </Button>
              <Button
                variant="link"
                color={colorMode === "light" ? "black" : "white"}
              >
                <VStack spacing={1}>
                  <UnlockIcon /> <Text fontSize="sm">Unlock</Text>
                </VStack>
              </Button>
            </HStack>
          </Center>
          <HStack spacing={4} align="center">
            <Button onClick={onOpen}>Create New</Button>
            <Divider
              orientation="vertical"
              height="40px"
              borderColor={colorMode === "light" ? "gray.300" : "gray.600"}
            />
            <Popover>
              <PopoverTrigger>
                <PhoneIcon />
              </PopoverTrigger>
              <PopoverContent width="200px">
                <PopoverArrow />
                <ThemeSwitcher />
              </PopoverContent>
            </Popover>
            <Divider
              orientation="vertical"
              height="40px"
              borderColor={colorMode === "light" ? "gray.300" : "gray.600"}
            />
            <Popover>
              <PopoverTrigger>
                <Avatar
                  size="sm"
                  name="Dan Abrahmov"
                  src="https://bit.ly/dan-abramov"
                />
              </PopoverTrigger>
              <PopoverContent width="200px">
                <PopoverArrow />
                <PopoverBody>Avatar Options Here</PopoverBody>
              </PopoverContent>
            </Popover>
          </HStack>
        </Flex>
      </Box>

      <CreatePostModal
        isOpen={isOpen}
        onClose={handleModalCloseWithPrompt}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        handlePost={handlePost}
      />

      {/* Main content goes here */}
      <Box
        as="main"
        flex="1"
        minWidth="0"
        p={10}
        display="flex"
        justifyContent="center"
        alignItems="center"
        overflow="hidden"
        marginTop="50px"
      >
        <SimpleGrid
          spacing={10}
          margin="0"
          width="100%"
          style={{ gridTemplateColumns: "1fr 2fr 1fr" }} 
        >
          <Box maxWidth="400px">
            <UserBox />
          </Box>
          <Box maxWidth='800px'>
            <Post />
          </Box>
          <Box maxWidth="400px">
            <UserBox/>
          </Box>
        </SimpleGrid>
      </Box>
    </Flex>
  );
}

export default App;
