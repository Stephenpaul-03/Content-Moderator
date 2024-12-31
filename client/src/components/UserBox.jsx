import React from "react";
import {
  Avatar,
  Heading,
  Text,
  Image,
  Divider,
  AvatarGroup,
  Center,
  Card,
  CardHeader,
  CardBody,
} from "@chakra-ui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// UserBox Component to display the post data
function UserBox({ post }) {
  // Checking if the post contains necessary data
  if (
    !post ||
    !post.avatars ||
    !post.exclusiveTitle ||
    !post.imageUrl ||
    !post.productName
  ) {
    return <Text>No post data available</Text>;
  }

  return (
    <>
      <Card variant="filled">
        <CardHeader>
          <Heading size="md" textAlign="center">
            Follow your KYNs
          </Heading>
        </CardHeader>
        <Divider color="gray.300" />
        <CardBody>
          <Center>
            <AvatarGroup size="md" max={3} alignSelf="center">
              {post.avatars.map((avatar, index) => (
                <Avatar key={index} name={avatar.name} src={avatar.src} />
              ))}
            </AvatarGroup>
          </Center>
        </CardBody>
      </Card>
      <Divider color="gray.500" py={3} />
      <Card marginTop="20px" variant="filled">
        <CardHeader>
          <Heading size="md" textAlign="center">
            {post.exclusiveTitle}
          </Heading>
        </CardHeader>
        <Divider color="gray.300" />
        <CardBody>
          <Swiper
            modules={[Autoplay]}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            spaceBetween={10}
            slidesPerView={1}
            grabCursor={true}
            loop
          >
            <SwiperSlide key={post.id}>
              <Card maxW="sm" variant="outline">
                <CardBody>
                  <Image
                    src={post.imageUrl}
                    alt={post.imageAlt}
                    borderRadius="lg"
                  />
                  <Heading size="md" marginTop={5}>
                    {post.productName}
                  </Heading>
                </CardBody>
              </Card>
            </SwiperSlide>
          </Swiper>
        </CardBody>
      </Card>
    </>
  );
}

function App() {
  const avatars = [
    {
      name: "Ryan Florence",
      src: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp",
    },
    {
      name: "Segun Adebayo",
      src: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp",
    },
    {
      name: "Kent Dodds",
      src: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp",
    },
    {
      name: "Prosper Otemuyiwa",
      src: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp",
    },
    {
      name: "Christian Nwamba",
      src: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp",
    },
  ];

  // The posts array with correct structure
  const posts = [
    {
      id: 1,
      avatars: avatars, // This is required
      exclusiveTitle: "Exclusive Post 1", // Title for the post
      imageUrl: "https://via.placeholder.com/800x400?text=Exclusive+Image", // Image URL
      imageAlt: "Exclusive Post Image 1", // Alt text for the image
      productName: "Exclusive Post Title 1", // Name of the product or post
    },
    {
      id: 2,
      avatars: avatars, // This is required
      exclusiveTitle: "Exclusive Post 2", // Title for the post
      imageUrl: "https://via.placeholder.com/800x400?text=Exclusive+Image", // Image URL
      imageAlt: "Exclusive Post Image 2", // Alt text for the image
      productName: "Exclusive Post Title 2", // Name of the product or post
    },
  ];

  return (
    <div>
      {/* Render the first post */}
      {posts.length > 0 && <UserBox key={posts[0].id} post={posts[0]} />}
    </div>
  );
}

export default App;
