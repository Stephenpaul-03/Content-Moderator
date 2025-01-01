import React, { useState, useEffect, useRef } from "react";
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
  Image,
  Text,
  useToast
} from "@chakra-ui/react";

function CreatePostModal({
  isOpen,
  onClose,
  selectedCategories,
  setSelectedCategories,
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
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ws, setWs] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const toast = useToast();
  const wsRef = useRef(null);
  const fileInputRef = useRef(null);
  const [title, setTitle] = useState('');


  const toggleCategories = (badge) => {
    setSelectedCategories((prev) =>
      prev.includes(badge)
        ? prev.filter((cat) => cat !== badge)
        : [...prev, badge]
    );
  };

  // WebSocket setup remains the same...
  useEffect(() => {
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 3;
    
    const connectWebSocket = () => {
      if (isConnecting) return;
      
      setIsConnecting(true);
      const websocket = new WebSocket('ws://localhost:8080');
      wsRef.current = websocket;

      websocket.onopen = () => {
        setWs(websocket);
        setIsConnecting(false);
        reconnectAttempts = 0;
      };

      websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnecting(false);
      };

      websocket.onclose = () => {
        setWs(null);
        setIsConnecting(false);

        if (reconnectAttempts < maxReconnectAttempts) {
          reconnectAttempts++;
          setTimeout(connectWebSocket, 2000 * reconnectAttempts);
        } else {
          toast({
            title: "Connection Error",
            description: "Could not connect to moderation service. Please try again later.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      };
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [toast]);

  const moderateContent = async (description, imageFile) => {
    return new Promise((resolve, reject) => {
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        reject(new Error("Moderation service is not connected"));
        return;
      }

      const timeoutId = setTimeout(() => {
        reject(new Error("Moderation request timed out"));
      }, 30000);

      ws.onmessage = (event) => {
        clearTimeout(timeoutId);
        try {
          const response = JSON.parse(event.data);
          console.log("WebSocket response:", response);
          
          if (response.type === 'ERROR') {
            reject(new Error(response.error));
          } else if (response.type === 'MODERATION_RESULT') {
            resolve(response.data);
          }
        } catch (error) {
          reject(new Error("Invalid response from moderation service"));
        }
      };

      // Convert image file to base64
      if (imageFile) {
        const reader = new FileReader();
        reader.onloadend = () => {
          try {
            const base64Data = reader.result;
            
            // Validate base64 data
            if (!base64Data || typeof base64Data !== 'string') {
              reject(new Error("Invalid image data"));
              return;
            }

            // Send the data through WebSocket
            ws.send(JSON.stringify({
              type: 'MODERATE_CONTENT',
              data: {
                text: description || '',
                image: base64Data
              }
            }));
          } catch (error) {
            reject(new Error("Failed to process image"));
          }
        };

        reader.onerror = () => {
          reject(new Error("Failed to read image file"));
        };

        reader.readAsDataURL(imageFile);
      } else {
        reject(new Error("No image file provided"));
      }
    });
  };

  const handleSubmit = async () => {
  try {
    setIsLoading(true);
    setError(null);

    const description = document.getElementById("post-text").value;
    
    // Validate inputs
    if (!title.trim()) {
      throw new Error("Please enter a title for your post");
    }

    if (!description.trim()) {
      throw new Error("Please add some text to your post");
    }

    if (!file) {
      throw new Error("Please select an image for your post");
    }

    // Step 1: Moderate content
    const moderationResult = await moderateContent(description, file);
    
    if (!moderationResult || typeof moderationResult !== 'object') {
      throw new Error("Invalid moderation result received");
    }

    const { textTag, imageTag } = moderationResult;
    
    if (textTag !== 'OK' || imageTag !== 'OK') {
      const contentType = textTag !== 'OK' ? 'Text' : 'Image';
      const tag = textTag !== 'OK' ? textTag : imageTag;
      throw new Error(`${contentType} contains inappropriate content (${tag}). Cannot post.`);
    }

    // Step 2: Create FormData with only the required fields
    const formData = new FormData();
    formData.append('title', title);
    formData.append('image', file);
    formData.append('description', description);
    formData.append('location', 'default');  // Add default location

    // Remove categories as it's not supported by the API
    // formData.append('categories', JSON.stringify(selectedCategories));

    // Step 3: Create the post
    const response = await PostService.createPost(formData);
    
    toast({
      title: "Success",
      description: "Post created successfully!",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    
    // Reset form
    setTitle('');
    document.getElementById("post-text").value = '';
    setFile(null);
    setPreview(null);
    setSelectedCategories([]);
    
    onClose();
    
    if (typeof onPostCreated === 'function') {
      onPostCreated(response);
    }

  } catch (err) {
    console.error('Submit handler error:', err);
    toast({
      title: "Error",
      description: err.message || "An unexpected error occurred",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
};  
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
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
        <ModalContent width="400px" minHeight="600px" maxHeight="90vh" overflow="auto">
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
                  <Input
                    id="post-title"
                    placeholder="Enter post title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    mb={4}
                  />
                  <Box
                    as="label"
                    htmlFor="post-file"
                    mb={4}
                    minHeight="200px"
                    display="flex"
                    flexDirection="column"
                    gap={4}
                    justifyContent="center"
                    alignItems="center"
                    borderWidth={2}
                    borderStyle="dashed"
                    borderColor="gray.300"
                    borderRadius="md"
                    cursor="pointer"
                    _hover={{ borderColor: "gray.500" }}
                  >
                    {preview ? (
                      <Image src={preview} alt="Preview" maxHeight="180px" objectFit="contain" />
                    ) : (
                      <Button variant="outline">Choose File</Button>
                    )}
                    <Input
                      id="post-file"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      hidden
                    />
                  </Box>
                  <Textarea
                    id="post-text"
                    placeholder="Write your post content here..."
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
                  <Button onClick={() => setIsCategoryModalOpen(true)}>Category</Button>
                  <Spacer />
                </ModalBody>
                <ModalFooter>
                  <Button 
                    colorScheme="blue" 
                    mr={3} 
                    onClick={handleSubmit}
                    isLoading={isLoading}
                    loadingText="Posting..."
                    isDisabled={!ws || ws.readyState !== WebSocket.OPEN}
                  >
                    Post
                  </Button>
                </ModalFooter>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalContent>
      </Modal>

      <Modal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)}>
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
            {error && <Text color="red.500">{error}</Text>}
            <Button onClick={() => setIsCategoryModalOpen(false)}>
              Done
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default CreatePostModal;
