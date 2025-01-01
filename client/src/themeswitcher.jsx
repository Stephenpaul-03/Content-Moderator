import { Button, useColorMode } from '@chakra-ui/react';
import { Sun, Moon } from 'lucide-react';

function ThemeSwitcher() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Button onClick={toggleColorMode} mt={0} variant='ghost' marginTop={2}>
       {colorMode === 'light' ? <Moon/> : <Sun/>}
    </Button>
  );
}

export default ThemeSwitcher;
