import { PostService } from '../services/api';
import React, { useState, useEffect } from "react";
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
import { Heart, Share2, Bookmark } from 'lucide-react';

function Post() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await PostService.getFeed();
      setPosts(response.posts);
    } catch (err) {
      setError(err.message || 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await PostService.likePost(postId);
      fetchPosts(); // Refresh posts or update the specific post's like count
    } catch (err) {
      console.error('Failed to like post:', err);
    }
  };

  if (loading) return <Center>Loading...</Center>;
  if (error) return <Text color="red.500">{error}</Text>;

  return (
    <div>
      {posts.map((post) => (
        <Card
          key={post.id}
          maxW="lg"
          marginBottom="10px"
          minW="680px"
          variant="filled"
        >
          <CardHeader>
            <Flex spacing="4">
              <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                <Avatar name={post.userName} src={post.profilePicture} />
                <Box>
                  <Heading size="sm">{post.userName}</Heading>
                  <Text>{post.location}</Text>
                </Box>
              </Flex>
            </Flex>
          </CardHeader>
          <CardBody>
            <Text>{post.description}</Text>
          </CardBody>
          {post.image && (
            <Image
              px={2}
              paddingBottom={2}
              objectFit="cover"
              src={post.image} // Use the base64 string from the backend
              alt="Post image"
            />
          )}
          <CardFooter
            justify="space-between"
            flexWrap="wrap"
            sx={{
              "& > button": {
                minW: "136px",
              },
            }}
          >
            <Button
              flex="1"
              variant="ghost"
              leftIcon={<Heart />}
              onClick={() => handleLike(post.id)}
            >
              Like ({post.likes})
            </Button>
            <Button flex="1" variant="ghost" leftIcon={<Share2 />}>
              Share
            </Button>
            <Button flex="1" variant="ghost" leftIcon={<Bookmark />}>
              Save
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export default Post;
