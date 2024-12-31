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
      // Refresh posts or update the specific post's like count
      fetchPosts();
    } catch (err) {
      console.error('Failed to like post:', err);
    }
  };

  // if (loading) return <Center><Spinner /></Center>;
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
          {post.images && post.images.length > 0 && (
            <Image
              px={2}
              paddingBottom={2}
              objectFit="cover"
              src={post.images[0]}
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
              leftIcon={<Heart/>}
              onClick={() => handleLike(post.id)}
            >
              Like ({post.likes})
            </Button>
            <Button flex="1" variant="ghost" leftIcon={<Share2 />}>
              Share
            </Button>
            <Button flex="1" variant="ghost" leftIcon={<Bookmark/>}>
              Save
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export default Post;

//
// function App() {
//   const posts = [
//     {
//       id: 1,
//       name: "Segun Adebayo",
//       role: "Creator, Chakra UI",
//       avatar: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp",
//       text: "With Chakra UI, I wanted to sync the speed of development with the speed of design. I wanted the developer to be just as excited as the designer to create a screen.",
//       image:
//         "https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
//       altText: "Chakra UI",
//     },
//     {
//       id: 2,
//       name: "John Doe",
//       role: "Frontend Developer",
//       avatar: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp",
//       text: "React is such a powerful tool for building modern web apps. It's easy to learn and highly efficient!",
//       image:
//         "https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
//       altText: "React JS",
//     },
//   ];
//
//   return (
//     <div>
//       {posts.map((post) => (
//         <Post key={post.id} post={post} />
//       ))}
//     </div>
//   );
// }
//
// export default App;
