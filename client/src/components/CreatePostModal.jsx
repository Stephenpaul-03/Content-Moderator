import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Spacer,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";

function CreatePostModal({ isOpen, onClose, handlePost, selectedCategories, setSelectedCategories }) {
  const [availableCategories] = useState([
    "Badge 1",
    "Badge 2",
    "Badge 3",
    "Badge 4",
    "Badge 5",
  ]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [name, setName] = useState('Your Name'); 
  const [role, setRole] = useState('Your Role'); 
  const [avatar, setAvatar] = useState(''); 
  console.log("handlePost in CreatePostModal:", handlePost);


  const toggleCategories = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(
        selectedCategories.filter((item) => item !== category)
      );
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleCategoryModalClose = () => {
    setIsCategoryModalOpen(false);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleSubmit = async () => {
    const postData = {
      id: Date.now(),
      name,
      role,
      avatar,
      text,
      image: file ? URL.createObjectURL(file) : "",
      categories: selectedCategories,
    };
  
    try {
      await handlePost(postData);
    } catch (error) {
      console.error("Error submitting post:", error);
    }
  };
  
  return (
    <>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent width="400px" minHeight="600px" maxHeight="90vh" overflow="auto">
          <ModalHeader px={10}>Create New Content</ModalHeader>
          <ModalCloseButton />
          <Tabs size="md" variant="line" align="start">
            <TabList px={10} gap={2}>
              <Tab>Posts</Tab>
              <Tab>Klips</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <ModalBody display="flex" flexDirection="column" justifyContent="space-between" height="100%">
                  <Box
                    as="label"
                    htmlFor="post-file"
                    mb={4}
                    minHeight="200px"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    borderWidth={2}
                    borderColor="gray.300"
                    borderRadius="md"
                    _hover={{ borderColor: "gray.500" }}
                  >
                    <Button variant="outline">Choose File</Button>
                    <Input id="post-file" type="file" accept="image/*" onChange={handleFileChange} hidden />
                    {file && <Box mt={2}>{file.name}</Box>}
                  </Box>

                  <Textarea
                    id="post-text"
                    placeholder="Write something..."
                    value={text}
                    onChange={handleTextChange}
                    mb={4}
                    minHeight="100px"
                  />

                  <Box mb={4} marginTop="10px" marginBottom="10px">
                    {selectedCategories.map((category, index) => (
                      <Badge key={index} colorScheme="blue" mr={2} mb={2} borderRadius="full">
                        {category}
                      </Badge>
                    ))}
                  </Box>

                  <Button onClick={() => setIsCategoryModalOpen(true)}>Category</Button>

                  <Spacer />
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                    Post
                  </Button>
                </ModalFooter>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalContent>
      </Modal>

      <Modal isOpen={isCategoryModalOpen} onClose={handleCategoryModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Category</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={3} align="stretch">
              {availableCategories.map((badge, index) => (
                <Button
                  key={index}
                  onClick={() => toggleCategories(badge)}
                  variant={selectedCategories.includes(badge) ? "solid" : "outline"}
                  colorScheme="teal"
                  width="100%"
                >
                  {badge}
                </Button>
              ))}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleCategoryModalClose}>
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default CreatePostModal;
