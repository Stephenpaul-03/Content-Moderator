import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Avatar,
  Heading,
  IconButton,
  Text,
  Image,
  Divider,
  Center,
} from "@chakra-ui/react";
import { PhoneIcon } from "@chakra-ui/icons";
import { Card, CardHeader, CardBody, CardFooter } from "@chakra-ui/react";

function Post({ post }) {
  return (
    <Center>
    <Card maxW="lg" key={post.id} marginBottom='10px' minW="650px">
      <CardHeader>
        <Flex spacing="4">
          <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
            <Avatar name={post.name} src={post.avatar} />
            <Box>
              <Heading size="sm">{post.name}</Heading>
              <Text>{post.role}</Text>
            </Box>
          </Flex>
          <IconButton
            variant="ghost"
            colorScheme="gray"
            aria-label="See menu"
            icon={<PhoneIcon />}
          />
        </Flex>
      </CardHeader>
      <Divider />
      <CardBody>
        <Text>{post.text}</Text>
      </CardBody>
      <Image objectFit="cover" src={post.image} alt={post.altText} />
      <Divider />
      <CardFooter
        justify="space-between"
        flexWrap="wrap"
        sx={{
          "& > button": {
            minW: "136px",
          },
        }}
      >
        <Button flex="1" variant="ghost" leftIcon={<PhoneIcon />}>
          Like
        </Button>
        <Button flex="1" variant="ghost" leftIcon={<PhoneIcon />}>
          Comment
        </Button>
        <Button flex="1" variant="ghost" leftIcon={<PhoneIcon />}>
          Share
        </Button>
      </CardFooter>
    </Card>
    </Center>
  );
}

// Main App component
function App() {
  // Example array of posts
  const posts = [
    {
      id: 1,
      name: "Segun Adebayo",
      role: "Creator, Chakra UI",
      avatar: "https://bit.ly/sage-adebayo",
      text: "With Chakra UI, I wanted to sync the speed of development with the speed of design. I wanted the developer to be just as excited as the designer to create a screen.",
      image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
      altText: "Chakra UI",
    },
    {
      id: 2,
      name: "John Doe",
      role: "Frontend Developer",
      avatar: "https://bit.ly/dan-abramov",
      text: "React is such a powerful tool for building modern web apps. It's easy to learn and highly efficient!",
      image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
      altText: "React JS",
    },
    // Add more posts as needed
  ];

  return (
    <div>
      {posts.map((post) => (
        <Post key={post.id} post={post} /> 
      ))}
    </div>
  );
}

export default App;