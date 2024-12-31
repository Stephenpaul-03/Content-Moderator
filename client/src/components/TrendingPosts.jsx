import React from "react";
import {
  Avatar,
  Heading,
  Text,
  Image,
  Divider,
  Center,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Stack,
  Button,
  VStack,
} from "@chakra-ui/react";

function TrendingCard({ post }) {
  if (!post || !post.title || !post.imageUrl || !post.description) {
    return <Text>No post data available</Text>;
  }

  return (
    <Card
      direction={{ base: "column", sm: "row" }}
      overflow="hidden"
      variant="outline"
      marginBottom="20px"
      height="100px"
    >
      <Image
        objectFit="cover"
        maxW={{ base: "100%", sm: "50px" }}
        src={post.imageUrl}
        alt={post.imageAlt}
      />

      <Stack>
        <CardBody alignContent='center'>
          <Heading size="s">{post.title}</Heading>
          <Text size="xs">{post.description}</Text>
        </CardBody>
        <CardFooter></CardFooter>
      </Stack>
    </Card>
  );
}

function TrendingPosts() {
  const trendingPosts = [
    {
      id: 1,
      title: "The perfect",
      description: "Caffè latte is a coffee",
      imageUrl:
        "https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60",
      imageAlt: "Caffe Latte",
    },
    {
      id: 2,
      title: "The perfect",
      description: "Caffè latte is a coffee",
      imageUrl:
        "https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60",
      imageAlt: "Caffe Latte",
    },
    {
      id: 3,
      title: "The perfect ",
      description: "Caffè latte is a coffee",
      imageUrl:
        "https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60",
      imageAlt: "Caffe Latte",
    },
    {
      id: 4,
      title: "The perfect ",
      description: "Caffè latte is a coffee",
      imageUrl:
        "https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60",
      imageAlt: "Caffe Latte",
    },
  ];

  return (
    <div>
      <Card
        variant="filled"
        padding="20px"
        borderColor="gray.300"
        marginBottom="20px"
      >
        <Heading size="md" textAlign="center" marginBottom="20px">
          Trending Posts
        </Heading>
        <Divider color="gray.300" marginBottom="20px" />
        {trendingPosts.map((post) => (
          <TrendingCard key={post.id} post={post} />
        ))}
      </Card>
    </div>
  );
}

export default TrendingPosts;
