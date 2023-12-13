'use client';

import { createTheme, MantineColorsTuple } from '@mantine/core';

const red: MantineColorsTuple = [
  '#ffeae8',
  '#fed7d4',
  '#f3aea9',
  '#ea8179',
  '#e25c52',
  '#de4439',
  '#dd372b',
  '#c4281e',
  '#b0221a',
  '#9a1613',
];

const teal: MantineColorsTuple = [
  '#e8f9fd',
  '#ddeeef',
  '#bfd9dc',
  '#9dc3c7',
  '#81b0b6',
  '#6ea5ac',
  '#62a0a7',
  '#518c92',
  '#437d83',
  '#2e6d73',
];

const grey: MantineColorsTuple = [
  '#fbf3f5',
  '#e7e7e7',
  '#cdcdcd',
  '#b2b2b2',
  '#9a9a9a',
  '#8b8b8b',
  '#848484',
  '#717171',
  '#656565',
  '#5c5557',
];

export const theme = createTheme({
  colors: {
    red,
    teal,
    grey,
  },
});
