import React, { useState, useEffect } from "react";
import axios from "axios";
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
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  SimpleGrid,
} from "@chakra-ui/react";

import { House, Film, Tv, MonitorPlay, Bell, ChevronDown } from "lucide-react";

import ThemeSwitcher from "./themeswitcher";
import CreatePostModal from "./components/CreatePostModal";
import Post from "./components/Post";
import UserBox from "./components/UserBox";
import ImageCarousel from "./components/ImageCarousel";

function App() {
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("Locations");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/posts");
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

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

  const handlePost = async (newPost) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/posts",
        newPost,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const postResponse = response.data;
      console.log("Post submitted successfully:", postResponse);

      // Update the posts state
      setPosts((prevPosts) => [postResponse, ...prevPosts]); // Add the new post to the beginning
    } catch (error) {
      console.error("Error submitting post:", error);
    } finally {
      resetForm();
      onClose();
    }
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  return (
    <Flex minHeight="100vh" minWidth="100vw" direction="column" px={10}>
      <Box
        as="nav"
        width="100%"
        bg={colorMode === "light" ? "white" : "black"}
        color={colorMode === "light" ? "black" : "white"}
        p={4}
        maxHeight="80px"
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
              src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp"
            />
            <Divider
              orientation="vertical"
              height="40px"
              borderColor={colorMode === "light" ? "gray.300" : "gray.600"}
            />
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDown />}
                width="225px"
                textAlign="start"
              >
                {selectedLocation} {/* Display the selected location */}
              </MenuButton>
              <MenuList width="200px">
                <MenuItem onClick={() => handleLocationSelect("Anna Nagar")}>
                  Anna Nagar
                </MenuItem>
                <MenuItem onClick={() => handleLocationSelect("T Nagar")}>
                  T Nagar
                </MenuItem>
                <MenuItem onClick={() => handleLocationSelect("Avadi")}>
                  Avadi
                </MenuItem>
                <MenuItem onClick={() => handleLocationSelect("Chengalpattu")}>
                  Chengalpattu
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
          <Center flex="1">
            <HStack spacing={10}>
              <Button
                variant="link"
                color={colorMode === "light" ? "black" : "light"}
                _hover={{ color: "red.600" }}
                _active={{ color: "red.700" }}
              >
                <VStack spacing={2}>
                  <House />
                  <Text fontSize="sm">Home</Text>
                </VStack>
              </Button>
              <Button
                variant="link"
                color={colorMode === "light" ? "black" : "light"}
                _hover={{ color: "red.600" }}
                _active={{ color: "red.700" }}
              >
                <VStack spacing={1}>
                  <Tv />
                  <Text fontSize="sm">Live</Text>
                </VStack>
              </Button>
              <Button
                variant="link"
                color={colorMode === "light" ? "black" : "light"}
                _hover={{ color: "red.600" }}
                _active={{ color: "red.700" }}
              >
                <VStack spacing={1}>
                  <Film />
                  <Text fontSize="sm">Videos</Text>
                </VStack>
              </Button>
              <Button
                variant="link"
                outline="none"
                color={colorMode === "light" ? "black" : "light"}
                _hover={{ color: "red.600" }}
                _active={{ color: "red.700" }}
              >
                <VStack spacing={1}>
                  <MonitorPlay />
                  <Text fontSize="sm">Klips</Text>
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
                <Bell />
              </PopoverTrigger>
              <PopoverContent width="200px" marginTop={6}>
                <PopoverArrow />
                <ThemeSwitcher />
                <Divider py={1} />
                <PopoverBody>
                  <Button width="100%" variant="ghost" size="md">
                    About KYN
                  </Button>
                </PopoverBody>
                <PopoverBody>
                  <Button width="100%" variant="ghost" size="md">
                    Privacy Policy
                  </Button>
                </PopoverBody>
                <PopoverBody>
                  <Button width="100%" variant="ghost" size="md">
                    Terms and Conditions
                  </Button>
                </PopoverBody>
                <PopoverBody>
                  <Button width="100%" variant="ghost" size="md">
                    Community Guidelines
                  </Button>
                </PopoverBody>
                <PopoverBody>
                  <Button width="100%" variant="ghost" size="md">
                    Grievance
                  </Button>
                </PopoverBody>
                <PopoverBody>
                  <Button width="100%" variant="ghost" size="md">
                    List your Event
                  </Button>
                </PopoverBody>
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
                  src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp"
                />
              </PopoverTrigger>
              <PopoverContent width="200px" marginTop={6}>
                <PopoverArrow />
                <PopoverBody>
                  <Button width="100%" variant="ghost" size="md">
                    Profile
                  </Button>
                </PopoverBody>
                <Divider />
                <PopoverBody>
                  <Button
                    width="100%"
                    variant="ghost"
                    size="md"
                    color="red.300"
                  >
                    Log Out
                  </Button>
                </PopoverBody>
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
        handlePost={handlePost} // Ensure this is passed
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
          <Box maxWidth="350px" bg="#fff">
            <UserBox />
          </Box>
          <Box maxWidth="700px" bg="#fff">
            <ImageCarousel />
            <Divider marginTop={2} marginBottom={2} />
            {posts.map((post) => (
              <Post key={post.id} post={post} />
            ))}
          </Box>
          <Box maxWidth="400px" bg="#fff"></Box>
        </SimpleGrid>
      </Box>
    </Flex>
  );
}

export default App;
