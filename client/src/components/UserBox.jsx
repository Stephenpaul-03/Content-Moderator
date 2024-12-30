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
  AvatarGroup,
} from "@chakra-ui/react";
import { PhoneIcon } from "@chakra-ui/icons";
import { Card, CardHeader, CardBody, CardFooter } from "@chakra-ui/react";

// Post component
function UserBox({ post }) {
  console.log(post); // Log post data to check if it exists

  // Check if post exists and contains the necessary data
  if (!post || !post.avatars || !post.exclusiveTitle || !post.imageUrl || !post.productName) {
    return <Text>No post data available</Text>;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <Heading size="md">Follow your KYNs</Heading>
        </CardHeader>

        <CardBody>
          <AvatarGroup size="md" max={3} alignSelf='center'>
            {post.avatars.map((avatar, index) => (
              <Avatar key={index} name={avatar.name} src={avatar.src} />
            ))}
          </AvatarGroup>
        </CardBody>
      </Card>
      <Divider />
      <Card marginTop='20px'>
        <CardHeader>
          <Heading size="md">{post.exclusiveTitle}</Heading>
        </CardHeader>
        <CardBody>
          <Card maxW="sm">
            <CardBody>
              <Image
                src={post.imageUrl}
                alt={post.imageAlt}
                borderRadius="lg"
              />
              <Heading size="md">{post.productName}</Heading>
            </CardBody>
          </Card>
        </CardBody>
      </Card>
    </>
  );
}

// Main App component
function App() {
  // Define posts array
  const posts = [
    {
      id: 1,
      avatars: [
        { name: "Ryan Florence", src: "https://bit.ly/ryan-florence" },
        { name: "Segun Adebayo", src: "https://bit.ly/sage-adebayo" },
        { name: "Kent Dodds", src: "https://bit.ly/kent-c-dodds" },
        { name: "Prosper Otemuyiwa", src: "https://bit.ly/prosper-baba" },
        { name: "Christian Nwamba", src: "https://bit.ly/code-beast" },
      ],
      exclusiveTitle: "Exclusives",
      imageUrl:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
      imageAlt: "Green double couch with wooden legs",
      productName: "Living room Sofa",
    },
  ];

  return (
    <div>
      {posts.map((post) => (
        <UserBox key={post.id} post={post} /> // Make sure to pass the correct prop 'post'
      ))}
    </div>
  );
}

export default App;
