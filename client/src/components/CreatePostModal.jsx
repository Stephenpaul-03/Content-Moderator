import React, { useState, useEffect } from "react";
import { PostService } from '../services/api';
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

function CreatePostModal({
  isOpen,
  onClose,
  selectedCategories,
  setSelectedCategories,
  handlePost,
}) {
  const [availableCategories] = useState([
    "Badge 1",
    "Badge 2",
    "Badge 3",
    "Badge 4",
    "Badge 5",
  ]);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const postData = {
        title: selectedCategories.join(', '), // Using categories as title
        description: document.getElementById("post-text").value,
        location: localStorage.getItem('selectedLocation') || 'Default Location',
        images: file ? [file] : [], // If it's an image
        videos: file && file.type.startsWith('video/') ? [file] : [] // If it's a video
      };

      await PostService.createPost(postData);
      onClose();
      // You might want to refresh the feed here
    } catch (err) {
      setError(err.message || 'Failed to create post');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCategories = (Category) => {
    if (selectedCategories.includes(Category)) {
      setSelectedCategories(
        selectedCategories.filter((item) => item !== Category)
      );
    } else {
      setSelectedCategories([...selectedCategories, Category]);
    }
  };

  const handleCategoryModalClose = () => {
    setIsCategoryModalOpen(false);
  };

  const handleCategoryModalOpen = () => {
    setIsCategoryModalOpen(true);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  return (
    <>
      <Modal
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        isCentered
      >
        <ModalOverlay />
        <ModalContent width="400px" minHeight="600px" maxHeight="90vh" overflow="auto" >
          <ModalHeader px={10}>Create New Content</ModalHeader>
          <ModalCloseButton />
          <Tabs size="md" variant='line' align='start'>
            <TabList px={10} gap={2}>
              <Tab>Posts</Tab>
              <Tab>Klips</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <ModalBody
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                  height="100%"
                >
                  {/* Custom file input */}
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
                    <Input
                      id="post-file"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      hidden
                    />
                    {file && <Box mt={2}>{file.name}</Box>}
                  </Box>

                  <Textarea
                    id="post-text"
                    placeholder="Here is a sample placeholder"
                    mb={4}
                    minHeight="100px"
                  />
                  <Box mb={4} marginTop="10px" marginBottom="10px">
                    {selectedCategories.map((category, index) => (
                      <Badge
                        key={index}
                        colorScheme="blue"
                        mr={2}
                        mb={2}
                        borderRadius="full"
                      >
                        {category}
                      </Badge>
                    ))}
                  </Box>
                  <Button onClick={handleCategoryModalOpen}>Category</Button>
                  <Spacer />
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={handlePost}>
                    Post
                  </Button>
                </ModalFooter>
              </TabPanel>

              <TabPanel>
                <ModalBody
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                  height="100%"
                >
                  {/* Custom file input */}
                  <Box
                    as="label"
                    htmlFor="post-file-video"
                    mb={4}
                    minHeight="400px"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    borderWidth={2}
                    borderColor="gray.300"
                    borderRadius="md"
                    _hover={{ borderColor: "gray.500" }}
                  >
                    <Button variant="outline">Choose Video</Button>
                    <Input
                      id="post-file-video"
                      type="file"
                      accept="video/*"
                      onChange={handleFileChange}
                      hidden
                    />
                    {file && <Box mt={2}>{file.name}</Box>}
                  </Box>

                  <Textarea
                    id="post-text"
                    placeholder="Here is a sample placeholder"
                    mb={4}
                  />
                  <Box mb={4} marginTop='10px' marginBottom='10px'>
                    {selectedCategories.map((badge, index) => (
                      <Badge
                        key={index}
                        colorScheme="blue"
                        mr={2}
                        mb={2}
                        borderRadius="full"
                      >
                        {badge}
                      </Badge>
                    ))}
                  </Box>
                  <Button onClick={handleCategoryModalOpen}>Category</Button>
                  <Spacer />
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={handlePost}>
                    Post
                  </Button>
                </ModalFooter>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalContent>
      </Modal>

      {/* Badge Selection Modal */}
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
                  variant={
                    selectedCategories.includes(badge) ? "solid" : "outline"
                  }
                  colorScheme="teal"
                  width="100%"
                >
                  {badge}
                </Button>
              ))}
            </VStack>
          </ModalBody>
          <ModalFooter>
            {error && <Text color="red.500">{error}</Text>}
            <Button 
              colorScheme="blue" 
              mr={3} 
              onClick={handleSubmit}
              isLoading={isLoading}
              loadingText="Posting..."
            >
              Post
            </Button>
          </ModalFooter>        
        </ModalContent>
      </Modal>
    </>
  );
}

export default CreatePostModal;
