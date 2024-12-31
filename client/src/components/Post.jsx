import React from "react";
import {
  Box,
  Button,
  Flex,
  Avatar,
  Heading,
  Text,
  Image,
  Divider,
  Center,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@chakra-ui/react";
import { Heart, Share2, Bookmark } from "lucide-react";

function Post({ post }) {
  return (
    <Center>
      <Card
        maxW="lg"
        key={post.id}
        marginBottom="10px"
        minW="680px"
        variant="filled"
      >
        <CardHeader>
          <Flex spacing="4">
            <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
              <Avatar name={post.name || "Unknown User"} src={post.avatar || ""} />
              <Box>
                <Heading size="sm">{post.name || "Anonymous"}</Heading>
                <Text>{post.role || "No Role"}</Text>
              </Box>
            </Flex>
            <Button variant="outline" colorScheme="gray" aria-label="Follow">
              Follow
            </Button>
          </Flex>
        </CardHeader>
        <Divider color="gray.300" />
        <CardBody>
          {/* Ensure post text is rendered properly */}
          <Text>{post.text || "No description provided."}</Text>
        </CardBody>
        {/* Conditionally render the image if available */}
        {post.image && (
          <Image
            px={2}
            paddingBottom={2}
            objectFit="cover"
            src={post.image}
            alt={post.altText || "Post Image"}
          />
        )}
        <Divider color="gray.300" />
        <CardFooter
          justify="space-between"
          flexWrap="wrap"
          sx={{
            "& > button": {
              minW: "136px",
            },
          }}
        >
          <Button flex="1" variant="ghost" leftIcon={<Heart />}>
            Like
          </Button>
          <Button flex="1" variant="ghost" leftIcon={<Share2 />}>
            Share
          </Button>
          <Button flex="1" variant="ghost" leftIcon={<Bookmark />}>
            Save
          </Button>
        </CardFooter>
      </Card>
    </Center>
  );
}

export default Post;
