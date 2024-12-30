import { Button, useColorMode } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons'

function ThemeSwitcher() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Button onClick={toggleColorMode} mt={0}>
       {colorMode === 'light' ? <MoonIcon/> : <SunIcon/>}
    </Button>
  );
}

export default ThemeSwitcher;
