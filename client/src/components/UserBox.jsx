import React, { useState } from "react";
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
import "swiper/css";

function UserBox({ post }) {
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
      <Divider color="gray 500" py={3} />
      <Card marginTop="20px" variant="filled">
        <CardHeader>
          <Heading size="md" textAlign="center">
            {post.exclusiveTitle}
          </Heading>
        </CardHeader>
        <Divider color="gray.300" />
        <CardBody>
          <Card maxW="sm">
            <CardBody>
              <Swiper
                spaceBetween={10}
                slidesPerView={1}
                loop={true}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
              >
                <SwiperSlide>
                  <Card maxW="sm" variant="filled">
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
                <SwiperSlide>
                  <Card maxW="sm" variant="filled">
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
        </CardBody>
      </Card>
    </>
  );
}

function App() {
  const posts = [
    {
      id: 1,
      avatars: [
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
        <UserBox key={post.id} post={post} />
      ))}
    </div>
  );
}

export default App;
