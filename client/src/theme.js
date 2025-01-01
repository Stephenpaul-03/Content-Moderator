import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "light", 
    useSystemColorMode: false, 
  },
  colors: {
    brand: {
      50: "#f5e8ff", 
      100: "#e0c0ff",
      200: "#c799ff",
      300: "#a26eff",
      400: "#7f42ff",
      500: "#5c14ff", 
      600: "#4b00cc",
      700: "#390099",
      800: "#260066",
      900: "#140033", 
    },
  },
  fonts: {
    heading: "Arial, sans-serif", 
    body: "Verdana, sans-serif", 
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "bold", 
      },
      sizes: {
        lg: {
          h: "56px",
          fontSize: "lg",
          px: "32px",
        },
      },
      variants: {
        solid: {
          bg: "brand.500",
          color: "white",
          _hover: {
            bg: "brand.600",
          },
        },
      },
    },
  },
});

export default theme;
